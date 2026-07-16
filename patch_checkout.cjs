const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldCheckout = `            {/* Checkout / Promo Code Modal */}
            <AnimatePresence>
              {isCheckoutModalOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed inset-0 z-50 bg-[#0f111a] flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full relative">
                    <button 
                      onClick={() => setIsCheckoutModalOpen(false)} 
                      className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h3>
                    
                    <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100 text-gray-900 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Selected Plan</span>
                        <span className="font-bold">
                          {selectedPlan === '1month' ? '1 Month' : selectedPlan === '6months' ? '3 Months' : '1 Year'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold text-gray-700">Price</span>
                        <span className={\`font-bold \${promoApplied ? 'line-through text-gray-400' : ''}\`}>
                          ₹{selectedPlan === '1month' ? '199' : selectedPlan === '6months' ? '99' : '1,999'}
                        </span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between items-center text-lg mt-1 text-[#00c853]">
                          <span className="font-semibold">Discounted Price</span>
                          <span className="font-bold">
                            ₹{promoApplied === 'INDIA' 
                                ? (selectedPlan === '1month' ? '99' : selectedPlan === '6months' ? '49' : '999')
                                : (selectedPlan === '1month' ? '159' : selectedPlan === '6months' ? '79' : '1,599')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Promo code</h4>
                      <div className="flex gap-3 mb-2">
                        <input 
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="NEW20 or INDIA"
                          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-[#00c853] focus:ring-1 focus:ring-[#00c853] transition-all placeholder:text-gray-400"
                        />
                        <button 
                          onClick={() => {
                            if (promoCode === 'NEW20' || promoCode === 'INDIA') {
                              setPromoApplied(promoCode);
                            } else {
                              setPromoApplied(false);
                            }
                          }}
                          className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 font-medium ml-1">One code per order</p>
                    </div>

                    <button 
                      onClick={() => {
                        setIsCheckoutModalOpen(false);
                        setIsPaymentModalOpen(true);
                      }}
                      className="w-full py-4 bg-[#00c853] hover:bg-[#00e676] text-white font-bold rounded-xl transition-colors uppercase tracking-wider text-sm shadow-lg shadow-[#00c853]/30"
                    >
                      Confirm Purchase
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>`;

const newCheckout = `            {/* Checkout / Promo Code Modal */}
            <AnimatePresence>
              {isCheckoutModalOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed inset-0 z-50 bg-[#0a0a0c] flex items-center justify-center p-4"
                >
                  <div className="bg-[#1c1c24] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full relative">
                    <button 
                      onClick={() => setIsCheckoutModalOpen(false)} 
                      className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <h3 className="text-2xl font-bold text-white mb-6">Checkout</h3>
                    
                    <div className="bg-[#0a0a0c] rounded-2xl p-5 mb-6 border border-white/5 text-white shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white/60">Selected Plan</span>
                        <span className="font-bold text-white">
                          {selectedPlan === '1month' ? '1 Month' : selectedPlan === '6months' ? '3 Months' : '1 Year'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold text-white/60">Price</span>
                        <span className={\`font-bold \${promoApplied ? 'line-through text-white/40' : 'text-white'}\`}>
                          ₹{selectedPlan === '1month' ? '199' : selectedPlan === '6months' ? '99' : '1,999'}
                        </span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between items-center text-lg mt-1 text-green-400">
                          <span className="font-semibold">Discounted Price</span>
                          <span className="font-bold">
                            ₹{promoApplied === 'INDIA' 
                                ? (selectedPlan === '1month' ? '99' : selectedPlan === '6months' ? '49' : '999')
                                : (selectedPlan === '1month' ? '159' : selectedPlan === '6months' ? '79' : '1,599')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-white mb-3">Promo code</h4>
                      <div className="flex gap-3 mb-2">
                        <input 
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="NEW20 or INDIA"
                          className="flex-1 bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-white/30"
                        />
                        <button 
                          onClick={() => {
                            if (promoCode === 'NEW20' || promoCode === 'INDIA') {
                              setPromoApplied(promoCode);
                            } else {
                              setPromoApplied(false);
                            }
                          }}
                          className="px-6 py-3 bg-[#0a0a0c] border border-white/10 rounded-xl font-semibold text-white hover:bg-white/5 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-sm text-white/40 font-medium ml-1">One code per order</p>
                    </div>

                    <button 
                      onClick={() => {
                        setIsCheckoutModalOpen(false);
                        setIsPaymentModalOpen(true);
                      }}
                      className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl transition-colors uppercase tracking-wider text-sm shadow-lg shadow-purple-500/20"
                    >
                      Confirm Purchase
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>`;

if (content.includes(oldCheckout)) {
    content = content.replace(oldCheckout, newCheckout);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Checkout patched successfully.");
} else {
    console.log("Could not find old checkout content.");
}
