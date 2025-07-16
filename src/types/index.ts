export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'agent';
  permissions: string[];
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    accent: string;
    gray: string;
    text: string;
    background: string;
    surface: string;
    border: string;
  };
}

export interface Chat {
  id: string;
  contactName: string;
  contactPhone: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  tags: string[];
  isLocked: boolean;
  lockedBy?: string;
  lockExpiry?: Date;
  assignedAgent?: User;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'note';
  sender: string;
  isInbound: boolean;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  noteAuthor?: string;
}

export interface BroadcastTemplate {
  id: string;
  name: string;
  content: string;
  type: 'text' | 'image' | 'poll';
  createdAt: Date;
}

export interface Broadcast {
  id: string;
  templateId: string;
  content: string;
  audienceTags: string[];
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  stats?: {
    sent: number;
    delivered: number;
    read: number;
    replied: number;
  };
}

export interface AnalyticsData {
  kpis: {
    sent: number;
    delivered: number;
    read: number;
    replied: number;
    recipientsReached: number;
  };
  broadcastHistory: Array<{
    date: string;
    count: number;
  }>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isTwoFactorEnabled: boolean;
  loading: boolean;
}

export interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Record<string, Message[]>;
  isConnected: boolean;
}

export interface BroadcastState {
  templates: BroadcastTemplate[];
  broadcasts: Broadcast[];
  currentBroadcast: Partial<Broadcast> | null;
}

export interface AppState {
  theme: Theme;
  sidebarOpen: boolean;
  users: User[];
  seatLimit: number;
}

export interface BusinessManager {
  id: string;
  name: string;
  verification_status: 'verified' | 'pending' | 'rejected';
  created_time: string;
}

export interface WhatsAppBusinessAccount {
  id: string;
  name: string;
  account_review_status: 'approved' | 'pending' | 'rejected';
  business_verification_status: 'verified' | 'pending' | 'rejected';
  country: string;
  currency: string;
}

export interface PhoneNumber {
  id: string;
  display_phone_number: string;
  verified_name: string;
  code_verification_status: 'verified' | 'pending' | 'not_verified';
  quality_rating: 'green' | 'yellow' | 'red';
  messaging_limit_tier: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'marketing' | 'utility' | 'authentication';
  language: string;
  status: 'approved' | 'pending' | 'rejected';
  components: TemplateComponent[];
}

export interface TemplateComponent {
  type: 'header' | 'body' | 'footer' | 'buttons';
  format?: 'text' | 'image' | 'video' | 'document';
  text?: string;
  example?: {
    header_text?: string[];
    body_text?: string[][];
  };
}

export interface WizardState {
  currentStep: number;
  completed: boolean;
  data: {
    fbAccessToken?: string;
    selectedBusinessId?: string;
    selectedWabaId?: string;
    phoneNumber?: string;
    verificationCode?: string;
    phoneNumberId?: string;
    webhookUrl?: string;
    verifyToken?: string;
  };
}

export interface ApiCredentials {
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
  webhookUrl: string;
  verifyToken: string;
}

export interface CreditBalance {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: Date;
  isLow: boolean;
  lowBalanceThreshold: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  description: string;
  isPopular?: boolean;
  discount?: number;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  amount: number;
  credits: number;
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod?: string;
  invoiceId?: string;
}

export interface CreditUsage {
  id: string;
  userId: string;
  date: Date;
  messagesSent: number;
  creditsUsed: number;
  costPerMessage: number;
  totalCost: number;
}

export interface CreditUsageStats {
  totalCreditsUsed: number;
  totalMessagesSent: number;
  averageCostPerMessage: number;
  monthlyUsage: CreditUsage[];
  dailyUsage: CreditUsage[];
}