
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { saveMessage, generateAIResponse } from '@/services/messageService';
import { supabase } from '@/integrations/supabase/client';
import MessageList, { Message } from '@/components/MessageList';

const VoiceAgent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  
  useEffect(() => {
    // Set up Vapi with your API key and assistant ID
    if (typeof window !== 'undefined') {
      const assistant = {
        id: "65c1c13d-3589-40a0-9eac-0ac47a3fad9c",
      };
      
      const buttonConfig = {
        position: "bottom-right",
        offset: "40px",
        width: "50px", 
        height: "50px",
        idle: {
          color: "#9b87f5", 
          type: "pill",
          title: "Need help with a response?",
          subtitle: "Talk with Glycos, your AI communication assistant",
          icon: "https://unpkg.com/lucide-static@0.321.0/icons/message-circle.svg",
        },
        loading: {
          color: "#8B5CF6",
          type: "pill",
          title: "Connecting...",
          subtitle: "Please wait",
          icon: "https://unpkg.com/lucide-static@0.321.0/icons/loader-2.svg",
        },
        active: {
          color: "#ea384c",
          type: "pill",
          title: "Conversation in progress...",
          subtitle: "End the conversation",
          icon: "https://unpkg.com/lucide-static@0.321.0/icons/phone-off.svg",
        },
      };
      
      // Load the Vapi script if it's not already loaded
      if (!window.vapiSDK) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
        script.defer = true;
        script.async = true;
        script.onload = () => {
          initVapi(assistant, buttonConfig);
        };
        document.body.appendChild(script);
      } else {
        initVapi(assistant, buttonConfig);
      }
    }
    
    // Load previous conversations if user is logged in
    if (user) {
      loadConversations();
    }
    
    return () => {
      // Cleanup if needed
      if (window.vapiInstance) {
        // There's no built-in cleanup method, but we can remove event listeners
        console.log('Cleaning up Vapi instance');
      }
    };
  }, [user]);
  
  const initVapi = (assistant: any, buttonConfig: any) => {
    if (window.vapiSDK) {
      window.vapiInstance = window.vapiSDK.run({
        apiKey: "a1424326-d9f9-47dc-abdc-22524c842eef",
        assistant: assistant,
        config: buttonConfig,
      });
      
      // Add event listeners to capture conversation data
      if (window.vapiInstance) {
        window.vapiInstance.on('call-start', () => {
          console.log('Glycos voice assistant activated');
          toast({
            title: "Voice conversation started",
            description: "Your conversation with Glycos has begun",
          });
        });
        
        window.vapiInstance.on('call-end', () => {
          console.log('Glycos voice assistant conversation ended');
          toast({
            title: "Voice conversation ended",
            description: "Your conversation with Glycos has ended",
          });
        });
        
        window.vapiInstance.on('message', async (message) => {
          console.log('Glycos message:', message);
          
          // Store messages in our database
          if (user && message.content) {
            try {
              // Determine if it's a user message or AI message
              const isUser = message.role === 'user';
              
              // Create message object
              const newMessage: Omit<Message, 'id'> = {
                content: message.content,
                sender: isUser ? 'user' : 'ai',
                timestamp: new Date(),
                tone: isUser ? 'User Message' : 'Voice Assistant',
                userId: user.id,
              };
              
              // Save message to database
              await saveMessage(newMessage);
              
              // Reload conversations
              loadConversations();
            } catch (error) {
              console.error('Error saving voice conversation:', error);
            }
          }
        });
        
        window.vapiInstance.on('error', (e) => {
          console.error('Glycos voice assistant error:', e);
          toast({
            title: "Error",
            description: "There was an error with the voice assistant",
            variant: "destructive",
          });
        });
      }
    }
  };
  
  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('tone', 'Voice Assistant')
        .order('created_at', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      // Transform database records to Message objects
      const messages = data.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.is_ai_generated ? 'ai' : 'user',
        timestamp: new Date(msg.created_at),
        tone: msg.tone,
        relationship: msg.relationship,
        scenario: msg.scenario,
        userId: msg.user_id,
      }));
      
      setConversations(messages);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load your conversations",
        variant: "destructive",
      });
    }
  };
  
  const analyzeConversations = async () => {
    if (!user || conversations.length === 0) {
      toast({
        title: "No conversations",
        description: "You need to have at least one conversation with the voice assistant first",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Format conversations for analysis
      const conversationText = conversations
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      
      // Send conversation data to our AI for analysis
      const analysisResult = await generateAIResponse(
        `Please analyze this conversation and provide insights and suggestions: \n\n${conversationText}`,
        'Analytical',
        'Communication Analysis',
        'Voice Conversation Analysis'
      );
      
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Error analyzing conversations:', error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze your conversations",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    toast({
      title: "Copied to clipboard",
      description: "Message has been copied to your clipboard.",
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
              <h1 className="text-3xl font-bold gradient-text">Voice Communication Assistant</h1>
              <p className="text-gray-600 mt-1">
                Talk with Glycos, your AI communication assistant, to get help with your messages
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mic className="h-5 w-5 mr-2 text-glycos-600" />
                  Voice Assistant
                </CardTitle>
                <CardDescription>
                  Click the voice button in the bottom right corner to start a conversation with Glycos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-medium mb-2">What can Glycos help you with?</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>Suggest responses for difficult conversations</li>
                      <li>Help phrase messages with the right tone</li>
                      <li>Practice communication for important scenarios</li>
                      <li>Provide feedback on your communication style</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      className="bg-glycos-600 hover:bg-glycos-700 gap-2"
                      onClick={() => {
                        // This will trigger a click on the Vapi widget if possible
                        const vapiBtn = document.querySelector('.vapi-btn') as HTMLElement;
                        if (vapiBtn) {
                          vapiBtn.click();
                        } else {
                          console.log('Vapi button not found');
                          toast({
                            title: "Widget not ready",
                            description: "The voice assistant widget is not yet ready. Please refresh the page.",
                          });
                        }
                      }}
                    >
                      <Mic className="h-4 w-4" />
                      Start Voice Conversation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {conversations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-glycos-600" />
                    Voice Conversations
                  </CardTitle>
                  <CardDescription>
                    Your conversation history with the voice assistant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <MessageList 
                      messages={conversations}
                      onCopyMessage={handleCopyMessage}
                      onFeedback={handleFeedback}
                    />
                    
                    <div className="flex justify-center mt-4">
                      <Button 
                        className="bg-glycos-600 hover:bg-glycos-700 gap-2"
                        onClick={analyzeConversations}
                        disabled={isAnalyzing || conversations.length === 0}
                      >
                        {isAnalyzing ? "Analyzing..." : "Analyze Conversation"}
                      </Button>
                    </div>
                    
                    {analysis && (
                      <div className="p-4 bg-white border border-glycos-200 rounded-lg mt-4">
                        <h3 className="font-medium mb-2 text-glycos-800">AI Analysis</h3>
                        <p className="whitespace-pre-wrap text-gray-700">{analysis}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default VoiceAgent;
