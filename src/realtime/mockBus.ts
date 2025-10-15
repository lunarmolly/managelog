// DEV-only mock bus for realtime events
// Simulates WebSocket server behavior across browser tabs

type MockEvent = {
  type: string;
  seq: number;
  ts: number;
  payload: any;
};

type RoomSubscription = {
  roomId: string;
  handlers: Map<string, (payload: any) => void>;
};

class MockBus {
  private subscriptions = new Map<string, RoomSubscription>();
  private globalSeq = 1;
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.broadcastChannel = new BroadcastChannel('managelog-realtime');
      this.broadcastChannel.onmessage = (event) => {
        this.handleBroadcast(event.data);
      };
    }
  }

  subscribe(roomId: string, eventType: string, handler: (payload: any) => void) {
    if (!this.subscriptions.has(roomId)) {
      this.subscriptions.set(roomId, {
        roomId,
        handlers: new Map(),
      });
    }

    const subscription = this.subscriptions.get(roomId)!;
    subscription.handlers.set(eventType, handler);
  }

  unsubscribe(roomId: string, eventType?: string) {
    const subscription = this.subscriptions.get(roomId);
    if (!subscription) return;

    if (eventType) {
      subscription.handlers.delete(eventType);
    } else {
      this.subscriptions.delete(roomId);
    }
  }

  emit(roomId: string, eventType: string, payload: any) {
    const event: MockEvent = {
      type: eventType,
      seq: this.globalSeq++,
      ts: Date.now(),
      payload,
    };

    // Local handlers
    const subscription = this.subscriptions.get(roomId);
    if (subscription) {
      const handler = subscription.handlers.get(eventType);
      if (handler) {
        handler(payload);
      }
    }

    // Broadcast to other tabs
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        roomId,
        event,
      });
    }
  }

  private handleBroadcast(data: { roomId: string; event: MockEvent }) {
    const { roomId, event } = data;
    const subscription = this.subscriptions.get(roomId);
    if (subscription) {
      const handler = subscription.handlers.get(event.type);
      if (handler) {
        handler(event.payload);
      }
    }
  }

  // Simulate server events
  simulateTaskMoved(roomId: string, taskId: string, fromColumnId: string, toColumnId: string, order: string[]) {
    this.emit(roomId, 'task.moved', {
      taskId,
      fromColumnId,
      toColumnId,
      order,
    });
  }

  simulateTaskUpdated(roomId: string, task: any) {
    this.emit(roomId, 'task.updated', { task });
  }

  simulateColumnUpdated(roomId: string, column: any) {
    this.emit(roomId, 'column.updated', { column });
  }

  simulateTimeTracking(roomId: string, taskId: string, totalMs: number, startedAt?: number) {
    this.emit(roomId, 'time.synced', {
      taskId,
      totalMs,
      startedAt,
    });
  }

  destroy() {
    this.subscriptions.clear();
    this.broadcastChannel?.close();
  }
}

// Singleton instance
export const mockBus = new MockBus();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    mockBus.destroy();
  });
}
