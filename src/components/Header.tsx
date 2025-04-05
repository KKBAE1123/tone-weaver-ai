
import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { Menu, Mic, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isTextMode = location.pathname === '/';
  const isVoiceMode = location.pathname === '/voice';
  
  return (
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-md fixed top-0 z-30">
      <div className="container flex justify-between items-center px-4 py-3 mx-auto">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/">
            <Logo />
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link to="/">
            <Button 
              variant={isTextMode ? "default" : "outline"} 
              size="sm" 
              className={`hidden md:flex gap-2 ${isTextMode ? "bg-glycos-600 hover:bg-glycos-700" : ""}`}
            >
              <MessageCircle className="h-4 w-4" />
              Text Mode
            </Button>
          </Link>
          <Link to="/voice">
            <Button 
              variant={isVoiceMode ? "default" : "outline"} 
              size="sm" 
              className={`hidden md:flex gap-2 ${isVoiceMode ? "bg-glycos-600 hover:bg-glycos-700" : ""}`}
            >
              <Mic className="h-4 w-4" />
              Voice Mode
            </Button>
          </Link>
          <Button className="bg-glycos-600 hover:bg-glycos-700">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
