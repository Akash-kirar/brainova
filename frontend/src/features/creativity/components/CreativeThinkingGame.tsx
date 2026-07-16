import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Target, Sparkles, Send } from 'lucide-react';

interface CreativeThinkingGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

const PROMPTS = [
  "A Brick", "A Paperclip", "A Coffee Mug", "A Shoelace", "A Cardboard Box",
  "A Plastic Spoon", "A Rubber Band", "A Blank Piece of Paper", "A Toothbrush"
];

export default function CreativeThinkingGame({ onBack, onGameComplete }: CreativeThinkingGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  const [prompt, setPrompt] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
      setTimeout(() => {
        onGameComplete(score, level);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, level, onGameComplete]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setIdeas([]);
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    setGameState('playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim().toLowerCase();
    
    if (val.length > 2 && !ideas.map(i => i.toLowerCase()).includes(val)) {
      setIdeas(prev => [inputValue.trim(), ...prev]);
      setScore(s => s + 15);
      
      // Every 5 ideas, change prompt and increase level
      if (ideas.length > 0 && (ideas.length + 1) % 5 === 0) {
        setLevel(l => l + 1);
        setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
        setIdeas([]);
      }
    }
    setInputValue("");
  };

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white">
        <div className="flex items-center p-6 border-b border-white/5">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Alternative Uses</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Alternative Uses</h2>
          <p className="text-white/60 mb-12">
            You will be given a common object. Type as many creative and unusual uses for it as you can think of before time runs out!
          </p>
          <button 
            onClick={startGame}
            className="px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full text-xl transition-all w-full"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] text-white overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-xl">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-400" />
            <span className="font-bold text-xl">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-2xl mx-auto w-full">
        {gameState === 'playing' ? (
          <>
            <div className="text-center mb-10 mt-8">
              <h3 className="text-white/60 font-medium uppercase tracking-widest mb-4">Name alternative uses for:</h3>
              <h2 className="text-5xl font-bold text-amber-400">{prompt}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="relative mb-8">
              <input 
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type an idea and press Enter..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl focus:outline-none focus:border-amber-500/50 transition-colors"
                autoFocus
                disabled={timeLeft === 0}
              />
              <button 
                type="submit"
                disabled={inputValue.trim().length < 3}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-amber-500 text-white rounded-xl disabled:opacity-50 disabled:bg-white/10"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              <div className="flex flex-wrap gap-3">
                {ideas.map((idea, i) => (
                  <div 
                    key={i}
                    className="bg-white/10 px-4 py-2 rounded-full text-lg border border-white/5 animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {idea}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-bold mb-4">Time's Up!</h2>
            <p className="text-xl text-white/60 mb-2">Levels Cleared: {level}</p>
            <p className="text-xl text-white/60 mb-8">Final Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
