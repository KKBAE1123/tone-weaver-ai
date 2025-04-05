
import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { Menu, Mic, MessageCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-md fixed top-0 z-30">
      <div className="container flex justify-between items-center px-4 py-3 mx-auto">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Logo />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <MessageCircle className="h-4 w-4" />
            Text Mode
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <Mic className="h-4 w-4" />
            Voice Mode
          </Button>
          <Button className="bg-glycos-600 hover:bg-glycos-700">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
