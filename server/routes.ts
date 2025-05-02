import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import https from "https";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Proxy para el webhook de n8n
  app.post("/api/n8n-webhook", (req: Request, res: Response) => {
    console.log("Recibiendo solicitud de proxy para webhook n8n");
    
    try {
      // Preparar los datos limpiando posibles caracteres problemáticos
      const cleanData = {
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
          'Content-Length': formData.toString().length
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
          
          // Intentamos parsear la respuesta para ver si es un JSON válido
          let jsonResponse;
          try {
            jsonResponse = JSON.parse(responseData);
          } catch (e) {
            // Si no es un JSON válido, enviamos la respuesta tal cual
            jsonResponse = { message: responseData };
          }
          
          // Enviar la respuesta al cliente
          res.status(proxyRes.statusCode || 200).json(jsonResponse);
        });
      });
      
      // Configurar un timeout para la solicitud al webhook
      const timeout = setTimeout(() => {
        console.log("Timeout alcanzado en la solicitud al webhook");
        proxyReq.destroy();
        res.status(504).json({ 
          error: 'Timeout en la solicitud al webhook',
          message: 'La solicitud al webhook ha tardado demasiado tiempo en responder'
        });
      }, 12000); // 12 segundos de timeout
      
      proxyReq.on('error', (error) => {
        clearTimeout(timeout);
        console.error("Error en proxy de n8n:", error);
        res.status(500).json({ 
          error: 'Error al contactar con el webhook',
          message: error.message
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
      res.status(500).json({ 
        error: 'Error al procesar la solicitud',
        message: error?.message || 'Se produjo un error desconocido',
        timestamp: new Date().toISOString()
      });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
