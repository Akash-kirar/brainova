import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, MessageSquare, Star, Send, Check } from 'lucide-react';
import { Language, t } from '@/src/i18n';

interface FeedbackPageProps {
  onBack: () => void;
  language: Language;
}

export default function FeedbackPage({ onBack, language }: FeedbackPageProps) {
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed inset-0 z-50 bg-[#0a0a0c] overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h2 className="text-xl font-bold text-white">{t('yourFeedback', language) || "Your Feedback"}</h2>
        <div className="w-10" />
      </div>

      <div className="px-6 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!isFeedbackSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#1a1a1c] rounded-[2rem] p-6 shadow-2xl relative overflow-hidden border border-white/5"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/10">
                    <MessageSquare className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">We value your feedback</h2>
                  
                </div>
                
                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star 
                        className={`w-10 h-10 transition-colors ${
                          star <= feedbackRating 
                            ? 'text-[#f59e0b] fill-[#f59e0b]' 
                            : 'text-white/10 hover:text-white/30'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us more about your experience..."
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all mb-8 text-base"
                ></textarea>
                
                <button
                  onClick={() => {
                    console.log({ rating: feedbackRating, text: feedbackText });
                    setIsFeedbackSubmitted(true);
                    setTimeout(() => {
                      onBack();
                    }, 2500);
                  }}
                  disabled={feedbackRating === 0}
                  className="w-full py-4 rounded-xl font-bold text-white transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-transform group-hover:scale-[1.02]"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </span>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1a1c] rounded-[2rem] p-8 shadow-2xl text-center border border-white/5"
              >
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-12 h-12 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Thank You!</h2>
                <p className="text-white/60 text-lg">Your feedback has been submitted successfully.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
