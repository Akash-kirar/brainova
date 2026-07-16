import React from 'react';
import { Bot } from 'lucide-react';

export default function AiInsightCard() {
  return (
    <div className="bg-transparent relative flex items-center justify-between">
      {/* Background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-[#4c1d95]/20 rounded-full blur-[50px] pointer-events-none" />
      
      <div className="flex-1 relative z-10 pt-2 pb-2">
        <h3 className="text-[26px] font-bold text-white mb-3 tracking-tight">AI Insight</h3>
        <p className="text-[#a1a1aa] text-[18px] mb-1 tracking-tight">Your focus is a bit low today.</p>
        <p className="text-[#a1a1aa] text-[18px] tracking-tight">
          Best training time: <span className="text-[#8b5cf6]">8:00 PM – 10:00 PM</span>
        </p>
      </div>

      {/* Robot Graphic placeholder */}
      <div className="w-24 h-24 relative z-10 shrink-0 flex items-center justify-center -mt-2">
        <div className="w-20 h-20 bg-gradient-to-br from-[#c4b5fd] to-[#8b5cf6] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)] border-[3px] border-[#ede9fe] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <Bot className="w-12 h-12 text-white relative z-10 drop-shadow-md" />
        </div>
      </div>
    </div>
  );
}
