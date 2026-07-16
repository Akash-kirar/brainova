const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "onClick={() => {\n                            setSelectedPlan('1month');\n                            setIsSubscriptionModalOpen(false);\n                            setIsCheckoutModalOpen(true);\n                          }}",
  "onClick={() => {\n                            setSelectedPlan('1month');\n                          }}"
);

content = content.replace(
  'className="bg-[#1a1b26] border border-[#2a2b36] rounded-[24px] p-6 flex items-center justify-between cursor-pointer transition-colors hover:border-[#3a3b46]"',
  "className={`bg-[#1a1b26] border rounded-[24px] p-6 flex items-center justify-between cursor-pointer transition-colors ${selectedPlan === '1month' ? 'border-white bg-white/10' : 'border-[#2a2b36] hover:border-[#3a3b46]'}`}"
);

content = content.replace(
  "onClick={() => {\n                            setSelectedPlan('6months');\n                            setIsSubscriptionModalOpen(false);\n                            setIsCheckoutModalOpen(true);\n                          }}",
  "onClick={() => {\n                            setSelectedPlan('6months');\n                          }}"
);

content = content.replace(
  'className="bg-[#1a1b26] border border-[#3b1722] rounded-[24px] p-6 flex items-center justify-between cursor-pointer relative transition-colors hover:border-[#4b2732]"',
  "className={`bg-[#1a1b26] border rounded-[24px] p-6 flex items-center justify-between cursor-pointer relative transition-colors ${selectedPlan === '6months' ? 'border-pink-500 bg-pink-500/10' : 'border-[#3b1722] hover:border-[#4b2732]'}`}"
);

content = content.replace(
  "onClick={() => {\n                            setSelectedPlan('1year');\n                            setIsSubscriptionModalOpen(false);\n                            setIsCheckoutModalOpen(true);\n                          }}",
  "onClick={() => {\n                            setSelectedPlan('1year');\n                          }}"
);

content = content.replace(
  'className="bg-[#1a1b26] border border-[#f59e0b] rounded-[24px] p-6 flex items-center justify-between cursor-pointer transition-colors hover:border-[#fbbf24]"',
  "className={`bg-[#1a1b26] border rounded-[24px] p-6 flex items-center justify-between cursor-pointer transition-colors ${selectedPlan === '1year' ? 'border-[#fbbf24] bg-[#fbbf24]/10' : 'border-[#f59e0b] hover:border-[#fbbf24]'}`}"
);

const oldFooter = `                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>`;

const newFooter = `                        </div>
                      </div>

                      <div className="mt-8 space-y-4">
                        <button
                          onClick={() => {
                            setIsSubscriptionModalOpen(false);
                            setIsCheckoutModalOpen(true);
                          }}
                          className="w-full py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg shadow-pink-500/25"
                        >
                          Start 7-Day Free Trial
                        </button>
                        <p className="text-center text-white/50 text-sm font-medium cursor-pointer hover:text-white/80" onClick={() => setIsSubscriptionModalOpen(false)}>
                          Cancel anytime
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>`;

if (content.includes(oldFooter)) {
    content = content.replace(oldFooter, newFooter);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Subscription patched successfully");
} else {
    console.log("Could not find oldFooter");
}
