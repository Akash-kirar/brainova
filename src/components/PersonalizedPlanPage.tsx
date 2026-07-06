import React from 'react';
import { ChevronLeft, MoreVertical, Edit2, Lock, Check, Grid, Sparkles, LayoutGrid, Hand, Shield } from 'lucide-react';

export default function PersonalizedPlanPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-[100dvh] bg-[#0A0A0E] font-sans text-white relative z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 shrink-0 bg-[#0A0A0E] z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-bold text-[18px]">Personalized Plan</span>
        <button className="w-10 h-10 flex items-center justify-center -mr-2 text-white/70">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 space-y-6">
        
        {/* Title Section */}
        <div>
          <h2 className="text-[24px] font-bold text-white mb-1 tracking-tight">Your 7-Day Plan</h2>
          <p className="text-[#a1a1aa] text-[15px]">Customized for you</p>
        </div>

        {/* Day 1 Card */}
        <div className="bg-[#12121A] border border-white/5 rounded-3xl p-5 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#a855f7] font-bold text-[18px]">Day 1</h3>
              <p className="text-[#a1a1aa] text-[13px]">Foundation</p>
            </div>
            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#a855f7]">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Game 1 */}
            <div className="bg-[#1A1A24] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#064e3b]/40 rounded-xl flex items-center justify-center text-[#34d399]">
                  <Grid className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-[16px]">Memory Grid</h4>
                  <p className="text-[#a1a1aa] text-[13px]">5 min</p>
                </div>
              </div>
              <Check className="w-5 h-5 text-[#22c55e]" />
            </div>

            {/* Game 2 */}
            <div className="bg-[#1A1A24] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#4c1d95]/40 rounded-xl flex items-center justify-center text-[#c084fc]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-[16px]">Speed Math</h4>
                  <p className="text-[#a1a1aa] text-[13px]">3 min</p>
                </div>
              </div>
              <Check className="w-5 h-5 text-[#22c55e]" />
            </div>

            {/* Game 3 */}
            <div className="bg-[#1A1A24] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#b45309]/40 rounded-xl flex items-center justify-center text-[#fbbf24]">
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-[16px]">Pattern Logic</h4>
                  <p className="text-[#a1a1aa] text-[13px]">8 min</p>
                </div>
              </div>
              <Check className="w-5 h-5 text-[#22c55e]" />
            </div>
          </div>
        </div>

        {/* Day 2 Card (Locked) */}
        <div className="bg-[#12121A] border border-white/5 rounded-3xl p-5 relative opacity-80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#a855f7] font-bold text-[18px]">Day 2</h3>
              <p className="text-[#a1a1aa] text-[13px]">Building Strength</p>
            </div>
            <Lock className="w-5 h-5 text-[#a1a1aa]" />
          </div>

          <div className="space-y-3">
            {/* Game 1 */}
            <div className="bg-[#1A1A24] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#a1a1aa]">
                  <Hand className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-[16px]">Focus Tap</h4>
                  <p className="text-[#a1a1aa] text-[13px]">3 min</p>
                </div>
              </div>
              <Lock className="w-4 h-4 text-[#a1a1aa]" />
            </div>

            {/* Game 2 */}
            <div className="bg-[#1A1A24] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#a1a1aa]">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-[16px]">Card Match</h4>
                  <p className="text-[#a1a1aa] text-[13px]">5 min</p>
                </div>
              </div>
              <Lock className="w-4 h-4 text-[#a1a1aa]" />
            </div>
          </div>
        </div>

        {/* Day 3 Card (Locked) */}
        <div className="bg-[#12121A] border border-white/5 rounded-3xl p-5 relative opacity-80">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#a855f7] font-bold text-[18px]">Day 3</h3>
              <p className="text-[#a1a1aa] text-[13px]">Logic & Recall</p>
            </div>
            <Lock className="w-5 h-5 text-[#a1a1aa]" />
          </div>
        </div>

      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-[18px] rounded-2xl text-[17px] active:scale-[0.98] transition-all">
          Start Day 1
        </button>
      </div>

    </div>
  );
}
