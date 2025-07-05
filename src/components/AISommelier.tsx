import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Brain, 
  Heart, 
  Zap,
  User,
  Bot,
  Loader2,
  Settings,
  Mic,
  Volume2,
  AlertTriangle
} from 'lucide-react';
import { aiSommelier, SOMMELIER_PERSONALITIES, MovieRecommendation } from '../services/openai';
import { Movie } from '../types/movie';
import { VoiceSearchButton } from './VoiceSearchButton';

interface AISommelierProps {
  watchlist: Movie[];
  onMovieRecommendation: (title: string) => void;
  onClose: () => void;
}

export const AISommelier: React.FC<AISommelierProps> = ({
  watchlist,
  onMovieRecommendation,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState(0);
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([]);
  const [showApiWarning, setShowApiWarning] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const personality = SOMMELIER_PERSONALITIES[currentPersonality];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting with API warning
      setMessages([{
        role: 'assistant',
        content: personality.greeting + " I'm here to help you discover your next favorite movie! Note: Full AI capabilities require OpenAI API configuration.",
        timestamp: new Date()
      }]);
    }
  }, [isOpen, personality.greeting, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: message.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Check if user is asking for recommendations
      const isRecommendationRequest = message.toLowerCase().includes('recommend') || 
                                    message.toLowerCase().includes('suggest') ||
                                    message.toLowerCase().includes('what should i watch');

      if (isRecommendationRequest) {
        const result = await aiSommelier.getRecommendations(watchlist, extractMood(message), message);
        setRecommendations(result.recommendations);
        
        const assistantMessage = {
          role: 'assistant' as const,
          content: result.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const response = await aiSommelier.chatWithSommelier(message, watchlist);
        const assistantMessage = {
          role: 'assistant' as const,
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant' as const,
        content: "I'm having some technical difficulties right now. This might be due to API configuration. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractMood = (message: string): string => {
    const moodKeywords = {
      'happy': ['happy', 'cheerful', 'upbeat', 'comedy', 'funny', 'laugh'],
      'sad': ['sad', 'emotional', 'cry', 'drama', 'tearjerker'],
      'excited': ['action', 'adventure', 'thrilling', 'exciting', 'adrenaline'],
      'relaxed': ['calm', 'peaceful', 'easy', 'light', 'romantic'],
      'thoughtful': ['deep', 'meaningful', 'intellectual', 'thought-provoking'],
      'nostalgic': ['classic', 'old', 'vintage', 'retro', 'nostalgic']
    };

    const lowerMessage = message.toLowerCase();
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return mood;
      }
    }
    return 'general';
  };

  const handleVoiceMessage = (transcription: string) => {
    if (transcription.trim()) {
      handleSendMessage(transcription);
    }
  };

  const handlePersonalityChange = (index: number) => {
    setCurrentPersonality(index);
    aiSommelier.switchPersonality(index);
    setShowSettings(false);
    
    // Add personality switch message
    const switchMessage = {
      role: 'assistant' as const,
      content: SOMMELIER_PERSONALITIES[index].greeting + " I'm your new movie guide! How can I help you discover amazing films?",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, switchMessage]);
  };

  const quickPrompts = [
    "Recommend something uplifting",
    "I want a mind-bending thriller",
    "Show me hidden gems",
    "What's trending now?",
    "Surprise me with something different"
  ];

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-110 z-40 animate-pulse"
      >
        <Brain className="w-8 h-8" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
      </button>

      {/* AI Sommelier Chat Interface */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-[90vh] bg-gradient-to-br from-purple-950/90 to-pink-950/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-purple-800/30">
            
            {/* API Warning Banner */}
            {showApiWarning && (
              <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-orange-500/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-200 text-sm">
                      Demo Mode: Full AI features require OpenAI API configuration
                    </span>
                  </div>
                  <button
                    onClick={() => setShowApiWarning(false)}
                    className="text-orange-300 hover:text-orange-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  {personality.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{personality.name}</h2>
                  <p className="text-purple-100 text-sm">Your AI Movie Sommelier (Demo Mode)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Settings className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => { setIsOpen(false); onClose(); }}
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="bg-purple-900/50 p-4 border-b border-purple-800/30">
                <h3 className="text-white font-semibold mb-3">Choose Your Sommelier</h3>
                <div className="grid grid-cols-3 gap-3">
                  {SOMMELIER_PERSONALITIES.map((p, index) => (
                    <button
                      key={index}
                      onClick={() => handlePersonalityChange(index)}
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        index === currentPersonality
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-500 text-white'
                          : 'bg-purple-900/30 border-purple-700/50 text-purple-200 hover:bg-purple-800/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{p.avatar}</div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs opacity-75 capitalize">{p.style}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex h-full">
              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-sm">
                          {personality.avatar}
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[70%] p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                            : 'bg-purple-900/30 border border-purple-800/30 text-white'
                        }`}
                      >
                        <p className="leading-relaxed">{message.content}</p>
                        <div className="text-xs opacity-60 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-sm">
                        {personality.avatar}
                      </div>
                      <div className="bg-purple-900/30 border border-purple-800/30 p-4 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                          <span className="text-purple-200">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length <= 1 && (
                  <div className="p-4 border-t border-purple-800/30">
                    <p className="text-purple-200 text-sm mb-3">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(prompt)}
                          className="px-3 py-2 bg-purple-900/30 border border-purple-700/50 text-purple-200 rounded-lg text-sm hover:bg-purple-800/50 transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-6 border-t border-purple-800/30">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-3"
                  >
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask me about movies, get recommendations..."
                        className="w-full px-4 py-3 pr-16 bg-purple-900/30 border border-purple-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-purple-300"
                        disabled={isLoading}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <VoiceSearchButton onTranscription={handleVoiceMessage} />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Recommendations Sidebar */}
              {recommendations.length > 0 && (
                <div className="w-80 border-l border-purple-800/30 p-6 bg-purple-950/50">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Recommendations
                  </h3>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="bg-purple-900/30 border border-purple-800/30 rounded-xl p-4 hover:bg-purple-800/30 transition-colors cursor-pointer"
                        onClick={() => onMovieRecommendation(rec.title)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{rec.title}</h4>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-pink-400" />
                            <span className="text-sm text-purple-200">{rec.confidence}%</span>
                          </div>
                        </div>
                        <p className="text-purple-200 text-sm mb-2">{rec.reason}</p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-purple-700/50 text-purple-200 text-xs rounded-full">
                            {rec.mood}
                          </span>
                          {rec.genre.map((g, i) => (
                            <span key={i} className="px-2 py-1 bg-pink-700/50 text-pink-200 text-xs rounded-full">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};