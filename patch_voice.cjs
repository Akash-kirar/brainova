const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

// Add imports if needed
if (!content.includes("useRef")) {
  content = content.replace("import React, { useState, useEffect }", "import React, { useState, useEffect, useRef }");
}

// Add state
const stateReplacement = `  const { tokensRemaining, limit, useToken, hasTokens, isPro } = useChatLimit();
  const [isRecording, setIsRecording] = useState(false);
  const [speechLang, setSpeechLang] = useState('en-US');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setQuery((prev) => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return alert('Speech recognition not supported.');
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.lang = speechLang;
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };`;

content = content.replace("  const { tokensRemaining, limit, useToken, hasTokens, isPro } = useChatLimit();", stateReplacement);

// Add language selector and mic button logic
const micButtonRegex = /<button className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white\/40 hover:text-white transition-colors">\s*<Mic className="w-5 h-5" \/>\s*<\/button>/;

const micButtonReplacement = `          <select 
            value={speechLang}
            onChange={(e) => setSpeechLang(e.target.value)}
            className="bg-transparent text-white/50 text-xs border-none outline-none cursor-pointer hover:text-white transition-colors"
          >
            <option value="en-US">EN</option>
            <option value="es-ES">ES</option>
            <option value="fr-FR">FR</option>
            <option value="de-DE">DE</option>
            <option value="it-IT">IT</option>
            <option value="hi-IN">HI</option>
            <option value="ja-JP">JA</option>
            <option value="zh-CN">ZH</option>
          </select>
          <button 
            onClick={toggleRecording}
            className={\`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors \${isRecording ? 'text-red-500 animate-pulse bg-red-500/10' : 'text-white/40 hover:text-white'}\`}
          >
            <Mic className="w-5 h-5" />
          </button>`;

content = content.replace(micButtonRegex, micButtonReplacement);

fs.writeFileSync('src/components/AiCoachView.tsx', content);
