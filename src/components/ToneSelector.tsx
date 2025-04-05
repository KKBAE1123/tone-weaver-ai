
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface ToneOption {
  emoji: string;
  name: string;
  description: string;
  tagline: string;
}

interface ToneSelectorProps {
  selectedTone: string;
  onSelectTone: (tone: string) => void;
}

const tones: ToneOption[] = [
  {
    emoji: '🍯',
    name: 'Smooth Like Honey',
    tagline: 'Glides like charm.',
    description: 'Calms things down softly and politely. Like a therapist in DMs.',
  },
  {
    emoji: '🔥',
    name: 'Sweet & Subtle',
    tagline: 'You get your point across... without the sting.',
    description: 'Passive-aggressive but in the nicest way. Sarcasm dressed in velvet.',
  },
  {
    emoji: '🧁',
    name: 'Soft-Serve',
    tagline: 'Sprinkle some kindness on it.',
    description: 'Makes even complaints sound like compliments.',
  },
  {
    emoji: '🍓',
    name: 'Berry Nice',
    tagline: 'Extra friendly, zero drama.',
    description: 'Full of emojis, positivity, and warmth. Great for casual, friendly chats.',
  },
  {
    emoji: '🌶️',
    name: 'Spicy Sugar',
    tagline: 'Respectfully savage.',
    description: 'Sassy and clever. Perfect for roasting without being toxic.',
  },
  {
    emoji: '🍬',
    name: 'Sugarcoat It',
    tagline: 'Say what you mean—just not meanly.',
    description: 'Reframes harsh truths with gentle phrasing. Good for giving feedback.',
  },
  {
    emoji: '💎',
    name: 'Bittersweet Truth',
    tagline: 'Real talk, respectfully delivered.',
    description: 'Balanced — keeps honesty intact but tones down emotional heat.',
  }
];

const ToneSelector = ({ selectedTone, onSelectTone }: ToneSelectorProps) => {
  return (
    <Card className="p-4 bg-white shadow-sm border border-glycos-100 rounded-xl">
      <h3 className="text-lg font-medium mb-3">Select Tone</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
        {tones.map((tone) => (
          <button
            key={tone.name}
            className={`tone-button ${selectedTone === tone.name ? 'active' : ''}`}
            onClick={() => onSelectTone(tone.name)}
            title={tone.description}
          >
            <span className="tone-emoji">{tone.emoji}</span>
            <span className="tone-name">{tone.name}</span>
          </button>
        ))}
      </div>
      {selectedTone && (
        <div className="mt-3 text-sm text-gray-600">
          <p className="font-medium">{tones.find(t => t.name === selectedTone)?.tagline}</p>
          <p>{tones.find(t => t.name === selectedTone)?.description}</p>
        </div>
      )}
    </Card>
  );
};

export default ToneSelector;
