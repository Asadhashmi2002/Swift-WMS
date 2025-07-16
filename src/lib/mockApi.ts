import { User, Chat, Message, BroadcastTemplate, Broadcast, AnalyticsData } from '../types';

// Mock data for authentication and users
const mockUsers: User[] = [
  {
    id: 'user_1',
    username: 'admin',
    email: 'admin@swiftams.com',
    phone: '+1234567890',
    role: 'admin',
    permissions: ['all'],
    isOnline: true,
  },
  {
    id: 'user_2',
    username: 'manager',
    email: 'manager@swiftams.com',
    phone: '+1234567891',
    role: 'manager',
    permissions: ['view_analytics', 'manage_users', 'broadcast', 'chat', 'view_inbox'],
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: 'user_3',
    username: 'agent1',
    email: 'agent1@swiftams.com',
    phone: '+1234567892',
    role: 'agent',
    permissions: ['chat', 'view_inbox'],
    isOnline: true,
  },
];

// Mock data for chats
const mockChats: Chat[] = [
  {
    id: 'chat_1',
    contactName: 'John Doe',
    contactPhone: '+1234567890',
    lastMessage: 'Hello, I need help with my order',
    lastMessageTime: new Date(Date.now() - 300000), // 5 minutes ago
    unreadCount: 2,
    tags: ['urgent', 'order'],
    isLocked: false,
    assignedAgent: mockUsers[2],
  },
  {
    id: 'chat_2',
    contactName: 'Jane Smith',
    contactPhone: '+1234567891',
    lastMessage: 'Thank you for your help!',
    lastMessageTime: new Date(Date.now() - 900000), // 15 minutes ago
    unreadCount: 0,
    tags: ['resolved'],
    isLocked: false,
  },
  {
    id: 'chat_3',
    contactName: 'Bob Johnson',
    contactPhone: '+1234567892',
    lastMessage: 'When will my package arrive?',
    lastMessageTime: new Date(Date.now() - 1800000), // 30 minutes ago
    unreadCount: 1,
    tags: ['delivery'],
    isLocked: true,
    lockedBy: 'user_2',
    lockExpiry: new Date(Date.now() + 120000), // 2 minutes from now
  },
];

// Mock messages
const mockMessages: Record<string, Message[]> = {
  chat_1: [
    {
      id: 'msg_1',
      chatId: 'chat_1',
      content: 'Hello, I need help with my order #12345',
      type: 'text',
      sender: 'John Doe',
      isInbound: true,
      timestamp: new Date(Date.now() - 600000),
      status: 'read',
    },
    {
      id: 'msg_2',
      chatId: 'chat_1',
      content: 'Hi John! I can help you with that. Let me check your order status.',
      type: 'text',
      sender: 'agent1',
      isInbound: false,
      timestamp: new Date(Date.now() - 480000),
      status: 'delivered',
    },
    {
      id: 'msg_3',
      chatId: 'chat_1',
      content: 'Your order is currently being processed and will ship tomorrow.',
      type: 'text',
      sender: 'agent1',
      isInbound: false,
      timestamp: new Date(Date.now() - 360000),
      status: 'delivered',
    },
    {
      id: 'msg_4',
      chatId: 'chat_1',
      content: 'Great! What time should I expect delivery?',
      type: 'text',
      sender: 'John Doe',
      isInbound: true,
      timestamp: new Date(Date.now() - 300000),
      status: 'read',
    },
  ],
  chat_2: [
    {
      id: 'msg_5',
      chatId: 'chat_2',
      content: 'I received my order and everything looks perfect!',
      type: 'text',
      sender: 'Jane Smith',
      isInbound: true,
      timestamp: new Date(Date.now() - 1200000),
      status: 'read',
    },
    {
      id: 'msg_6',
      chatId: 'chat_2',
      content: 'That\'s wonderful to hear! Thank you for choosing us.',
      type: 'text',
      sender: 'agent1',
      isInbound: false,
      timestamp: new Date(Date.now() - 900000),
      status: 'read',
    },
  ],
};

// Mock templates
const mockTemplates: BroadcastTemplate[] = [
  {
    id: 'template_1',
    name: 'Welcome Message',
    content: 'Welcome to SwiftAMS! We\'re here to help you with all your needs.',
    type: 'text',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: 'template_2',
    name: 'Order Update',
    content: 'Your order {{order_id}} has been {{status}}. Track it here: {{tracking_url}}',
    type: 'text',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
];

// Mock broadcasts
const mockBroadcasts: Broadcast[] = [
  {
    id: 'broadcast_1',
    templateId: 'template_1',
    content: 'Welcome to SwiftAMS! We\'re here to help you with all your needs.',
    audienceTags: ['all'],
    status: 'sent',
    stats: {
      sent: 1250,
      delivered: 1200,
      read: 980,
      replied: 45,
    },
  },
];

// Mock API implementation
export const mockApi = {
  // Authentication
  login: async (credentials: { email?: string; phone?: string; password: string; otp?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    let user: User | undefined;
    
    if (credentials.email) {
      user = mockUsers.find(u => u.email === credentials.email);
    } else if (credentials.phone) {
      user = mockUsers.find(u => u.phone === credentials.phone);
    }
    
    if (!user || credentials.password !== 'password') {
      throw new Error('Invalid credentials');
    }
    
    return {
      user,
      token: 'mock_jwt_token_' + Date.now(),
    };
  },

  sendOtp: async (phone: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`OTP sent to ${phone}: 123456`);
  },

  verifyOtp: async (phone: string, otp: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { valid: otp === '123456' };
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockUsers];
  },

  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      ...userData,
      id: 'user_' + Date.now(),
      isOnline: false,
    };
    mockUsers.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    return mockUsers[userIndex];
  },

  deleteUser: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    mockUsers.splice(userIndex, 1);
  },

  // Chats
  getChats: async (): Promise<Chat[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockChats];
  },

  getChatMessages: async (chatId: string): Promise<Message[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockMessages[chatId] || [];
  },

  // Templates
  getTemplates: async (): Promise<BroadcastTemplate[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockTemplates];
  },

  createTemplate: async (template: Omit<BroadcastTemplate, 'id'>): Promise<BroadcastTemplate> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTemplate: BroadcastTemplate = {
      ...template,
      id: 'template_' + Date.now(),
      createdAt: new Date(),
    };
    mockTemplates.push(newTemplate);
    return newTemplate;
  },

  // Broadcasts
  sendBroadcast: async (broadcast: Omit<Broadcast, 'id' | 'stats'>): Promise<Broadcast> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newBroadcast: Broadcast = {
      ...broadcast,
      id: 'broadcast_' + Date.now(),
      status: broadcast.scheduledAt ? 'scheduled' : 'sent',
      stats: {
        sent: Math.floor(Math.random() * 1000) + 500,
        delivered: Math.floor(Math.random() * 900) + 400,
        read: Math.floor(Math.random() * 700) + 300,
        replied: Math.floor(Math.random() * 100) + 20,
      },
    };
    mockBroadcasts.push(newBroadcast);
    return newBroadcast;
  },

  // Analytics
  getAnalytics: async (startDate: Date, endDate: Date): Promise<AnalyticsData> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const broadcastHistory = Array.from({ length: days }, (_, i) => ({
      date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
      count: Math.floor(Math.random() * 10) + 1,
    }));

    return {
      kpis: {
        sent: 12450,
        delivered: 11980,
        read: 9876,
        replied: 1234,
        recipientsReached: 8765,
      },
      broadcastHistory,
    };
  },
};