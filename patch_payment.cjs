const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldPayment = `            {/* Payment Modal */}
            <AnimatePresence>
              {isPaymentModalOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed inset-0 z-50 bg-[#0f111a] flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full relative">
                    <button 
                      onClick={() => setIsPaymentModalOpen(false)} 
                      className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h3>
                    
                    <div className="space-y-3 mb-8">
                      {/* UPI */}
                      <div 
                        onClick={() => setSelectedPayment('upi')}
                        className={\`border-2 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors \${selectedPayment === 'upi' ? 'border-[#00c853] bg-[#00c853]/5' : 'border-gray-200 hover:border-[#00c853]/50'}\`}
                      >
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center \${selectedPayment === 'upi' ? 'bg-[#00c853]/20 text-[#00c853]' : 'bg-gray-100 text-gray-500'}\`}>
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">UPI</h4>
                          <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                        </div>
                        {selectedPayment === 'upi' && <CheckCircle className="w-6 h-6 text-[#00c853] ml-auto" />}
                      </div>

                      {/* Card */}
                      <div 
                        onClick={() => setSelectedPayment('card')}
                        className={\`border-2 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors \${selectedPayment === 'card' ? 'border-[#00c853] bg-[#00c853]/5' : 'border-gray-200 hover:border-[#00c853]/50'}\`}
                      >
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center \${selectedPayment === 'card' ? 'bg-[#00c853]/20 text-[#00c853]' : 'bg-gray-100 text-gray-500'}\`}>
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Credit / Debit Card</h4>
                          <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                        </div>
                        {selectedPayment === 'card' && <CheckCircle className="w-6 h-6 text-[#00c853] ml-auto" />}
                      </div>

                      {/* Net Banking */}
                      <div 
                        onClick={() => setSelectedPayment('netbanking')}
                        className={\`border-2 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors \${selectedPayment === 'netbanking' ? 'border-[#00c853] bg-[#00c853]/5' : 'border-gray-200 hover:border-[#00c853]/50'}\`}
                      >
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center \${selectedPayment === 'netbanking' ? 'bg-[#00c853]/20 text-[#00c853]' : 'bg-gray-100 text-gray-500'}\`}>
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Net Banking</h4>
                          <p className="text-sm text-gray-500">All Indian Banks</p>
                        </div>
                        {selectedPayment === 'netbanking' && <CheckCircle className="w-6 h-6 text-[#00c853] ml-auto" />}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setIsPaymentModalOpen(false);
                        setIsPro(true);
                        setTotalXP(prev => prev + 500);
                        setTimeout(() => alert('Payment Successful! Welcome to Pro!'), 300);
                      }}
                      disabled={!selectedPayment}
                      className={\`w-full py-4 font-bold rounded-xl transition-all uppercase tracking-wider text-sm \${
                        selectedPayment 
                          ? 'bg-[#00c853] hover:bg-[#00e676] text-white shadow-lg shadow-[#00c853]/30 cursor-pointer' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }\`}
                    >
                      Pay Now
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>`;

const newPayment = `            {/* Payment Modal */}
            <AnimatePresence>
              {isPaymentModalOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed inset-0 z-50 bg-[#0a0a0c] flex items-center justify-center p-4"
                >
                  <div className="bg-[#1c1c24] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full relative">
                    <button 
                      onClick={() => setIsPaymentModalOpen(false)} 
                      className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <h3 className="text-2xl font-bold text-white mb-6">Payment Method</h3>
                    
                    <div className="space-y-3 mb-8">
                      {/* UPI */}
                      <div 
                        onClick={() => setSelectedPayment('upi')}
                        className={\`border rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors \${selectedPayment === 'upi' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/50'}\`}
                      >
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center \${selectedPayment === 'upi' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-[#0a0a0c] text-white/50'}\`}>
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">UPI</h4>
                          <p className="text-sm text-white/50">Google Pay, PhonePe, Paytm</p>
                        </div>
                        {selectedPayment === 'upi' && <CheckCircle className="w-6 h-6 text-indigo-400 ml-auto" />}
                      </div>

                      {/* Card */}
                      <div 
                        onClick={() => setSelectedPayment('card')}
                        className={\`border rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors \${selectedPayment === 'card' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/50'}\`}
                      >
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center \${selectedPayment === 'card' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-[#0a0a0c] text-white/50'}\`}>
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">Credit / Debit Card</h4>
                          <p className="text-sm text-white/50">Visa, Mastercard, RuPay</p>
                        </div>
                        {selectedPayment === 'card' && <CheckCircle className="w-6 h-6 text-indigo-400 ml-auto" />}
                      </div>

                      {/* Net Banking */}
                      <div 
                        onClick={() => setSelectedPayment('netbanking')}
                        className={\`border rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors \${selectedPayment === 'netbanking' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/50'}\`}
                      >
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center \${selectedPayment === 'netbanking' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-[#0a0a0c] text-white/50'}\`}>
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">Net Banking</h4>
                          <p className="text-sm text-white/50">All Indian Banks</p>
                        </div>
                        {selectedPayment === 'netbanking' && <CheckCircle className="w-6 h-6 text-indigo-400 ml-auto" />}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setIsPaymentModalOpen(false);
                        setIsPro(true);
                        setTotalXP(prev => prev + 500);
                        setTimeout(() => alert('Payment Successful! Welcome to Pro!'), 300);
                      }}
                      disabled={!selectedPayment}
                      className={\`w-full py-4 font-bold rounded-xl transition-all uppercase tracking-wider text-sm \${
                        selectedPayment 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-lg shadow-purple-500/20 cursor-pointer' 
                          : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }\`}
                    >
                      Pay Now
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>`;

if (content.includes(oldPayment)) {
    content = content.replace(oldPayment, newPayment);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Payment patched successfully.");
} else {
    console.log("Could not find old payment content.");
}
