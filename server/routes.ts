import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import https from "https";
import { WebSocketServer } from 'ws';
import { webhookLimiter } from "./index";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Proxy para el webhook de n8n con protección específica contra DDoS
  app.post("/api/n8n-webhook", webhookLimiter, (req: Request, res: Response) => {
    console.log("Recibiendo solicitud de proxy para webhook n8n");
    
    // Generar un ID único para esta solicitud
    const requestId = Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
    
    try {
      // Notificar por WebSocket que se inició el proceso
      broadcastToClients({
        type: 'webhook_status',
        status: 'starting',
        message: 'Iniciando solicitud a webhook...',
        requestId,
        timestamp: new Date().toISOString()
      });
      
      // Preparar los datos limpiando posibles caracteres problemáticos
      const cleanData = {
        nombre: String(req.body.nombre || '').trim(),
        correo: String(req.body.correo || '').trim(),
        ciudad: String(req.body.ciudad || '').trim(),
        nichos: String(req.body.nichos || '').trim(),
        tipos_negocio: String(req.body.tipos_negocio || '').trim(),
        desafio: String(req.body.desafio || '').trim(),
        habilidades: String(req.body.habilidades || '').trim(),
        tiempo: String(req.body.tiempo || '').trim(),
        objetivo: String(req.body.objetivo || '').trim(),
        comentarios: String(req.body.comentarios || '').trim(),
        fecha: new Date().toISOString()
      };
      
      console.log("Datos limpios preparados para envío:", cleanData);
      
      // Notificar por WebSocket que los datos se han preparado
      broadcastToClients({
        type: 'webhook_status',
        status: 'data_prepared',
        message: 'Datos preparados correctamente',
        requestId,
        timestamp: new Date().toISOString()
      });
      
      // Convertir a form-urlencoded (formato que sabemos que funciona con curl)
      const formData = new URLSearchParams();
      Object.entries(cleanData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Preparar la solicitud a n8n
      const webhookUrl = "https://ailink.app.n8n.cloud/webhook/3f5e399a-5c46-4b10-8220-8ccdf0388a3b";
      
      // Opciones para la solicitud
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': formData.toString().length,
          'User-Agent': 'AILINK-Diagnostic-App/1.0',
          'Accept': 'application/json',
          'Connection': 'close' // Para evitar problemas con keep-alive
        },
        timeout: 15000 // 15 segundos de timeout
      };
      
      // Notificar por WebSocket que se está enviando la solicitud
      broadcastToClients({
        type: 'webhook_status',
        status: 'sending',
        message: 'Enviando solicitud a webhook externo...',
        requestId,
        timestamp: new Date().toISOString()
      });
      
      // Realizar la solicitud a n8n
      const proxyReq = https.request(webhookUrl, options, (proxyRes) => {
        let responseData = '';
        
        // Notificar que hemos recibido headers
        broadcastToClients({
          type: 'webhook_status',
          status: 'receiving',
          message: `Recibiendo respuesta (HTTP ${proxyRes.statusCode})...`,
          statusCode: proxyRes.statusCode,
          requestId,
          timestamp: new Date().toISOString()
        });
        
        proxyRes.on('data', (chunk) => {
          responseData += chunk;
        });
        
        proxyRes.on('end', () => {
          console.log("Respuesta de n8n:", responseData);
          
          // Intentamos parsear la respuesta para ver si es un JSON válido
          let jsonResponse;
          try {
            jsonResponse = JSON.parse(responseData);
            
            // Notificar que hemos procesado la respuesta exitosamente
            broadcastToClients({
              type: 'webhook_status',
              status: 'success',
              message: 'Respuesta recibida y procesada correctamente',
              statusCode: proxyRes.statusCode,
              requestId,
              timestamp: new Date().toISOString()
            });
            
          } catch (e) {
            console.error("Error al parsear la respuesta JSON:", e);
            
            // Si no es un JSON válido, preparamos una respuesta alternativa
            jsonResponse = { 
              message: responseData, 
              error: 'Error al parsear la respuesta como JSON' 
            };
            
            // Notificar que hubo un problema con el formato de la respuesta
            broadcastToClients({
              type: 'webhook_status',
              status: 'format_error',
              message: 'La respuesta no tiene un formato JSON válido',
              statusCode: proxyRes.statusCode,
              requestId,
              timestamp: new Date().toISOString()
            });
          }
          
          // Enviar la respuesta al cliente
          res.status(proxyRes.statusCode || 200).json(jsonResponse);
        });
      });
      
      // Configurar un timeout para la solicitud al webhook
      const timeout = setTimeout(() => {
        console.log("Timeout alcanzado en la solicitud al webhook");
        proxyReq.destroy();
        
        // Notificar timeout por WebSocket
        broadcastToClients({
          type: 'webhook_status',
          status: 'timeout',
          message: 'La solicitud al webhook ha tardado demasiado tiempo',
          requestId,
          timestamp: new Date().toISOString()
        });
        
        res.status(504).json({ 
          error: 'Timeout en la solicitud al webhook',
          message: 'La solicitud al webhook ha tardado demasiado tiempo en responder',
          requestId
        });
      }, 12000); // 12 segundos de timeout
      
      proxyReq.on('error', (error) => {
        clearTimeout(timeout);
        console.error("Error en proxy de n8n:", error);
        
        // Notificar error por WebSocket
        broadcastToClients({
          type: 'webhook_status',
          status: 'error',
          message: `Error al contactar con el webhook: ${error.message}`,
          requestId,
          timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ 
          error: 'Error al contactar con el webhook',
          message: error.message,
          requestId
        });
      });
      
      // Limpiar timeout cuando finalice la solicitud
      proxyReq.on('response', (proxyRes) => {
        proxyRes.on('end', () => {
          clearTimeout(timeout);
        });
      });
      
      // Enviar los datos
      proxyReq.write(formData.toString());
      proxyReq.end();
      
    } catch (error: any) {
      console.error("Error al procesar la solicitud:", error);
      
      // Notificar error por WebSocket
      broadcastToClients({
        type: 'webhook_status',
        status: 'processing_error',
        message: `Error interno al procesar la solicitud: ${error?.message || 'Error desconocido'}`,
        requestId,
        timestamp: new Date().toISOString()
      });
      
      res.status(500).json({ 
        error: 'Error al procesar la solicitud',
        message: error?.message || 'Se produjo un error desconocido',
        timestamp: new Date().toISOString(),
        requestId
      });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);
  
  // Configurar WebSocket en un path distinto del que usa Vite para HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Manejador de conexiones WebSocket
  wss.on('connection', (ws) => {
    console.log('Nueva conexión WebSocket establecida');
    
    // Enviar mensaje de bienvenida
    ws.send(JSON.stringify({ 
      type: 'connection', 
      message: 'Conexión WebSocket establecida correctamente',
      timestamp: new Date().toISOString()
    }));
    
    // Manejador de mensajes recibidos
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Mensaje WebSocket recibido:', data);
        
        // Responder según el tipo de mensaje
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ 
            type: 'pong', 
            timestamp: new Date().toISOString() 
          }));
        }
      } catch (error) {
        console.error('Error al procesar mensaje WebSocket:', error);
      }
    });
    
    // Manejador de desconexión
    ws.on('close', () => {
      console.log('Conexión WebSocket cerrada');
    });
    
    // Manejador de errores
    ws.on('error', (error) => {
      console.error('Error en conexión WebSocket:', error);
    });
  });
  
  // Función para enviar mensajes a todos los clientes conectados
  const broadcastToClients = (message: any) => {
    wss.clients.forEach((client) => {
      // La constante WebSocket.OPEN no está disponible aquí, usamos el valor numérico 1
      if (client.readyState === 1) { // 1 = OPEN en el estándar WebSocket
        client.send(JSON.stringify(message));
      }
    });
  };
  
  // Crear un heartbeat para mantener las conexiones activas
  setInterval(() => {
    wss.clients.forEach((client) => {
      // La constante WebSocket.OPEN no está disponible aquí, usamos el valor numérico 1
      if (client.readyState === 1) { // 1 = OPEN en el estándar WebSocket
        client.send(JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() }));
      }
    });
  }, 30000); // Cada 30 segundos

  return httpServer;
}
