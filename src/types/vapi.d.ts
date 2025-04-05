
// TypeScript declaration for the Vapi widget
interface VapiInstance {
  on(event: 'call-start' | 'call-end' | 'speech-start' | 'speech-end' | 'error', callback: (data?: any) => void): void;
  on(event: 'message', callback: (message: any) => void): void;
  on(event: 'volume-level', callback: (volume: number) => void): void;
}

interface Window {
  vapiInstance?: VapiInstance;
  vapiSDK?: {
    run(config: {
      apiKey: string;
      assistant: any;
      config?: any;
    }): VapiInstance;
  };
}
