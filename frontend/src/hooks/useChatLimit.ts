import { useState, useEffect } from 'react';

const FREE_LIMIT = 10;
const PRO_LIMIT = 100;

export function useChatLimit() {
  const [tokensUsed, setTokensUsed] = useState(0);
  const [currentMonth, setCurrentMonth] = useState('');
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // Check if user is pro
    const proStatus = localStorage.getItem('brainova_is_pro') === 'true';
    setIsPro(proStatus);

    const monthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const saved = localStorage.getItem('brainova_chat_limit');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.month === monthStr) {
          setTokensUsed(data.tokensUsed || 0);
        } else {
          // New month, reset
          setTokensUsed(0);
          localStorage.setItem('brainova_chat_limit', JSON.stringify({ month: monthStr, tokensUsed: 0 }));
        }
        setCurrentMonth(monthStr);
      } catch (e) {
        setCurrentMonth(monthStr);
      }
    } else {
      setCurrentMonth(monthStr);
    }
  }, []);

  const limit = isPro ? PRO_LIMIT : FREE_LIMIT;
  const tokensRemaining = Math.max(0, limit - tokensUsed);

  const useToken = () => {
    setTokensUsed(prev => {
      const newVal = prev + 1;
      localStorage.setItem('brainova_chat_limit', JSON.stringify({ month: currentMonth, tokensUsed: newVal }));
      return newVal;
    });
  };

  return {
    tokensRemaining,
    limit,
    useToken,
    hasTokens: tokensRemaining > 0,
    isPro
  };
}
