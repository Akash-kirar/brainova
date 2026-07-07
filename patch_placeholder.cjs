const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

const placeholders = [
  "Ask me anything...",
  "What is my today score?",
  "What is my week section?",
  "What should I do today?",
  "How to improve my focus?"
];

const stateReplacement = `  const { tokensRemaining, limit, useToken, hasTokens, isPro } = useChatLimit();
  const [isRecording, setIsRecording] = useState(false);
  const [speechLang, setSpeechLang] = useState('en-US');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const placeholders = [
      "Ask me anything...",
      "What is my today score?",
      "What is my week section?",
      "What should I do today?",
      "How to improve my focus?"
    ];
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);`;

content = content.replace("  const { tokensRemaining, limit, useToken, hasTokens, isPro } = useChatLimit();\n  const [isRecording, setIsRecording] = useState(false);\n  const [speechLang, setSpeechLang] = useState('en-US');\n  const recognitionRef = useRef<any>(null);", stateReplacement);

const inputRegex = /placeholder="Ask me anything..."/;
const inputReplacement = `placeholder={["Ask me anything...", "What is my today score?", "What is my week section?", "What should I do today?", "How to improve my focus?"][placeholderIndex]}`;

content = content.replace(inputRegex, inputReplacement);
fs.writeFileSync('src/components/AiCoachView.tsx', content);
