/**
 * Cliente WebSocket para comunicación en tiempo real
 */

// Tipos de mensajes que puede recibir o enviar nuestro WebSocket
export type WebSocketMessageType = 
  | 'connection'
  | 'webhook_status'
  | 'ping'
  | 'pong'
  | 'heartbeat'
  | 'error';

// Interfaz para los mensajes de WebSocket
export interface WebSocketMessage {
  type: WebSocketMessageType;
  message?: string;
  status?: string;
  statusCode?: number;
  requestId?: string;
  userSessionId?: string; // ID único del usuario para filtrar mensajes
  timestamp: string;
  [key: string]: any; // Para permitir propiedades adicionales
}

// Estados posibles para WebSocket
export type WebSocketStatus = 'connecting' | 'open' | 'closing' | 'closed' | 'error';

// Interfaz para callbacks de eventos WebSocket
export interface WebSocketCallbacks {
  onOpen?: () => void;
  onMessage?: (data: WebSocketMessage) => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onStatusChange?: (status: WebSocketStatus) => void;
}

/**
 * Clase para gestionar la conexión WebSocket
 */
export class WebSocketClient {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number = 1000; // ms
  private reconnectTimer: NodeJS.Timeout | null = null;
  private status: WebSocketStatus = 'closed';
  private callbacks: WebSocketCallbacks = {};
  private pingInterval: NodeJS.Timeout | null = null;

  /**
   * Constructor para WebSocketClient
   * @param baseUrl URL base para la conexión WebSocket (opcional, por defecto usa la URL actual)
   */
  constructor(private baseUrl?: string) {
    // Si no se proporciona una URL base, usar la URL actual
    if (!baseUrl) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      this.baseUrl = `${protocol}//${window.location.host}`;
    }
  }

  /**
   * Establece los callbacks para eventos WebSocket
   * @param callbacks Objeto con funciones callback para diferentes eventos
   */
  setCallbacks(callbacks: WebSocketCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Inicia la conexión WebSocket
   */
  connect(): void {
    // Si ya hay una conexión activa, no hacemos nada
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket: Ya existe una conexión activa.');
      return;
    }

    // Actualizamos el estado
    this.updateStatus('connecting');
    
    try {
      // Creamos una nueva conexión WebSocket
      const wsUrl = `${this.baseUrl}/ws`;
      console.log(`WebSocket: Conectando a ${wsUrl}...`);
      
      this.socket = new WebSocket(wsUrl);
      
      // Configuramos los manejadores de eventos
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket: Error al crear la conexión:', error);
      this.updateStatus('error');
      this.attemptReconnect();
    }
  }

  /**
   * Cierra la conexión WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      // Detenemos el ping interval
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
      
      // Detenemos cualquier intento de reconexión
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      
      // Cerramos la conexión
      this.updateStatus('closing');
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Envía un mensaje a través del WebSocket
   * @param data Datos a enviar
   * @returns true si se envió correctamente, false en caso contrario
   */
  send(data: any): boolean {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        const message = typeof data === 'string' ? data : JSON.stringify(data);
        this.socket.send(message);
        return true;
      } catch (error) {
        console.error('WebSocket: Error al enviar mensaje:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Envía un ping al servidor para mantener la conexión viva
   */
  ping(): void {
    this.send({
      type: 'ping',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Obtiene el estado actual de la conexión
   */
  getStatus(): WebSocketStatus {
    return this.status;
  }

  /**
   * Manejador para el evento de apertura de conexión
   */
  private handleOpen(event: Event): void {
    console.log('WebSocket: Conexión establecida');
    this.updateStatus('open');
    this.reconnectAttempts = 0;
    
    // Configuramos un ping periódico para mantener la conexión viva
    this.pingInterval = setInterval(() => {
      this.ping();
    }, 25000); // Cada 25 segundos
    
    // Llamamos al callback onOpen si existe
    if (this.callbacks.onOpen) {
      this.callbacks.onOpen();
    }
  }

  /**
   * Manejador para el evento de recepción de mensaje
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data) as WebSocketMessage;
      
      // Log condicional para debugging
      if (data.type !== 'heartbeat') {
        console.log('WebSocket: Mensaje recibido:', data);
      }
      
      // Llamamos al callback onMessage si existe
      if (this.callbacks.onMessage) {
        this.callbacks.onMessage(data);
      }
    } catch (error) {
      console.error('WebSocket: Error al procesar mensaje:', error, event.data);
    }
  }

  /**
   * Manejador para el evento de cierre de conexión
   */
  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket: Conexión cerrada. Código: ${event.code}, Razón: ${event.reason}`);
    this.updateStatus('closed');
    
    // Limpiamos el ping interval
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    // Intentamos reconectar si el cierre no fue intencional
    this.attemptReconnect();
    
    // Llamamos al callback onClose si existe
    if (this.callbacks.onClose) {
      this.callbacks.onClose();
    }
  }

  /**
   * Manejador para el evento de error
   */
  private handleError(event: Event): void {
    console.error('WebSocket: Error en la conexión:', event);
    this.updateStatus('error');
    
    // Llamamos al callback onError si existe
    if (this.callbacks.onError) {
      this.callbacks.onError(event);
    }
  }

  /**
   * Intenta reconectar después de un error o cierre
   */
  private attemptReconnect(): void {
    // Si ya llegamos al número máximo de intentos, no seguimos
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log(`WebSocket: Máximo número de intentos de reconexión (${this.maxReconnectAttempts}) alcanzado.`);
      return;
    }
    
    // Aumentamos el contador de intentos y el timeout (backoff exponencial)
    this.reconnectAttempts++;
    const timeout = this.reconnectTimeout * Math.pow(1.5, this.reconnectAttempts - 1);
    
    console.log(`WebSocket: Intentando reconectar en ${timeout}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    // Programamos la reconexión
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, timeout);
  }

  /**
   * Actualiza el estado y notifica a través del callback
   */
  private updateStatus(status: WebSocketStatus): void {
    this.status = status;
    
    // Llamamos al callback onStatusChange si existe
    if (this.callbacks.onStatusChange) {
      this.callbacks.onStatusChange(status);
    }
  }
}

// Instancia singleton para usar en toda la aplicación
let wsClientInstance: WebSocketClient | null = null;

/**
 * Obtiene o crea la instancia singleton del cliente WebSocket
 */
export function getWebSocketClient(baseUrl?: string): WebSocketClient {
  if (!wsClientInstance) {
    wsClientInstance = new WebSocketClient(baseUrl);
  }
  return wsClientInstance;
}