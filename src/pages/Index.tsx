
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isError?: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI FAQ assistant. Ask me anything about our products or services!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      setConnectionStatus('checking');
      const response = await fetch('http://localhost:8000/docs', {
        method: 'GET',
        mode: 'no-cors'
      });
      setConnectionStatus('connected');
    } catch (error) {
      console.log('Backend connection check failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      console.log('Sending request to backend with query:', inputText.trim());
      
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: inputText.trim(),
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      setConnectionStatus('connected');
      
      // Add bot response after a brief delay for natural feel
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.answer || "I received your question but couldn't generate a proper response. Please try rephrasing your question.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 800);

    } catch (error) {
      console.error('Error sending message:', error);
      setConnectionStatus('disconnected');
      
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm having trouble connecting to my knowledge base. Please ensure:\n\n1. Your FastAPI backend is running on localhost:8000\n2. The server has CORS properly configured\n3. The /ask endpoint is available\n\nTry running: uvicorn main:app --host 0.0.0.0 --port 8000 --reload",
          isUser: false,
          timestamp: new Date(),
          isError: true,
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const retryConnection = () => {
    checkBackendConnection();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">AI FAQ Chatbot</h1>
              <p className="text-blue-100 text-sm">Powered by IBM Watsonx AI</p>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' && (
              <>
                <Wifi className="w-4 h-4 text-green-300" />
                <span className="text-xs text-green-200">Connected</span>
              </>
            )}
            {connectionStatus === 'disconnected' && (
              <>
                <WifiOff className="w-4 h-4 text-red-300" />
                <span className="text-xs text-red-200">Offline</span>
              </>
            )}
            {connectionStatus === 'checking' && (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-xs text-blue-200">Checking...</span>
              </>
            )}
          </div>
        </div>

        {/* Connection Warning */}
        {connectionStatus === 'disconnected' && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-800">Backend Server Not Running</p>
                <p className="text-xs text-red-600">Start your FastAPI server on localhost:8000</p>
              </div>
            </div>
            <button
              onClick={retryConnection}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.isUser ? "justify-end" : "justify-start"
              )}
            >
              {!message.isUser && (
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                  message.isError 
                    ? "bg-red-500" 
                    : "bg-gradient-to-br from-blue-500 to-purple-500"
                )}>
                  {message.isError ? (
                    <AlertCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
                  message.isUser 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md" 
                    : message.isError
                    ? "bg-red-50 text-red-800 rounded-bl-md border border-red-200"
                    : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                <p className={cn(
                  "text-xs mt-1 opacity-70",
                  message.isUser ? "text-blue-100" : 
                  message.isError ? "text-red-600" : "text-gray-500"
                )}>
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.isUser && (
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={connectionStatus === 'disconnected' ? "Backend server not running..." : "Type your question here..."}
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-500 disabled:opacity-50"
              disabled={isLoading || connectionStatus === 'disconnected'}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading || connectionStatus === 'disconnected'}
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200",
                "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                "disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed",
                "shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95",
                "disabled:transform-none disabled:shadow-md"
              )}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </form>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              {connectionStatus === 'connected' 
                ? "Connected to FastAPI server" 
                : "FastAPI server on localhost:8000 required"
              }
            </p>
            {connectionStatus === 'disconnected' && (
              <button
                onClick={retryConnection}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Test Connection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
