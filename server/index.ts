import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import rateLimit from "express-rate-limit";
import session from 'express-session';
import csrf from 'csurf';
import MemoryStore from 'memorystore';
import helmet from 'helmet';

// Rate limiting middleware para protección contra DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar cada IP a 100 solicitudes por ventana
  standardHeaders: true, // Devolver información de límite de velocidad en los encabezados `RateLimit-*`
  legacyHeaders: false, // Deshabilitar los encabezados `X-RateLimit-*`
  message: {
    status: 429,
    message: "Demasiadas solicitudes, por favor intenta nuevamente más tarde."
  }
});

// Limiter específico para el endpoint del webhook (más restrictivo)
export const webhookLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // Limitar cada IP a 10 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Demasiadas solicitudes al webhook, por favor intenta nuevamente más tarde."
  }
});

const app = express();

// Configurar trust proxy para que funcione correctamente con X-Forwarded-For
// Esto es necesario cuando la aplicación se ejecuta detrás de un proxy, como en Replit
app.set('trust proxy', 1);

// Aplicar Helmet para añadir encabezados de seguridad
// Estos encabezados ayudan a proteger contra XSS, clickjacking, sniffing MIME, etc.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Necesario para React/Vite en desarrollo
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:"], // Permitir WebSockets
    },
  },
  crossOriginEmbedderPolicy: false, // Deshabilitar para permitir cargar recursos de otros orígenes
  crossOriginResourcePolicy: false, // Esto es necesario para React/Vite en modo desarrollo
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurar el almacenamiento de sesiones en memoria con limpieza automática
const MemoryStoreSession = MemoryStore(session);
const sessionStore = new MemoryStoreSession({
  checkPeriod: 86400000 // Limpia las sesiones caducadas cada 24 horas
});

// Configuración de sesiones
app.use(session({
  secret: 'ailink-diagnostico-session-secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // En producción, requerir HTTPS
    httpOnly: true, // No accesible mediante JavaScript
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Protección CSRF (Cross-Site Request Forgery)
// Excluimos el punto de conexión del webhook ya que no necesita tokens CSRF
// Y está protegido con rate limiting
const csrfProtection = csrf({ 
  cookie: false, // Usamos sesiones en lugar de cookies para almacenar el token
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
});

// Aplicar el rate limiter global a todas las solicitudes
app.use(limiter);

// Middleware para proporcionar el token CSRF a todas las plantillas/vistas
app.use((req: Request, res: Response, next: NextFunction) => {
  // Excluir el endpoint del webhook de la protección CSRF
  if (req.path === '/api/n8n-webhook') {
    return next();
  }
  
  // Aplicar protección CSRF para las demás rutas
  csrfProtection(req, res, (err) => {
    if (err) {
      console.error('Error CSRF:', err);
      return res.status(403).json({ error: 'Solicitud no válida (CSRF)' });
    }
    
    // Añadir el token CSRF a las respuestas para que el frontend pueda usarlo
    if (req.csrfToken) {
      res.locals.csrfToken = req.csrfToken();
    }
    next();
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
