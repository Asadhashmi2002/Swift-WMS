import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private mockMode: boolean = false;
  private connectionAttempted: boolean = false;

  connect(token: string) {
    if (this.socket?.connected || this.connectionAttempted) return;
    
    this.connectionAttempted = true;

    // Try to connect to real server first
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3001';
    
    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
      timeout: 5000, // 5 second timeout
    });

    this.socket.on('connect', () => {
      console.log('Socket connected to real server');
      this.mockMode = false;
    });

    this.socket.on('connect_error', (error) => {
      console.warn('Socket connection failed, switching to mock mode:', error.message);
      this.enableMockMode();
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Re-register all listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, callback);
      });
    });

    // Fallback to mock mode after timeout
    setTimeout(() => {
      if (!this.socket?.connected && !this.mockMode) {
        console.warn('Socket connection timeout, switching to mock mode');
        this.enableMockMode();
      }
    }, 6000);
  }

  private enableMockMode() {
    this.mockMode = true;
    
    // Simulate connection
    setTimeout(() => {
      this.triggerEvent('connect');
    }, 100);

    // Mock some real-time events for demo purposes
    this.startMockEvents();
  }

  private startMockEvents() {
    // Simulate periodic connection status
    setInterval(() => {
      if (this.mockMode) {
        // Randomly simulate some chat activity
        if (Math.random() > 0.95) {
          this.triggerEvent('message', {
            id: `msg_${Date.now()}`,
            chatId: 'chat_1',
            content: 'This is a simulated message for demo purposes',
            type: 'text',
            sender: 'customer',
            timestamp: new Date(),
            status: 'delivered'
          });
        }
      }
    }, 10000);
  }

  private triggerEvent(event: string, data?: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in socket event callback:', error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.mockMode = false;
    this.connectionAttempted = false;
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    if (this.socket && !this.mockMode) {
      this.socket.on(event, callback as any);
    }
  }

  off(event: string, callback?: Function) {
    if (callback) {
      const callbacks = this.listeners.get(event) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      this.listeners.delete(event);
    }

    if (this.socket && !this.mockMode) {
      this.socket.off(event, callback as any);
    }
  }

  emit(event: string, data?: any) {
    if (this.socket && !this.mockMode) {
      this.socket.emit(event, data);
    } else if (this.mockMode) {
      // Mock the emit behavior
      console.log(`[Mock Socket] Emitting ${event}:`, data);
      
      // Simulate some responses
      if (event === 'send-message') {
        setTimeout(() => {
          this.triggerEvent('message', {
            id: `msg_${Date.now()}`,
            chatId: data.chatId,
            content: data.content,
            type: data.type || 'text',
            sender: 'agent',
            timestamp: new Date(),
            status: 'sent'
          });
        }, 100);
      }
    }
  }

  joinRoom(roomId: string) {
    this.emit('join-room', { roomId });
  }

  leaveRoom(roomId: string) {
    this.emit('leave-room', { roomId });
  }

  lockChat(chatId: string) {
    this.emit('lock-chat', { chatId });
    
    // In mock mode, simulate immediate lock confirmation
    if (this.mockMode) {
      setTimeout(() => {
        this.triggerEvent('chat-locked', { chatId, lockedBy: 'current-user' });
      }, 50);
    }
  }

  unlockChat(chatId: string) {
    this.emit('unlock-chat', { chatId });
    
    // In mock mode, simulate immediate unlock confirmation
    if (this.mockMode) {
      setTimeout(() => {
        this.triggerEvent('chat-unlocked', { chatId });
      }, 50);
    }
  }

  sendMessage(chatId: string, content: string, type: string = 'text') {
    this.emit('send-message', { chatId, content, type });
  }

  get connected() {
    return this.socket?.connected || this.mockMode;
  }

  get isMockMode() {
    return this.mockMode;
  }
}

export const socketService = new SocketService();