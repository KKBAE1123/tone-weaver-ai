
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import ToneSelector from '@/components/ToneSelector';
import RelationshipSelector from '@/components/RelationshipSelector';
import ScenarioSelector from '@/components/ScenarioSelector';
import MessageList, { Message } from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { saveMessage, fetchMessages, generateAIResponse } from '@/services/messageService';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [selectedTone, setSelectedTone] = useState('Smooth Like Honey');
  const [selectedRelationship, setSelectedRelationship] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch messages on component mount
  useEffect(() => {
    if (user) {
      const loadMessages = async () => {
        try {
          const userMessages = await fetchMessages(user.id);
          setMessages(userMessages);
        } catch (error) {
          console.error('Error loading messages:', error);
          toast({
            title: "Failed to load messages",
            description: "Could not retrieve your message history.",
            variant: "destructive",
          });
        }
      };
      
      loadMessages();
    }
  }, [user, toast]);

  const handleSendMessage = async (content: string) => {
    if (!user) return;
    
    // Add user message
    const userMessage: Omit<Message, 'id'> = {
      content,
      sender: 'user',
      timestamp: new Date(),
      userId: user.id,
    };
    
    try {
      const savedUserMessage = await saveMessage(userMessage);
      setMessages(prev => [...prev, savedUserMessage as Message]);
      
      // Start generating AI response
      setIsLoading(true);
      
      // Generate AI response
      const aiResponseContent = await generateAIResponse(
        content,
        selectedTone,
        selectedRelationship,
        selectedScenario
      );
      
      // Save AI response to database
      const aiMessage: Omit<Message, 'id'> = {
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date(),
        tone: selectedTone,
        relationship: selectedRelationship,
        scenario: selectedScenario,
        userId: user.id,
      };
      
      const savedAiMessage = await saveMessage(aiMessage);
      setMessages(prev => [...prev, savedAiMessage as Message]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    toast({
      title: "Copied to clipboard",
      description: "Response has been copied to your clipboard.",
      duration: 3000,
    });
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    toast({
      title: feedback === 'positive' ? "Thanks for the feedback!" : "We'll improve",
      description: feedback === 'positive' 
        ? "We're glad this response was helpful."
        : "We'll use your feedback to improve our responses.",
      duration: 3000,
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-glycos-50/50 to-white">
          <div className="container max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Communication Assistant</h1>
                <p className="text-gray-600 mt-1">Let Glycos help you craft the perfect message for any situation</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
            
            <ToneSelector selectedTone={selectedTone} onSelectTone={setSelectedTone} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RelationshipSelector 
                selectedRelationship={selectedRelationship}
                onSelectRelationship={setSelectedRelationship}
              />
              <ScenarioSelector 
                selectedScenario={selectedScenario}
                onSelectScenario={setSelectedScenario}
              />
            </div>
            
            <MessageList 
              messages={messages} 
              onCopyMessage={handleCopyMessage}
              onFeedback={handleFeedback}
            />
            
            <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
