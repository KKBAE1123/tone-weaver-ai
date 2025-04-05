
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';

const VoiceAgent = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Initialize the Vapi widget when the component mounts
    // The widget is already loaded in index.html
    if (window.vapiInstance) {
      console.log('Vapi widget is already initialized');
    } else {
      console.log('Vapi widget is not initialized yet, it should initialize from index.html');
    }
    
    return () => {
      // Clean up if needed
    };
  }, []);

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
                        }
                      }}
                    >
                      <Mic className="h-4 w-4" />
                      Start Voice Conversation
                    </Button>
                  </div>
                  
                  <p className="text-sm text-center text-gray-500 mt-6">
                    Note: Make sure your microphone is enabled when using the voice assistant
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Voice Assistant Settings</CardTitle>
                <CardDescription>Enter your Vapi API key to enable the voice assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vapi API Key
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your Vapi API key"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => {
                          const apiKey = e.target.value;
                          // Update the Vapi widget with the new API key
                          if (window.vapiInstance) {
                            // Ideally, we would update the API key here
                            // but the current implementation doesn't support this
                            console.log('API key updated');
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Get your API key from the <a href="https://app.vapi.ai" target="_blank" rel="noopener noreferrer" className="text-glycos-600 hover:underline">Vapi Dashboard</a>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default VoiceAgent;
