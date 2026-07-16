const fs = require('fs');
let content = fs.readFileSync('src/components/ui/CelebrationOverlay.tsx', 'utf8');

content = content.replace(
  'score: number;\n  coins: number;',
  'score: number;\n  coins: number;\n  streak?: number;'
);
content = content.replace(
  'export default function CelebrationOverlay({ score, coins, onClose }: CelebrationOverlayProps) {',
  'export default function CelebrationOverlay({ score, coins, streak = 1, onClose }: CelebrationOverlayProps) {'
);
content = content.replace(
  '<span className="text-white font-bold text-lg leading-none mb-1">+1</span>',
  '<span className="text-white font-bold text-lg leading-none mb-1">+{streak}</span>'
);
content = content.replace(
  /\{\/\* Streak Card \*\/\}.*?<\/motion\.div>/s,
  `{/* Streak Card */}
          {streak > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-[#121217] border border-white/5 rounded-2xl p-4 flex flex-col items-center"
            >
              <div className="w-10 h-10 flex items-center justify-center mb-3">
                <Zap className="w-7 h-7 text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              </div>
              <span className="text-white font-bold text-lg leading-none mb-1">+{streak}</span>
              <span className="text-white/40 text-xs font-medium">Streak Slot</span>
            </motion.div>
          )}`
);

content = content.replace('grid-cols-3', 'grid-cols-${streak > 0 ? 3 : 2}');

fs.writeFileSync('src/components/ui/CelebrationOverlay.tsx', content);
