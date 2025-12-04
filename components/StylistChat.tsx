
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage } from '../types';
import ImageUpload from './ImageUpload';
import { createStylistChat } from '../services/geminiService';
import { SendIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

interface StylistChatProps {
  dressImage: string | null;
  setDressImage: (image: string | null) => Promise<void>;
  dressDescription: string | null;
  isDescriptionLoading: boolean;
  descriptionError: string | null;
}

const StylistChat: React.FC<StylistChatProps> = ({ 
  dressImage, setDressImage, dressDescription, isDescriptionLoading, descriptionError 
}) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dressDescription) {
      const newChat = createStylistChat(dressDescription);
      setChat(newChat);
      setChatHistory([
        { role: 'model', content: "Hello! I'm your AI stylist. I see you've selected a dress. How can I help you style it today? Ask me about occasions, shoes, or anything else!" }
      ]);
    } else {
      setChat(null);
      setChatHistory([]);
    }
  }, [dressDescription]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: userInput };
    setChatHistory(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // FIX: Argument of type 'string' is not assignable to parameter of type 'SendMessageParameters'. The `sendMessage` method expects an object with a `message` property.
      const response = await chat.sendMessage({ message: userInput });
      const modelMessage: ChatMessage = { role: 'model', content: response.text };
      setChatHistory(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = { role: 'model', content: "I'm sorry, I encountered an error. Please try again." };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearChat = async () => {
    await setDressImage(null);
    setChat(null);
    setChatHistory([]);
  }

  if (isDescriptionLoading) {
    return <LoadingSpinner message="Analyzing your dress..." />;
  }
  
  if (descriptionError) {
    return (
       <div className="flex flex-col items-center space-y-4">
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
                <p className="font-bold">Analysis Failed</p>
                <p>{descriptionError}</p>
            </div>
            <ImageUpload onImageUpload={(img) => setDressImage(img)} imagePreview={null} clearImage={() => setDressImage(null)} title="Upload a Dress to Chat" />
        </div>
    );
  }

  if (!dressImage) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Stylist Chat</h2>
            <p className="text-center text-gray-600">First, upload a dress. Then you can chat with our AI stylist about it.</p>
            <ImageUpload onImageUpload={(img) => setDressImage(img)} imagePreview={null} clearImage={() => setDressImage(null)} title="Upload a Dress to Start" />
        </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh]">
        <div className="flex-shrink-0 flex items-start space-x-4 p-4 border-b">
            <img src={dressImage} alt="Selected dress" className="w-20 h-20 object-cover rounded-lg"/>
            <div>
                <h3 className="font-bold text-lg">Styling Chat</h3>
                <p className="text-sm text-gray-600 italic">"{dressDescription}"</p>
                <button onClick={clearChat} className="text-sm text-pink-600 hover:underline mt-1">Change dress</button>
            </div>
        </div>
      <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="bg-gray-200 text-gray-800 p-3 rounded-2xl text-sm">Typing...</div></div>}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a styling question..."
          className="flex-grow p-3 border rounded-full focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
          disabled={isLoading || !chat}
        />
        <button type="submit" className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 disabled:bg-pink-300 transition" disabled={isLoading || !userInput.trim()}>
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default StylistChat;
