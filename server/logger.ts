import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Configuración de colores para diferentes niveles
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Formato personalizado para logs estructurados
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
);

// Formato para consola (desarrollo)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    const { timestamp, level, message, service, userId, requestId, ...meta } = info;
    let logLine = `${timestamp} [${level}]`;
    
    if (service) logLine += ` [${service}]`;
    if (requestId) logLine += ` [req:${requestId.slice(0, 8)}]`;
    if (userId) logLine += ` [user:${userId.slice(0, 8)}]`;
    
    logLine += `: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      logLine += ` | ${JSON.stringify(meta)}`;
    }
    
    return logLine;
  })
);

// Transportes para diferentes niveles
const transports: winston.transport[] = [];

// Consola para desarrollo
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug'
    })
  );
}

// Archivos rotativos para producción
if (process.env.NODE_ENV === 'production') {
  // Logs de error
  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true
    })
  );

  // Logs combinados
  transports.push(
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '7d',
      zippedArchive: true
    })
  );

  // Consola simplificada para producción
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
          return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
        })
      ),
      level: 'info'
    })
  );
} else {
  // Archivo local para desarrollo
  transports.push(
    new winston.transports.File({
      filename: 'logs/debug.log',
      format: logFormat,
      level: 'debug'
    })
  );
}

// Crear logger principal
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: logFormat,
  transports,
  // Manejar excepciones no capturadas
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

// Interfaces para logging estructurado
export interface LogContext {
  service?: string;
  userId?: string;
  requestId?: string;
  action?: string;
  duration?: number;
  statusCode?: number;
  method?: string;
  url?: string;
  userAgent?: string;
  ip?: string;
  [key: string]: any;
}

// Funciones helper para logging estructurado
export const log = {
  error: (message: string, context?: LogContext, error?: Error) => {
    logger.error(message, { 
      ...context, 
      stack: error?.stack,
      errorName: error?.name,
      errorMessage: error?.message 
    });
  },
  
  warn: (message: string, context?: LogContext) => {
    logger.warn(message, context);
  },
  
  info: (message: string, context?: LogContext) => {
    logger.info(message, context);
  },
  
  http: (message: string, context?: LogContext) => {
    logger.http(message, context);
  },
  
  debug: (message: string, context?: LogContext) => {
    logger.debug(message, context);
  },
  
  // Log específico para requests HTTP
  request: (method: string, url: string, statusCode: number, duration: number, context?: LogContext) => {
    logger.http('HTTP Request', {
      method,
      url,
      statusCode,
      duration,
      ...context
    });
  },
  
  // Log específico para WebSocket
  websocket: (event: string, context?: LogContext) => {
    logger.info(`WebSocket: ${event}`, { service: 'websocket', ...context });
  },
  
  // Log específico para webhook
  webhook: (event: string, context?: LogContext) => {
    logger.info(`Webhook: ${event}`, { service: 'webhook', ...context });
  },
  
  // Log específico para base de datos
  database: (query: string, duration?: number, context?: LogContext) => {
    logger.debug('Database Query', { 
      service: 'database', 
      query: query.substring(0, 100), 
      duration,
      ...context 
    });
  }
};

export default logger;