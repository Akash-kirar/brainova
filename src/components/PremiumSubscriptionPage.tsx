import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Crown, PlayCircle, TrendingUp, Calendar, BarChart2, Ban, Headphones, Star } from 'lucide-react';

export default function PremiumSubscriptionPage({ onBack, onSkip, onSuccess }: { onBack: () => void; onSkip?: () => void; onSuccess?: () => void; }) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly' | 'yearly'>('yearly');

  
  const handlePayment = async () => {
    // For demo purposes, allow instant unlock if no real razorpay keys are present
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID === 'dummy') {
      localStorage.setItem("brainova_is_pro", "true");
      alert("Payment successful! You are now a Premium member. (Demo Mode)");
      onBack();
      if (onSuccess) onSuccess();
      return;
    }

    let amount = 1999;
    if (selectedPlan === 'monthly') amount = 199;
    if (selectedPlan === 'quarterly') amount = 99;

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, currency: 'INR' })
      });
      const order = await res.json();
      if (!order.id) {
        alert('Server error');
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy', 
        amount: order.amount,
        currency: order.currency,
        name: "Brainova Premium",
        description: selectedPlan + " subscription",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify-signature', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });
            const verifyData = await verifyRes.json();
            if (verifyData.msg === 'success') {
              localStorage.setItem("brainova_is_pro", "true");
              alert("Payment successful! You are now a Premium member.");
              onBack();
              if (onSuccess) onSuccess();
            } else {
              alert("Payment verification failed.");
            }
          } catch (e) {
            console.error(e);
            alert("Error verifying payment");
          }
        },
        theme: {
          color: "#8b5cf6"
        }
      };
      
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (e) {
      console.error(e);
      alert('Could not initiate payment');
    }
  };

  const features = [
    { text: 'Access to all 100+ Premium Games', icon: <PlayCircle className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Advanced AI analysis', icon: <TrendingUp className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Priority Support', icon: <Headphones className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Early Access to New Features', icon: <Star className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Detailed progress reports', icon: <BarChart2 className="w-[18px] h-[18px] text-[#f59e0b]" /> },
    { text: 'Personalized Daily Workouts', icon: <Calendar className="w-[18px] h-[18px] text-[#f59e0b]" /> },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0c0914] font-sans text-white relative z-50 overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#2e1065]/40 to-transparent pointer-events-none"></div>
      
      {/* Small floating stars/particles */}
      <div className="absolute top-8 left-10 w-2 h-2 bg-purple-400 rounded-sm rotate-45 opacity-40"></div>
      <div className="absolute top-20 right-14 w-3 h-3 bg-pink-400 rounded-sm rotate-12 opacity-30"></div>
      <div className="absolute top-40 left-20 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-50"></div>
      <div className="absolute top-32 right-32 w-2 h-2 bg-blue-400 rounded-sm rotate-45 opacity-40"></div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 shrink-0 z-10 relative">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-white/90">
          <ChevronLeft className="w-6 h-6" />
        </button>

      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32 flex flex-col relative z-10">
        
        {/* Crown Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
            <Crown className="w-[60px] h-[60px] text-[#fbbf24] fill-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-[28px] font-bold text-white mb-2 tracking-tight">Brainova Premium</h2>
          <p className="text-white/60 text-[16px]">Unlock your brain's full potential</p>
        </div>

        {/* Features List */}
        <div className="bg-[#1a1432] border border-white/5 rounded-3xl p-6 mb-8">
          <div className="space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-6 flex justify-center">
                  {feature.icon}
                </div>
                <span className="text-[15px] font-medium text-white/90">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setSelectedPlan('monthly')}
            className={`w-full rounded-2xl p-5 flex justify-between items-center border-[2px] transition-all relative ${
              selectedPlan === 'monthly' 
                ? 'bg-slate-800/80 border-slate-400' 
                : 'bg-white/5 border-transparent opacity-80 hover:opacity-100'
            }`}
          >
            <div className="text-left">
              <div className="font-bold text-[18px] text-white">1 Month</div>
              <div className="text-[11px] font-bold tracking-wider mt-1 text-white/50 uppercase">Subscription</div>
            </div>
            <div className="font-bold text-[24px] text-white">₹199</div>
          </button>

          <button 
            onClick={() => setSelectedPlan('quarterly')}
            className={`w-full rounded-2xl p-5 flex justify-between items-center border-[2px] transition-all relative ${
              selectedPlan === 'quarterly' 
                ? 'bg-[#f43f5e]/10 border-[#f43f5e]' 
                : 'bg-[#f43f5e]/5 border-[#f43f5e]/20 opacity-90 hover:opacity-100'
            }`}
          >
            
            <div className="text-left">
              <div className="font-bold text-[18px] text-white">3 Months</div>
              <div className="text-[11px] font-bold tracking-wider mt-1 text-white/50 uppercase">Subscription</div>
            </div>
            <div className="font-bold text-[24px] text-white">₹99</div>
          </button>

          <button 
            onClick={() => setSelectedPlan('yearly')}
            className={`w-full rounded-2xl p-5 flex justify-between items-center border-[2px] transition-all relative ${
              selectedPlan === 'yearly' 
                ? 'bg-amber-500/10 border-amber-500' 
                : 'bg-amber-500/5 border-amber-500/20 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="text-left">
              <div className="font-bold text-[18px] text-white">1 Year</div>
              <div className="text-[11px] font-bold tracking-wider mt-1 text-white/50 uppercase">Subscription</div>
            </div>
            <div className="font-bold text-[24px] text-white">₹1,999</div>
          </button>
        </div>

      </div>

      {/* Bottom Sticky action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pt-10 bg-gradient-to-t from-[#0c0914] via-[#0c0914] to-transparent z-20 flex flex-col items-center">
        <button onClick={handlePayment} className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-400 shadow-[0_0_25px_rgba(217,70,239,0.4)] hover:shadow-[0_0_35px_rgba(217,70,239,0.6)] text-white font-bold py-4 rounded-full text-[18px] hover:-translate-y-1 transition-all mb-4">
          Proceed to Payment
        </button>
        <p className="text-white/40 text-[14px]">Cancel anytime</p>
      </div>

    </div>
  );
}
