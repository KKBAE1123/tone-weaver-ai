
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import ToneSelector from '@/components/ToneSelector';
import RelationshipSelector from '@/components/RelationshipSelector';
import ScenarioSelector from '@/components/ScenarioSelector';
import MessageList, { Message } from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import Sidebar from '@/components/Sidebar';

const Index = () => {
  const { toast } = useToast();
  const [selectedTone, setSelectedTone] = useState('Smooth Like Honey');
  const [selectedRelationship, setSelectedRelationship] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate AI response based on selected parameters
    setTimeout(() => {
      generateResponse(message, selectedTone, selectedRelationship, selectedScenario);
    }, 1000);
  };

  const generateResponse = (
    message: string,
    tone: string,
    relationship: string,
    scenario: string
  ) => {
    // Mock response generation - in a real app, this would call an API
    const responses = {
      'Smooth Like Honey': "I understand how challenging this situation must be for you. Perhaps we could discuss this further when we're both feeling more centered? I value our relationship and want to find a solution that works for both of us.",
      'Sweet & Subtle': "I see where you're coming from, though I might have a slightly different perspective on this. Maybe we could find some middle ground that addresses both our concerns?",
      'Soft-Serve': "Thank you for sharing this with me! I really appreciate your honesty. If it's okay with you, I'd love to suggest a small adjustment that might help us both feel more comfortable.",
      'Berry Nice': "Hey there! 😊 I totally get what you're saying and I'm so grateful you brought this up! Let's figure this out together - I'm sure we can find an awesome solution! 💕",
      'Spicy Sugar': "Well, that's certainly an... interesting approach. Perhaps we could try something that actually works for everyone involved? Just a thought.",
      'Sugarcoat It': "I really value what you bring to the table, and I think with a few small tweaks, this could be even better. Would you be open to exploring some alternatives?",
      'Bittersweet Truth': "I need to be direct - this isn't working for me. I respect you too much to not be honest, but I'm committed to finding a solution that respects both our needs."
    };
    
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      content: responses[tone as keyof typeof responses] || 
        "I've considered your situation carefully. Based on what you've shared, I suggest communicating your feelings clearly while remaining respectful of their perspective. Would you like me to help you draft a specific response?",
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
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

  return (
    <>
      <Header />
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-glycos-50/50 to-white">
          <div className="container max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Communication Assistant</h1>
              <p className="text-gray-600 mt-1">Let Glycos help you craft the perfect message for any situation</p>
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
            
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
