import { create } from 'zustand';
import { ChatState, Chat, Message } from '../types';
import { mockApi } from '../lib/mockApi';
import { socketService } from '../lib/socket';

interface ChatStore extends ChatState {
  loadChats: () => Promise<void>;
  selectChat: (chat: Chat) => Promise<void>;
  sendMessage: (chatId: string, content: string, type?: string) => void;
  lockChat: (chatId: string) => void;
  unlockChat: (chatId: string) => void;
  addMessage: (message: Message) => void;
  updateChatLock: (chatId: string, isLocked: boolean, lockedBy?: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChat: null,
  messages: {},
  isConnected: false,

  loadChats: async () => {
    try {
      const chats = await mockApi.getChats();
      set({ chats });
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  },

  selectChat: async (chat: Chat) => {
    const { messages, activeChat } = get();
    
    // Leave previous chat room
    if (activeChat) {
      socketService.leaveRoom(activeChat.id);
      socketService.unlockChat(activeChat.id);
    }

    // Join new chat room and lock it
    socketService.joinRoom(chat.id);
    socketService.lockChat(chat.id);

    set({ activeChat: chat });

    // Load messages if not already loaded
    if (!messages[chat.id]) {
      try {
        const chatMessages = await mockApi.getChatMessages(chat.id);
        set(state => ({
          messages: {
            ...state.messages,
            [chat.id]: chatMessages,
          },
        }));
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    }
  },

  sendMessage: (chatId: string, content: string, type = 'text') => {
    socketService.sendMessage(chatId, content, type);
  },

  lockChat: (chatId: string) => {
    socketService.lockChat(chatId);
  },

  unlockChat: (chatId: string) => {
    socketService.unlockChat(chatId);
  },

  addMessage: (message: Message) => {
    set(state => ({
      messages: {
        ...state.messages,
        [message.chatId]: [
          ...(state.messages[message.chatId] || []),
          message,
        ],
      },
    }));
  },

  updateChatLock: (chatId: string, isLocked: boolean, lockedBy?: string) => {
    set(state => ({
      chats: state.chats.map(chat =>
        chat.id === chatId
          ? { 
              ...chat, 
              isLocked, 
              lockedBy,
              lockExpiry: isLocked ? new Date(Date.now() + 120000) : undefined
            }
          : chat
      ),
    }));
  },
}));

// Socket event listeners
socketService.on('message', (message: Message) => {
  useChatStore.getState().addMessage(message);
});

socketService.on('chat-locked', ({ chatId, lockedBy }: { chatId: string; lockedBy: string }) => {
  useChatStore.getState().updateChatLock(chatId, true, lockedBy);
});

socketService.on('chat-unlocked', ({ chatId }: { chatId: string }) => {
  useChatStore.getState().updateChatLock(chatId, false);
});

socketService.on('connect', () => {
  useChatStore.setState({ isConnected: true });
});

socketService.on('disconnect', () => {
  useChatStore.setState({ isConnected: false });
});