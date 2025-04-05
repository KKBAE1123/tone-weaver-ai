
import { supabase } from '@/integrations/supabase/client';
import type { Message } from '@/components/MessageList';
import type { Database } from '@/integrations/supabase/types';

// Function to save a message to Supabase
export async function saveMessage(message: Omit<Message, 'id'>): Promise<Message> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        content: message.content,
        tone: message.sender === 'ai' ? message.tone : 'User Message',
        relationship: message.relationship || null,
        scenario: message.scenario || null,
        user_id: message.userId,
        is_ai_generated: message.sender === 'ai',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving message:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from insert');
    }

    return { id: data.id, ...message };
  } catch (error) {
    console.error('Failed to save message:', error);
    throw error;
  }
}

// Function to fetch messages for the current user
export async function fetchMessages(userId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Transform database records to Message objects
    return data.map((msg) => ({
      id: msg.id,
      content: msg.content,
      sender: msg.is_ai_generated ? 'ai' : 'user',
      timestamp: new Date(msg.created_at),
      tone: msg.tone,
      relationship: msg.relationship,
      scenario: msg.scenario,
      userId: msg.user_id,
    }));
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw error;
  }
}

// Function to call the OpenAI edge function
export async function generateAIResponse(
  message: string,
  tone: string,
  relationship?: string,
  scenario?: string
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-response', {
      body: { message, tone, relationship, scenario },
    });

    if (error) {
      console.error('Error calling generate-response function:', error);
      throw error;
    }

    return data.content;
  } catch (error) {
    console.error('Failed to generate AI response:', error);
    throw new Error('Failed to generate a response. Please try again.');
  }
}
