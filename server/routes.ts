import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer } from "ws";
import { webhookLimiter } from "./index";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Ruta para obtener el token CSRF
  app.get("/api/csrf-token", (req: Request, res: Response) => {
    if (!req.csrfToken) {
      return res
        .status(500)
        .json({ error: "Protección CSRF no está habilitada" });
    }

    // Envía el token CSRF al cliente
    return res.json({ csrfToken: req.csrfToken() });
  });

  // Proxy para el webhook de n8n con protección específica contra DDoS
  app.post(
    "/api/n8n-webhook",
    webhookLimiter,
    async (req: Request, res: Response) => {
      console.log("Recibiendo solicitud de proxy para webhook n8n");

      // Generar un ID único para esta solicitud específica del usuario
      const userSessionId = req.body.userSessionId || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const requestId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      // Verificar si hay un campo honeypot - Protección adicional contra bots
      if (req.body.honeypot) {
        console.log("Detectado bot por honeypot en el servidor");
        // Simular respuesta exitosa pero no procesar realmente
        return res.status(200).json({
          saludo: "Hola",
          ciudad_region: "Tu ciudad",
          diagnostico_nicho: {
            nicho_sugerido: "Nicho personalizado",
            razon_clave: "Basado en tus respuestas",
            problema_principal: "Identificado según tus datos",
            solucion_mvp: "Solución personalizada para tu caso",
          },
          impulso_personal: {
            desafio_usuario: "Tu desafío",
            consejo_reto: "Consejo personalizado",
            habilidades_usuario: "Tus habilidades",
            ventaja_habilidad: "Ventaja competitiva",
          },
          proximo_paso: {
            modulo: "Siguiente módulo recomendado",
            accion_concreta: "Acción recomendada",
            compromiso_comunidad: "Compromiso sugerido",
          },
        });
      }

      try {
        // Notificar por WebSocket que se inició el proceso
        broadcastToClients({
          type: "webhook_status",
          status: "starting",
          message: "Iniciando solicitud a webhook...",
          requestId,
          timestamp: new Date().toISOString(),
        });

        // Preparar payload en el formato específico requerido
        const cleanData = {
          nombre: String(req.body.nombre || "").trim(),
          experiencia_previa: String(req.body.experiencia_previa || "").trim(),
          correo: String(req.body.correo || "").trim(),
          publico_interes: String(req.body.publico_interes || "").trim(),
          mejora_deseada: String(req.body.mejora_deseada || "").trim(),
          idea_libre: String(req.body.idea_libre || "").trim(),
          horas_semana: String(req.body.horas_semana || "5-10").trim(),
        };

        console.log("Datos limpios preparados para envío:", cleanData);

        // Notificar por WebSocket que los datos se han preparado SOLO para este usuario
        broadcastToClients({
          type: "webhook_status",
          status: "data_prepared",
          message: "Datos preparados correctamente",
          requestId,
          userSessionId,
          timestamp: new Date().toISOString(),
        });

        // Usar JSON como formato de envío
        const jsonPayload = JSON.stringify(cleanData);

        // Preparar la solicitud a n8n con la nueva URL
        // const webhookUrl = "https://ailink.app.n8n.cloud/webhook-test/67bdb302-d71e-4eb4-9ced-6a23b74fb7e7";
        const webhookUrl =
          "https://tutorialyoutubeailink.app.n8n.cloud/webhook/67bdb302-d71e-4eb4-9ced-6a23b74fb7e7";

        console.log("Enviando datos a n8n:", cleanData);

        // Notificar por WebSocket que se está enviando la solicitud SOLO para este usuario
        broadcastToClients({
          type: "webhook_status",
          status: "sending",
          message: "Enviando solicitud a webhook externo...",
          requestId,
          userSessionId,
          timestamp: new Date().toISOString(),
        });

        // Obtener la clave de autenticación desde las variables de entorno
        const webhookAuthKey = process.env.LAMBDA;
        if (!webhookAuthKey) {
          throw new Error(
            "WEBHOOK_AUTH_KEY no está configurada en las variables de entorno",
          );
        }

        // Realizar la solicitud a n8n usando fetch con autenticación segura
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "AILINK-Diagnostic-App/1.0",
            Accept: "application/json",
            "x-lambda-key": webhookAuthKey,
          },
          body: jsonPayload,
        });

        console.log("Respuesta de n8n - Status:", response.status);
        const responseText = await response.text();
        console.log("Respuesta de n8n - Texto:", responseText);

        let jsonResponse;
        try {
          jsonResponse = JSON.parse(responseText);

          broadcastToClients({
            type: "webhook_status",
            status: "success",
            message: "Respuesta procesada exitosamente",
            requestId,
            userSessionId,
            timestamp: new Date().toISOString(),
          });

          res.status(200).json(jsonResponse);
        } catch (parseError) {
          console.log("La respuesta no es JSON válido:", parseError);

          broadcastToClients({
            type: "webhook_status",
            status: "warning",
            message: "Respuesta recibida pero no es JSON válido",
            requestId,
            userSessionId,
            timestamp: new Date().toISOString(),
          });

          res.status(200).json({
            message: responseText,
            raw_response: responseText,
          });
        }
      } catch (error) {
        console.error("Error al procesar la solicitud:", error);

        // Notificar error por WebSocket
        broadcastToClients({
          type: "webhook_status",
          status: "processing_error",
          message: `Error interno al procesar la solicitud: ${error.message}`,
          requestId,
          timestamp: new Date().toISOString(),
        });

        res.status(500).json({
          error: "Error al procesar la solicitud",
          message: error.message,
        });
      }
    },
  );

  const httpServer = createServer(app);

  // Configure WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const clients = new Set();

  // Function to broadcast messages to all connected clients
  function broadcastToClients(message: any) {
    const messageStr = JSON.stringify(message);
    clients.forEach((client: any) => {
      if (client.readyState === client.OPEN) {
        client.send(messageStr);
      }
    });
  }

  // Make broadcastToClients globally available for the webhook route
  (global as any).broadcastToClients = broadcastToClients;

  wss.on("connection", (ws) => {
    console.log("Nueva conexión WebSocket establecida");
    clients.add(ws);

    // Send welcome message
    ws.send(
      JSON.stringify({
        type: "connection",
        message: "Conexión WebSocket establecida correctamente",
        timestamp: new Date().toISOString(),
      }),
    );

    // Handle incoming messages
    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log("Mensaje WebSocket recibido:", message);

        // Echo back pong for ping messages
        if (message.type === "ping") {
          ws.send(
            JSON.stringify({
              type: "pong",
              timestamp: new Date().toISOString(),
            }),
          );
        }
      } catch (error) {
        console.error("Error al procesar mensaje WebSocket:", error);
      }
    });

    // Handle connection close
    ws.on("close", () => {
      console.log("Conexión WebSocket cerrada");
      clients.delete(ws);
    });

    // Handle errors
    ws.on("error", (error) => {
      console.error("Error en WebSocket:", error);
      clients.delete(ws);
    });
  });

  return httpServer;
}

// Make broadcastToClients available globally so it can be used in the webhook route
declare global {
  var broadcastToClients: (message: any) => void;
}
