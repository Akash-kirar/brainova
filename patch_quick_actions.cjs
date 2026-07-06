const fs = require('fs');
let code = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

if (!code.includes('const [showAllQuickActions')) {
  code = code.replace(
    "const [chatTokens, setChatTokens] = useState(5);",
    "const [chatTokens, setChatTokens] = useState(5);\n  const [showAllQuickActions, setShowAllQuickActions] = useState(false);"
  );
}

const target = `<div className="px-6 flex justify-between items-center mb-4">
              <h3 className="text-[17px] font-bold text-white">Quick Actions</h3>
              <button className="text-[13px] text-[#a855f7] font-medium flex items-center hover:text-[#c084fc] transition-colors">
                View all <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
            <div className="flex gap-3 px-6 overflow-x-auto hide-scrollbar pb-2">
              {[
                { title: 'Focus Plan', subtitle: 'Improve Concentration', icon: <Target className="w-7 h-7 text-[#a855f7]" />, color: 'bg-[#a855f7]' },
                { title: 'Memory Booster', subtitle: 'Strengthen Memory', icon: <Brain className="w-7 h-7 text-[#10b981]" />, color: 'bg-[#10b981]' },
                { title: 'Math Practice', subtitle: 'Solve Faster & Smarter', icon: <Zap className="w-7 h-7 text-[#f59e0b]" />, color: 'bg-[#f59e0b]' },
                { title: 'Track Progress', subtitle: 'Analyze & Grow Consistently', icon: <BarChart2 className="w-7 h-7 text-[#3b82f6]" />, color: 'bg-[#3b82f6]' },
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(action.title)}
                  className="w-[125px] shrink-0 bg-[#161619] border border-white/5 rounded-[22px] p-4 flex flex-col items-center text-center hover:bg-[#1c1c20] transition-colors shadow-sm relative overflow-hidden group"
                >`;

const replacement = `<div className="px-6 flex justify-between items-center mb-4">
              <h3 className="text-[17px] font-bold text-white">Quick Actions</h3>
              <button 
                onClick={() => setShowAllQuickActions(!showAllQuickActions)}
                className="text-[13px] text-[#a855f7] font-medium flex items-center hover:text-[#c084fc] transition-colors"
              >
                {showAllQuickActions ? 'Show less' : 'View all'} <ChevronRight className={\`w-3.5 h-3.5 ml-0.5 transition-transform \${showAllQuickActions ? 'rotate-90' : ''}\`} />
              </button>
            </div>
            <div className={\`px-6 \${showAllQuickActions ? 'grid grid-cols-2 gap-3' : 'flex gap-3 overflow-x-auto hide-scrollbar pb-2'}\`}>
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
                  className={\`\${showAllQuickActions ? 'w-full' : 'w-[125px] shrink-0'} bg-[#161619] border border-white/5 rounded-[22px] p-4 flex flex-col items-center text-center hover:bg-[#1c1c20] transition-colors shadow-sm relative overflow-hidden group\`}
                >`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/AiCoachView.tsx', code);
  console.log('Successfully patched Quick Actions');
} else {
  console.log('Target Quick Actions not found');
}
