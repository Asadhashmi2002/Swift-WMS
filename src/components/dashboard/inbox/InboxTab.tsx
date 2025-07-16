import React, { useEffect, useState } from 'react';
import { Filter, Search, Wallet, AlertTriangle, Plus } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ChatList } from './ChatList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChatStore } from '../../../stores/chatStore';
import { useAuthStore } from '../../../stores/authStore';
import { cn } from '../../../lib/utils';
import { getCreditBalance, getCreditPackages } from '../../../lib/mockApi';
import { CreditBalance, CreditPackage } from '../../../types';
import toast from 'react-hot-toast';

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
  const [showCreditCard, setShowCreditCard] = useState(false);
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([]);
  const [loadingCredits, setLoadingCredits] = useState(false);

  useEffect(() => {
    loadChats();
    loadCreditData();
  }, [loadChats]);

  const loadCreditData = async () => {
    try {
      const [balance, packages] = await Promise.all([
        getCreditBalance(),
        getCreditPackages()
      ]);
      setCreditBalance(balance);
      setCreditPackages(packages);
    } catch (error) {
      console.error('Failed to load credit data:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

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
            <div className="flex items-center space-x-2">
              {/* Credit Balance Icon */}
              <div className="relative">
                <button
                  onClick={() => setShowCreditCard(!showCreditCard)}
                  className="p-2 rounded-lg hover:bg-[var(--color-gray)] transition-colors relative"
                >
                  <Wallet className="h-5 w-5 text-yellow-600" />
                  {creditBalance?.isLow && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                  )}
                </button>
                
                {/* Credit Balance Card */}
                {showCreditCard && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-[var(--color-border)] rounded-lg shadow-lg z-50">
                    <div className="p-4">
                      {/* Credit Balance Warning */}
                      {creditBalance?.isLow && (
                        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">
                              Low Credit Balance
                            </span>
                          </div>
                          <p className="text-xs text-orange-700 mb-3">
                            Your Credit Balance is low, please Buy Credits to ensure continued messaging
                          </p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              Pricing Overview
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                              Buy Credits
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Credit Balance */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[var(--color-text)]">Credit Balance</span>
                          <span className="text-lg font-bold text-blue-600">
                            {creditBalance ? formatCurrency(creditBalance.balance, creditBalance.currency) : 'Loading...'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Last updated: {creditBalance?.lastUpdated.toLocaleTimeString()}
                        </div>
                      </div>
                      
                      {/* Quick Credit Packages */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-[var(--color-text)]">Quick Purchase</h4>
                        {creditPackages.slice(0, 2).map((pkg) => (
                          <div key={pkg.id} className="flex items-center justify-between p-2 border border-[var(--color-border)] rounded-lg">
                            <div>
                              <div className="text-sm font-medium text-[var(--color-text)]">{pkg.name}</div>
                              <div className="text-xs text-gray-500">{pkg.credits.toLocaleString()} credits</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold">{formatCurrency(pkg.price, pkg.currency)}</div>
                              {pkg.discount && (
                                <div className="text-xs text-green-600">{pkg.discount}% off</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* View Credit Usage History */}
                      <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                        <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700 flex items-center justify-between">
                          <span>View Credit Usage History</span>
                          <span>→</span>
                        </button>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Raw Data</span>
                            <span>↗</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Daily</span>
                            <span>↗</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Monthly</span>
                            <span>↗</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
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