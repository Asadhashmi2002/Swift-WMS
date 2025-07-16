import React, { useEffect, useRef } from 'react';
import { StickyNote } from 'lucide-react';
import { Message } from '../../../types';
import { formatTime } from '../../../lib/utils';
import { cn } from '../../../lib/utils';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex',
            message.isInbound ? 'justify-start' : 'justify-end',
            message.type === 'note' && 'justify-center'
          )}
        >
          {message.type === 'note' ? (
            <div className="max-w-md bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <div className="flex items-center space-x-2 mb-1">
                <StickyNote className="h-4 w-4 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-800">
                  Private Note - {message.noteAuthor || 'Unknown'}
                </span>
                <span className="text-xs text-yellow-600">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm text-yellow-700">{message.content}</p>
            </div>
          ) : (
            <div
              className={cn(
                'max-w-xs lg:max-w-md rounded-xl p-3',
                message.isInbound
                  ? 'bg-[var(--color-surface)] border border-[var(--color-border)]'
                  : 'bg-[var(--color-primary)] text-white'
              )}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={cn(
                    'text-xs',
                    message.isInbound ? 'text-gray-500' : 'text-white/70'
                  )}
                >
                  {formatTime(message.timestamp)}
                </span>
                {message.sender && (
                  <span
                    className={cn(
                      'text-xs font-medium',
                      message.isInbound ? 'text-gray-600' : 'text-white/80'
                    )}
                  >
                    {message.sender}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};