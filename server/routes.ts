import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import https from "https";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Proxy para el webhook de n8n
  app.post("/api/n8n-webhook", (req: Request, res: Response) => {
    console.log("Recibiendo solicitud de proxy para webhook n8n:", req.body);
    
    // Preparar la solicitud a n8n
    const webhookUrl = "https://ailink.app.n8n.cloud/webhook/3f5e399a-5c46-4b10-8220-8ccdf0388a3b";
    const data = JSON.stringify(req.body);
    
    // Opciones para la solicitud
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    // Realizar la solicitud a n8n
    const proxyReq = https.request(webhookUrl, options, (proxyRes) => {
      let responseData = '';
      
      proxyRes.on('data', (chunk) => {
        responseData += chunk;
      });
      
      proxyRes.on('end', () => {
        console.log("Respuesta de n8n:", responseData);
        // Enviar la respuesta al cliente
        res.status(proxyRes.statusCode || 200).send(responseData);
      });
    });
    
    proxyReq.on('error', (error) => {
      console.error("Error en proxy de n8n:", error);
      res.status(500).json({ error: 'Error al contactar con el webhook' });
    });
    
    // Enviar los datos
    proxyReq.write(data);
    proxyReq.end();
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
