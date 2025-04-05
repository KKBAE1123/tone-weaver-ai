
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  onCopyMessage: (message: string) => void;
  onFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
}

const MessageList = ({ messages, onCopyMessage, onFeedback }: MessageListProps) => {
  if (!messages.length) {
    return (
      <Card className="flex flex-col items-center justify-center p-10 bg-white/50 border border-dashed border-glycos-200 rounded-xl">
        <div className="text-4xl mb-4">👋</div>
        <h3 className="text-xl font-medium text-glycos-800 mb-2">Welcome to Glycos</h3>
        <p className="text-gray-500 text-center max-w-md mb-4">
          Your AI communication assistant. Describe your situation above and we'll help you craft the perfect response.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={message.sender === 'user' ? 'user-message' : 'ai-message'}>
            <p className="whitespace-pre-wrap">{message.content}</p>
            
            {message.sender === 'ai' && (
              <div className="flex items-center justify-end gap-2 mt-2 text-gray-500">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => onFeedback(message.id, 'positive')}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => onFeedback(message.id, 'negative')}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => onCopyMessage(message.content)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="text-xs text-gray-400 mt-1">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
