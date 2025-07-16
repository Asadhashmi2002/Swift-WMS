import React from 'react';
import { Eye, User } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Chat } from '../../../types';
import { formatTime } from '../../../lib/utils';
import { cn } from '../../../lib/utils';

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChat,
  onSelectChat,
}) => {
  return (
    <div className="h-full overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className={cn(
            'p-4 border-b border-[var(--color-border)] cursor-pointer transition-colors hover:bg-[var(--color-gray)]',
            selectedChat?.id === chat.id && 'bg-[var(--color-primary)]/10'
          )}
        >
          <div className="flex items-start space-x-3">
            <div className="h-10 w-10 rounded-full bg-[var(--color-gray)] flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-[var(--color-text)] truncate">
                  {chat.contactName}
                </h3>
                <span className="text-xs text-gray-500">
                  {formatTime(chat.lastMessageTime)}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 truncate mb-2">
                {chat.lastMessage}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {chat.tags.map((tag) => (
                    <Badge key={tag} variant="default" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  {chat.isLocked && (
                    <div className="flex items-center space-x-1 text-xs text-[var(--color-accent)]">
                      <Eye className="h-3 w-3" />
                      <span>Being handled</span>
                    </div>
                  )}
                  
                  {chat.unreadCount > 0 && (
                    <Badge variant="accent" size="sm">
                      {chat.unreadCount}
                    </Badge>
                  )}
                  
                  {chat.assignedAgent && (
                    <div className="h-6 w-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {chat.assignedAgent.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {chats.length === 0 && (
        <div className="flex items-center justify-center h-32 text-gray-500">
          No chats available
        </div>
      )}
    </div>
  );
};