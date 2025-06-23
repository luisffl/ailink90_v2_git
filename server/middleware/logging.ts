import { Request, Response, NextFunction } from 'express';
import { log } from '../logger';

// Middleware para capturar y loggear errores de manera estructurada
export const errorLoggerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const requestId = (req as any).requestId;
  
  // Determinar el nivel de severidad del error
  const statusCode = err.statusCode || err.status || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;
  
  if (isClientError) {
    log.warn("Error de cliente", {
      requestId,
      statusCode,
      url: req.originalUrl,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      service: "http"
    });
  } else {
    log.error("Error del servidor", {
      requestId,
      statusCode,
      url: req.originalUrl,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      service: "http"
    }, err);
  }
  
  next(err);
};

// Middleware para loggear requests lentos
export const slowRequestMiddleware = (threshold: number = 5000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const requestId = (req as any).requestId;
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      
      if (duration > threshold) {
        log.warn("Request lento detectado", {
          requestId,
          duration,
          threshold,
          url: req.originalUrl,
          method: req.method,
          statusCode: res.statusCode,
          service: "performance"
        });
      }
    });
    
    next();
  };
};

// Middleware para loggear información de seguridad
export const securityLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = (req as any).requestId;
  const userAgent = req.get('User-Agent') || '';
  const ip = req.ip;
  
  // Detectar patrones sospechosos
  const suspiciousPatterns = [
    /sqlmap/i,
    /nmap/i,
    /nikto/i,
    /curl.*bot/i,
    /python-requests/i
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  
  if (isSuspicious) {
    log.warn("Actividad sospechosa detectada", {
      requestId,
      ip,
      userAgent,
      url: req.originalUrl,
      method: req.method,
      service: "security"
    });
  }
  
  // Loggear intentos de acceso a rutas sensibles
  const sensitiveRoutes = ['/admin', '/config', '/.env', '/secrets'];
  if (sensitiveRoutes.some(route => req.originalUrl.includes(route))) {
    log.warn("Intento de acceso a ruta sensible", {
      requestId,
      ip,
      userAgent,
      url: req.originalUrl,
      method: req.method,
      service: "security"
    });
  }
  
  next();
};