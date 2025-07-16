import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Button } from '../../ui/Button';

interface MessageInputProps {
  onSendMessage: (content: string, type?: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      // Check if it's a note command
      if (message.startsWith('/note ')) {
        onSendMessage(message.substring(6), 'note');
      } else {
        onSendMessage(message.trim());
      }
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-[var(--color-border)] p-4">
      {disabled && (
        <div className="mb-2 text-sm text-[var(--color-accent)] flex items-center space-x-1">
          <span>👀 This chat is being handled by another agent</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Chat is locked by another agent" : "Type a message... (use /note for private notes)"}
            disabled={disabled}
            rows={1}
            className="w-full p-3 border border-[var(--color-border)] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
        </div>
        
        <div className="flex space-x-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="p-2"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="p-2"
          >
            <Smile className="h-4 w-4" />
          </Button>
          
          <Button
            type="submit"
            disabled={disabled || !message.trim()}
            className="p-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};