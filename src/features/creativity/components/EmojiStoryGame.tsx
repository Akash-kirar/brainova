import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Zap, Smile } from 'lucide-react';

interface EmojiStoryGameProps {
  onBack: () => void;
  onGameComplete: (score: number, maxLevel: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const EMOJI_POOL = ['😀','😎','🤖','👻','👽','👾','🚀','🛸','🌍','🌟','🍕','🍔','🌮','🍎','🍌','🚗','🚕','🏎️','🚲','✈️','🐶','🐱','🐭','🦊','🐻','🐼','🦁','🐮','🐷','🐸','🐵','🦄','🎸','🎺','🥁','🎨','🎭','🎬','⚽','🏀','🏈','⚾','🎾','🎮','🕹️','📱','💻','⌨️','⌚','⏰'];

const PROMPTS = [
  "A space adventure",
  "A strange lunch",
  "The animal band",
  "A busy city day",
  "Magic school",
  "The haunted house",
  "Robot uprising",
  "A day at the zoo",
  "Sports final match",
  "Tech conference"
];

export default function EmojiStoryGame({ onBack, onGameComplete, difficulty }: EmojiStoryGameProps) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    generateLevel();
  }, [level]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const generateLevel = () => {
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    setStory([]);
    
    // Pick 12 random emojis
    const newOptions: string[] = [];
    const pool = [...EMOJI_POOL];
    for (let i = 0; i < 12; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      newOptions.push(pool[idx]);
      pool.splice(idx, 1);
    }
    setOptions(newOptions);
  };

  const handleSelect = (emoji: string) => {
    if (gameState !== 'playing') return;
    
    if (story.length < 5) {
      setStory([...story, emoji]);
    }
  };
  
  const handleRemove = (index: number) => {
    const newStory = [...story];
    newStory.splice(index, 1);
    setStory(newStory);
  };

  const handleSubmit = () => {
    if (gameState !== 'playing' || story.length === 0) return;
    
    // In a real app we might use AI to judge, but here we just reward length and speed
    const points = story.length * 10 * level;
    setScore(s => s + points);
    setTimeLeft(t => Math.min(60, t + 10)); // Bonus time
    setLevel(l => l + 1);
  };

  const endGame = () => {
    setGameState('gameover');
    setTimeout(() => onGameComplete(score, level), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-white">
      <div className="flex items-center justify-between p-6">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-lg">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-lg">{timeLeft}s</span>
          </div>
          <div className="font-bold text-lg text-white/50">Lvl {level}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-6 max-w-4xl mx-auto w-full">
        {gameState === 'playing' ? (
          <div className="w-full flex flex-col items-center gap-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-amber-400 mb-2">"{prompt}"</h2>
              <p className="text-white/60">Create a story using 3-5 emojis!</p>
            </div>
            
            <div className="flex gap-4 min-h-[80px] p-4 bg-white/5 rounded-2xl w-full max-w-2xl justify-center items-center flex-wrap border border-white/10">
              <AnimatePresence>
                {story.length === 0 && (
                  <span className="text-white/30 italic">Select emojis below...</span>
                )}
                {story.map((emoji, i) => (
                  <motion.button
                    key={`${i}-${emoji}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => handleRemove(i)}
                    className="text-4xl hover:scale-110 transition-transform bg-white/10 p-2 rounded-xl"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 w-full max-w-2xl">
              {options.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(emoji)}
                  disabled={story.length >= 5}
                  className="text-4xl p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={story.length < 3}
              className="mt-4 px-12 py-4 bg-amber-500 text-black font-bold text-xl rounded-full hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Submit Story
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Time's Up!</h2>
            <p className="text-xl text-white/60 mb-8">Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
