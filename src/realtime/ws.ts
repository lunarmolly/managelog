import { useAuthStore } from '../stores/auth';

type WSEvent = {
  type: string;
  seq: number;
  ts: number;
  payload: any;
};

type WSConfig = {
  url: string;
  pingInterval: number;
  timeout: number;
  maxReconnectAttempts: number;
  backoffBase: number;
};

class WSClient {
  private ws: WebSocket | null = null;
  private config: WSConfig;
  private reconnectAttempts = 0;
  private pingTimer: number | null = null;
  private timeoutTimer: number | null = null;
  private lastSeq = 0;
  private roomId: string | null = null;
  private eventHandlers = new Map<string, (payload: any) => void>();

  constructor(config: WSConfig) {
    this.config = config;
  }

  connect(roomId: string) {
    this.roomId = roomId;
    this.connectInternal();
  }

  private connectInternal() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const auth = useAuthStore();
    const token = auth.accessToken;
    if (!token) {
      console.warn('No access token for WS connection');
      return;
    }

    try {
      this.ws = new WebSocket(this.config.url, [token]);
      this.setupEventHandlers();
    } catch (error) {
      console.error('WS connection failed:', error);
      this.scheduleReconnect();
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WS connected');
      this.reconnectAttempts = 0;
      this.startPing();
      this.subscribe(this.roomId!);
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WSEvent = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Failed to parse WS message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WS disconnected');
      this.stopPing();
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WS error:', error);
    };
  }

  private handleMessage(event: WSEvent) {
    // Idempotency check
    if (event.seq <= this.lastSeq) {
      console.log('Ignoring duplicate/old event:', event.seq);
      return;
    }

    this.lastSeq = event.seq;
    const handler = this.eventHandlers.get(event.type);
    if (handler) {
      handler(event.payload);
    }
  }

  private startPing() {
    this.pingTimer = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
        this.startTimeout();
      }
    }, this.config.pingInterval);
  }

  private stopPing() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }

  private startTimeout() {
    this.timeoutTimer = window.setTimeout(() => {
      console.warn('WS ping timeout');
      this.ws?.close();
    }, this.config.timeout);
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    const delay = this.config.backoffBase * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    setTimeout(() => {
      this.connectInternal();
    }, delay);
  }

  private subscribe(roomId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'subscribe', room: roomId }));
    }
  }

  on(eventType: string, handler: (payload: any) => void) {
    this.eventHandlers.set(eventType, handler);
  }

  off(eventType: string) {
    this.eventHandlers.delete(eventType);
  }

  disconnect() {
    this.stopPing();
    this.ws?.close();
    this.ws = null;
    this.roomId = null;
    this.reconnectAttempts = 0;
  }

  getLastSeq() {
    return this.lastSeq;
  }
}

// Factory function
export function createWSClient(): WSClient {
  const env = import.meta.env.MODE;
  const baseUrl = env === 'development' ? 'ws://localhost:3001' : 'wss://api.managelog.ru';
  
  return new WSClient({
    url: baseUrl,
    pingInterval: 25000, // 25s
    timeout: 50000, // 50s
    maxReconnectAttempts: 5,
    backoffBase: 1000,
  });
}

export function getRoomId(companyId: string, projectId: string): string {
  const env = import.meta.env.MODE;
  return `${env}:company:${companyId}:project:${projectId}`;
}
