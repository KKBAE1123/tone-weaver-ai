
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Upload, Image, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const MessageInput = ({ onSendMessage, isLoading = false }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="relative">
        <Textarea
          placeholder="Describe your situation... What happened? What do you want to communicate?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[120px] pr-12 resize-none bg-white border-glycos-200"
          disabled={isLoading}
        />
        <Button
          size="icon"
          className="absolute bottom-3 right-3 bg-glycos-600 hover:bg-glycos-700"
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="text-gray-500" disabled={isLoading}>
            <Image className="h-4 w-4 mr-2" />
            Add Screenshot
          </Button>
          <Button variant="outline" size="sm" className="text-gray-500" disabled={isLoading}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Previous Chat
          </Button>
        </div>
        {isLoading && (
          <div className="text-sm text-glycos-600">
            Generating response...
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
