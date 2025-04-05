
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Upload, Image } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
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
        />
        <Button
          size="icon"
          className="absolute bottom-3 right-3 bg-glycos-600 hover:bg-glycos-700"
          onClick={handleSend}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="text-gray-500">
          <Image className="h-4 w-4 mr-2" />
          Add Screenshot
        </Button>
        <Button variant="outline" size="sm" className="text-gray-500">
          <Upload className="h-4 w-4 mr-2" />
          Upload Previous Chat
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
