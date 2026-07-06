import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Bot, ChevronRight, Brain, Sparkles, Send, Mic, RefreshCw, Clock, BarChart2, Calendar, Target, Zap, MessageSquare, Menu, Crown, Flame } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useProgress } from '../hooks/useProgress';

interface AiCoachViewProps {
  profileName: string;
  onSend: () => void;
}

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
  timestamp?: string;
};

const initAi = () => {
  try {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' });
  } catch (e) {
    console.warn("Failed to init AI", e);
    return null;
  }
};

const ai = initAi();

export default function AiCoachView({ profileName, onSend }: AiCoachViewProps) {
  const { stats, sessions } = useProgress();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'suggestions' | 'chat'>('suggestions');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial', role: 'model', text: 'Hi! How can I help you improve today?', timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatTokens, setChatTokens] = useState(5);
  const [showAllQuickActions, setShowAllQuickActions] = useState(false);
  
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalXP = sessions.reduce((acc, curr) => acc + curr.score, 0);

  useEffect(() => {
    if (ai && !chatRef.current) {
      chatRef.current = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are Nova AI, a friendly, intelligent brain training coach. Keep answers short and encouraging (under 3 sentences). If the user asks for a calculation plan (like "I want to improve calculation speed"), always say 'Great choice! Improving calculation speed helps in exams and daily problem solving. Here's a quick plan for you:' and append exactly the string '[CALC_PLAN]' at the end of your response.If the user asks for a training plan or schedule, always say 'Sure! I've created a plan for you.' and append exactly the string '[VIEW_PLAN]' at the end of your response.Recommend games like Math Sprint, Number Recall, Color Reaction.`,
        }
      });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, mode]);

  const handleSend = async (textToSend: string = query) => {
    if (!textToSend.trim()) return;
    
    if (chatTokens <= 0) {
      onSend(); // Trigger premium modal
      return;
    }

    setMode('chat');
    
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend, timestamp: currentTime };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setChatTokens(prev => prev - 1);
    setIsTyping(true);

    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', isStreaming: true, timestamp: currentTime }]);

    if (chatRef.current) {
      try {
        let streamResponse = await chatRef.current.sendMessageStream({ message: textToSend });
        let fullText = '';
        
        for await (const chunk of streamResponse) {
          const c = chunk as GenerateContentResponse;
          fullText += (c.text || '');
          
          setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId 
              ? { ...msg, text: fullText } 
              : msg
          ));
        }
        
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId 
            ? { ...msg, isStreaming: false } 
            : msg
        ));
      } catch (e) {
        console.error(e);
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId 
            ? { ...msg, text: "I'm having trouble connecting right now. Let's try again later!", isStreaming: false } 
            : msg
        ));
      }
    } else {
        setTimeout(() => {
           setMessages(prev => prev.map(msg => 
             msg.id === modelMsgId 
               ? { ...msg, text: "I'm offline right now (API Key missing).", isStreaming: false } 
               : msg
          ));
        }, 1000);
    }
    
    setIsTyping(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col h-full bg-[#0a0a0c] relative"
    >
      {mode === 'suggestions' ? (
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
          {/* Header */}
          <div className="px-6 pt-6 pb-6 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white mb-0.5">
                Hi {profileName.split(' ')[0]} 👋
              </span>
              <span className="text-[13.5px] text-white/80">
                I'm Nova, here to help you think better and learn faster. 🚀
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full border border-white/10 shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]"></div>
              <span className="text-[11px] text-white/90 font-medium tracking-wide">Online</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <div className="px-6 flex justify-between items-center mb-4">
              <h3 className="text-[17px] font-bold text-white">Quick Actions</h3>
              <button 
                onClick={() => setShowAllQuickActions(!showAllQuickActions)}
                className="text-[13px] text-[#a855f7] font-medium flex items-center hover:text-[#c084fc] transition-colors"
              >
                {showAllQuickActions ? 'Show less' : 'View all'} <ChevronRight className={`w-3.5 h-3.5 ml-0.5 transition-transform ${showAllQuickActions ? 'rotate-90' : ''}`} />
              </button>
            </div>
            <div className={`px-6 ${showAllQuickActions ? 'grid grid-cols-2 gap-3' : 'flex gap-3 overflow-x-auto hide-scrollbar pb-2'}`}>
              {[
                { title: 'Focus Plan', subtitle: 'Improve Concentration', icon: <Target className="w-7 h-7 text-[#a855f7]" />, color: 'bg-[#a855f7]' },
                { title: 'Memory Booster', subtitle: 'Strengthen Memory', icon: <Brain className="w-7 h-7 text-[#10b981]" />, color: 'bg-[#10b981]' },
                { title: 'Math Practice', subtitle: 'Solve Faster & Smarter', icon: <Zap className="w-7 h-7 text-[#f59e0b]" />, color: 'bg-[#f59e0b]' },
                { title: 'Track Progress', subtitle: 'Analyze & Grow Consistently', icon: <BarChart2 className="w-7 h-7 text-[#3b82f6]" />, color: 'bg-[#3b82f6]' },
                ...(showAllQuickActions ? [
                  { title: 'Language Skills', subtitle: 'Expand Vocabulary', icon: <MessageSquare className="w-7 h-7 text-[#ec4899]" />, color: 'bg-[#ec4899]' },
                  { title: 'Problem Solving', subtitle: 'Logical Thinking', icon: <Sparkles className="w-7 h-7 text-[#eab308]" />, color: 'bg-[#eab308]' },
                ] : [])
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(action.title)}
                  className={`${showAllQuickActions ? 'w-full' : 'w-[125px] shrink-0'} bg-[#161619] border border-white/5 rounded-[22px] p-4 flex flex-col items-center text-center hover:bg-[#1c1c20] transition-colors shadow-sm relative overflow-hidden group`}
                >
                  <div className={`absolute top-0 right-0 w-16 h-16 ${action.color}/10 rounded-full blur-xl -mr-6 -mt-6 group-hover:opacity-100 opacity-50 transition-opacity`}></div>
                  <div className="relative mb-3 flex items-center justify-center h-12 w-12">
                    <div className={`absolute inset-0 ${action.color}/10 rounded-full blur-md`}></div>
                    {action.icon}
                  </div>
                  <h4 className="font-bold text-[14px] mb-1 leading-tight text-white">{action.title}</h4>
                  <p className="text-[11px] text-white/50 leading-tight">{action.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Start a Conversation */}
          <div className="mt-8 px-6 pb-6">
            <h3 className="text-[17px] font-bold text-white mb-4">Start a Conversation</h3>
            <div className="space-y-3">
              {[
                { title: 'Create a 7-day focus plan', subtitle: 'Help me stay consistent', icon: <MessageSquare className="w-5 h-5 text-[#a855f7]" />, color: 'bg-[#a855f7]' },
                { title: 'I want to improve my memory', subtitle: 'Give me exercises', icon: <Brain className="w-5 h-5 text-[#10b981]" />, color: 'bg-[#10b981]' },
                { title: 'How can I solve math faster?', subtitle: 'Tips and techniques', icon: <Zap className="w-5 h-5 text-[#f59e0b]" />, color: 'bg-[#f59e0b]' },
                { title: 'Analyze my weak areas', subtitle: 'Show my performance', icon: <BarChart2 className="w-5 h-5 text-[#3b82f6]" />, color: 'bg-[#3b82f6]' },
              ].map((item, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(item.title)}
                  className="w-full bg-[#161619] border border-white/5 rounded-[20px] p-3 flex items-center gap-4 hover:bg-[#1c1c20] transition-colors text-left shadow-sm"
                >
                  <div className={`w-12 h-12 rounded-[16px] ${item.color}/10 flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[14.5px] text-white mb-0.5">{item.title}</h4>
                    <p className="text-[12px] text-white/50">{item.subtitle}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full bg-[#0a0a0c]">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 pt-6 pb-4 shrink-0 bg-[#0a0a0c] sticky top-0 z-20 w-full border-b border-white/5 shadow-md">
            <div className="flex items-center gap-3">
              <button onClick={() => setMode('suggestions')} className="p-2 -ml-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full bg-[#1e1e24] shadow-inner shadow-[#a855f7]/20 border border-[#a855f7]/20 flex items-center justify-center shrink-0">
                   <div className="w-full h-full p-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                     <Bot className="w-full h-full text-white" />
                   </div>
                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] rounded-full border-2 border-[#0a0a0c]"></div>
                </div>
                <div>
                  <h2 className="text-white font-bold text-[17px] leading-tight flex items-center gap-1">NOVA AI <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" /></h2>
                  <p className="text-[#8a8a93] text-[13px]">Your Personal Brain Coach</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-[120px] hide-scrollbar">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              const hasCalcPlan = message.text.includes('[CALC_PLAN]');
              const hasPlan = message.text.includes('[VIEW_PLAN]');
              const displayText = message.text.replace('[CALC_PLAN]', '').replace('[VIEW_PLAN]', '');

              return (
                <motion.div 
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-[#1e1e24] border border-[#a855f7]/20 flex items-center justify-center shrink-0 mr-3 mt-1 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
                       <div className="w-6 h-6">
                         <Bot className="w-full h-full text-white" />
                       </div>
                    </div>
                  )}
                  
                  <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}> 
                    {(displayText || message.isStreaming) && (
                        <>
                          <div className={`p-3.5 px-4 rounded-[22px] ${ 
                            isUser 
                              ? 'bg-[#6d28d9] text-white rounded-br-sm shadow-[0_4px_15px_rgba(109,40,217,0.2)]' 
                              : 'bg-[#161619] border border-white/5 text-white/90 rounded-tl-sm shadow-md'
                          }`}> 
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{displayText || '...'}</p>
                          </div>
                          {message.timestamp && (
                            <div className="flex items-center gap-1 mt-1.5 px-2">
                               <span className="text-[11px] font-medium text-white/40">{message.timestamp}</span>
                            </div>
                          )}
                        </>
                    )}
                    
                    {hasCalcPlan && !isUser && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 w-full min-w-[280px] bg-[#161619] border border-white/5 rounded-[20px] overflow-hidden shadow-lg"
                      >
                        <div className="p-4 space-y-4">
                          <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center shrink-0">
                              <RefreshCw className="w-5 h-5 text-[#10b981]" />
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-[15px]">Daily Practice</h4>
                              <p className="text-[#8a8a93] text-[13px]">15 min of calculation games</p>
                            </div>
                          </div>
                          <div className="h-[1px] bg-white/5 mx-2" />
                          <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-[#a855f7]/10 flex items-center justify-center shrink-0">
                              <Brain className="w-5 h-5 text-[#a855f7]" />
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-[15px]">Mental Math Techniques</h4>
                              <p className="text-[#8a8a93] text-[13px]">Learn shortcuts & tricks</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
            {isTyping && !messages.find(m => m.isStreaming) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex mb-6 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-[#1e1e24] border border-[#a855f7]/20 flex items-center justify-center shrink-0 mr-3 mt-1 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
                   <div className="w-6 h-6">
                     <Bot className="w-full h-full text-white" />
                   </div>
                </div>
                <div className="bg-[#161619] border border-white/5 text-white/90 rounded-[22px] rounded-tl-sm shadow-md p-4 flex items-center gap-1.5 h-[46px]">
                  <span className="text-[13px] text-white/50">Nova is typing...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/90 to-transparent pt-12 z-30 pointer-events-none">
        <div className="bg-[#161619] border border-white/10 rounded-[28px] p-1.5 flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] pointer-events-auto w-full max-w-3xl mx-auto backdrop-blur-md">
          <button className="w-10 h-10 rounded-full bg-[#2e1065] text-[#d8b4fe] flex items-center justify-center shrink-0 hover:bg-[#3b0764] transition-colors shadow-inner">
             <Sparkles className="w-5 h-5" />
          </button>
          
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask me anything..." 
            className="flex-1 bg-transparent border-none text-[15px] text-white placeholder-white/40 focus:outline-none px-2"
          />
          
          <button className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white/40 hover:text-white transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => handleSend()}
            disabled={!query.trim()}
            className="w-10 h-10 rounded-full bg-[#6d28d9] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(109,40,217,0.4)] disabled:opacity-50 disabled:shadow-none hover:bg-[#5b21b6] transition-colors"
          >
            <Send className="w-[18px] h-[18px] text-white ml-0.5" />
          </button>
        </div>
        
        {chatTokens <= 2 && mode === 'chat' && (
          <div className="text-center mt-3 pointer-events-auto">
             <span className="text-[12px] text-white/50 font-medium">
               {chatTokens} free messages remaining. 
                <button onClick={onSend} className="text-[#a855f7] hover:text-[#c084fc] ml-1 font-bold">Upgrade</button>
             </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
