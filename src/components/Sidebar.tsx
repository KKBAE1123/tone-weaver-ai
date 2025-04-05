
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mic, Clock, Users, Settings, LogOut, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const Sidebar = () => {
  return (
    <div className="w-64 border-r border-gray-200 bg-white h-full hidden lg:flex flex-col">
      <div className="p-4">
        <Button className="w-full bg-glycos-600 hover:bg-glycos-700 gap-2">
          <Plus className="h-4 w-4" />
          New Conversation
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Recent Conversations</h3>
          {['Setting boundaries with roommate', 'Apologizing to client', 'Feedback to team member'].map((title, i) => (
            <Button key={i} variant="ghost" className="w-full justify-start text-left mb-1 h-auto py-2">
              <div>
                <div className="font-medium truncate">{title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
      
      <div className="border-t border-gray-200 p-3 space-y-1">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <MessageCircle className="h-4 w-4" />
          Text Mode
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Mic className="h-4 w-4" />
          Voice Mode
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Clock className="h-4 w-4" />
          History
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Users className="h-4 w-4" />
          Saved Relationships
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-red-500 gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
