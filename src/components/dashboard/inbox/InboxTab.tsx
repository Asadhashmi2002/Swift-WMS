import React, { useEffect } from 'react';
import { Filter, Search } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { ChatList } from './ChatList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChatStore } from '../../../stores/chatStore';
import { useAuthStore } from '../../../stores/authStore';

export const InboxTab: React.FC = () => {
  const { user } = useAuthStore();
  const {
    chats,
    activeChat,
    messages,
    isConnected,
    loadChats,
    selectChat,
    sendMessage,
  } = useChatStore();

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const handleSendMessage = (content: string, type = 'text') => {
    if (activeChat) {
      sendMessage(activeChat.id, content, type);
    }
  };

  const activeChatMessages = activeChat ? messages[activeChat.id] || [] : [];
  const isDisabled = activeChat?.isLocked && activeChat?.lockedBy !== user?.id;

  return (
    <div className="h-full flex">
      {/* Chat List */}
      <div className="w-1/3 border-r border-[var(--color-border)]">
        <div className="p-4 border-b border-[var(--color-border)]">
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Search chats..."
              className="flex-1"
            />
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-[var(--color-text)]">Conversations</h2>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-500">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <ChatList
          chats={chats}
          selectedChat={activeChat}
          onSelectChat={selectChat}
        />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">
                    {activeChat.contactName}
                  </h3>
                  <p className="text-sm text-gray-500">{activeChat.contactPhone}</p>
                </div>
                
                {activeChat.assignedAgent && (
                  <div className="text-sm text-gray-500">
                    Assigned to: {activeChat.assignedAgent.username}
                  </div>
                )}
              </div>
            </div>
            
            <MessageList messages={activeChatMessages} />
            
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isDisabled}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};