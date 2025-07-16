import React, { useEffect, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { ChatList } from './ChatList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChatStore } from '../../../stores/chatStore';
import { useAuthStore } from '../../../stores/authStore';
import { cn } from '../../../lib/utils';

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

  const [showChatList, setShowChatList] = useState(true);

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
    <div className="h-full flex flex-col sm:flex-row">
      {/* Chat List */}
      <div className={cn(
        'sm:w-1/3 w-full border-r border-[var(--color-border)]',
        !showChatList && 'hidden sm:block',
        'sm:relative fixed top-16 left-0 right-0 bottom-0 z-40 bg-white sm:bg-transparent',
        showChatList ? 'block' : 'hidden sm:block'
      )}>
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
          onSelectChat={(chat) => {
            selectChat(chat);
            setShowChatList(false);
          }}
        />
      </div>
      {/* Chat Messages */}
      <div className={cn(
        'flex-1 flex flex-col',
        showChatList && 'hidden sm:flex'
      )}>
        {activeChat ? (
          <>
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <div>
                <h3 className="font-medium text-[var(--color-text)]">
                  {activeChat.contactName}
                </h3>
                <p className="text-sm text-gray-500">{activeChat.contactPhone}</p>
              </div>
              <div className="flex items-center space-x-2">
                {activeChat.assignedAgent && (
                  <div className="text-sm text-gray-500">
                    Assigned to: {activeChat.assignedAgent.username}
                  </div>
                )}
                {/* Back button for mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="sm:hidden"
                  onClick={() => setShowChatList(true)}
                  aria-label="Back to chat list"
                >
                  Back
                </Button>
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