import { useEffect, useState, useCallback, useRef } from 'react';
import { getWebSocketClient, WebSocketMessage, WebSocketStatus } from '@/lib/websocket';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook personalizado para usar WebSockets en componentes
 */
export function useWebSocket(userSessionId?: string) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);
  const [webhookMessage, setWebhookMessage] = useState<string | null>(null);
  
  // Guardamos un registro de los últimos 10 mensajes recibidos (útil para debugging)
  const messagesHistoryRef = useRef<WebSocketMessage[]>([]);
  const addToHistory = useCallback((message: WebSocketMessage) => {
    messagesHistoryRef.current = [
      message,
      ...messagesHistoryRef.current.slice(0, 9)
    ];
  }, []);

  // Inicializar WebSocket al montar el componente
  useEffect(() => {
    const ws = getWebSocketClient();
    
    // Configurar los callbacks
    ws.setCallbacks({
      onOpen: () => {
        setIsConnected(true);
        console.log('WebSocket conectado');
      },
      onMessage: (data) => {
        console.log('WebSocket: Mensaje recibido:', data);
        
        // Solo procesar mensajes que no tienen userSessionId (mensajes globales) 
        // o que coinciden con nuestro userSessionId
        if (!data.userSessionId || !userSessionId || data.userSessionId === userSessionId) {
          // Guardar el último mensaje recibido
          setLastMessage(data);
          addToHistory(data);
          
          // Procesar mensajes específicos
          if (data.type === 'webhook_status' && data.status) {
            setWebhookStatus(data.status);
            if (data.message) {
              setWebhookMessage(data.message);
            }
            
            // Mostrar toast para algunos estados importantes
            if (['error', 'timeout', 'processing_error'].includes(data.status)) {
              toast({
                title: 'Error de conexión',
                description: data.message || 'Hubo un problema al conectar con el servicio',
                variant: 'destructive',
                duration: 5000,
              });
            } else if (data.status === 'success') {
              toast({
                title: 'Conexión exitosa',
                description: 'Los datos se han procesado correctamente',
                duration: 3000,
              });
            }
          }
        } else {
          console.log('WebSocket: Mensaje filtrado, no corresponde a esta sesión');
        }
      },
      onClose: () => {
        setIsConnected(false);
        console.log('WebSocket desconectado');
      },
      onError: (error) => {
        console.error('Error de WebSocket:', error);
        toast({
          title: 'Error de conexión',
          description: 'No se pudo establecer la conexión WebSocket',
          variant: 'destructive',
          duration: 5000,
        });
      },
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
      }
    });
    
    // Conectar WebSocket
    ws.connect();
    
    // Limpiar al desmontar
    return () => {
      ws.disconnect();
    };
  }, [toast, addToHistory]);

  // Método para enviar mensajes
  const sendMessage = useCallback((data: any) => {
    const ws = getWebSocketClient();
    return ws.send(data);
  }, []);

  // Método para reconectar manualmente
  const reconnect = useCallback(() => {
    const ws = getWebSocketClient();
    ws.disconnect();
    setTimeout(() => {
      ws.connect();
    }, 500);
  }, []);

  return {
    isConnected,
    lastMessage,
    status,
    webhookStatus,
    webhookMessage,
    sendMessage,
    reconnect,
    messagesHistory: messagesHistoryRef.current
  };
}