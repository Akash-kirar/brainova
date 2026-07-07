const fs = require('fs');
let content = fs.readFileSync('src/components/AiCoachView.tsx', 'utf8');

// 1. Remove Mic from imports
content = content.replace("Mic,", "");
content = content.replace(", Mic", "");
content = content.replace(" Mic,", "");

// 2. Remove state and useEffect for speech recognition
const stateToRemoveRegex = /\s*const \[isRecording, setIsRecording\] = useState\(false\);\n\s*const \[speechLang, setSpeechLang\] = useState\('en-US'\);\n\s*const \[isLangDropdownOpen, setIsLangDropdownOpen\] = useState\(false\);\n\s*const \[placeholderIndex, setPlaceholderIndex\] = useState\(0\);\n\s*const recognitionRef = useRef<any>\(null\);\n\n\s*useEffect\(\(\) => \{\n\s*const placeholders = \[\n\s*"Ask me anything\.\.\.",\n\s*"What is my today score\?",\n\s*"What is my week section\?",\n\s*"What should I do today\?",\n\s*"How to improve my focus\?"\n\s*\];\n\s*const interval = setInterval\(\(\) => \{\n\s*setPlaceholderIndex\(\(prev\) => \(prev \+ 1\) % placeholders\.length\);\n\s*\}, 3000\);\n\s*return \(\) => clearInterval\(interval\);\n\s*\}, \[\]\);\n\n\s*useEffect\(\(\) => \{[\s\S]*?recognitionRef\.current\.onend = \(\) => setIsRecording\(false\);\n\s*\}\n\s*\}, \[\]\);\n\n\s*const toggleRecording = \(\) => \{[\s\S]*?setIsRecording\(true\);\n\s*\}\n\s*\};/;

// Wait, I only want to remove speech recognition related things. 
// I'll be careful to not remove placeholder index since user likes it.

