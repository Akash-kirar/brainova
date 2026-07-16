const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="p-6 flex-1 flex flex-col items-center justify-center">\s*<div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full">.*?<\/button>\s*<\/div>\s*<\/div>/s;

const newSubModal = `<div className="p-6 flex-1 flex flex-col items-center justify-start sm:justify-center overflow-y-auto">
                    <div className="max-w-md w-full">
                      <div className="space-y-4">
                        {/* 1 Month Plan */}
                        <div 
                          onClick={() => {
                            setSelectedPlan('1month');
                            setIsSubscriptionModalOpen(false);
                            setIsCheckoutModalOpen(true);
                          }}
                          className="bg-[#1a1b26] border border-[#2a2b36] rounded-[24px] p-6 flex items-center justify-between cursor-pointer transition-colors hover:border-[#3a3b46]"
                        >
                          <div>
                            <h4 className="font-bold text-white text-[22px] mb-1">1 Month</h4>
                            <p className="text-[12px] text-gray-400 uppercase tracking-[0.2em] font-medium">SUBSCRIPTION</p>
                          </div>
                          <div className="text-right">
                            <span className="text-3xl font-bold text-white">₹199</span>
                          </div>
                        </div>

                        {/* 3 Month Plan */}
                        <div 
                          onClick={() => {
                            setSelectedPlan('6months');
                            setIsSubscriptionModalOpen(false);
                            setIsCheckoutModalOpen(true);
                          }}
                          className="bg-[#1a1b26] border border-[#3b1722] rounded-[24px] p-6 flex items-center justify-between cursor-pointer relative transition-colors hover:border-[#4b2732]"
                        >
                          <div>
                            <h4 className="font-bold text-white text-[22px] mb-1">3 Months</h4>
                            <p className="text-[12px] text-gray-400 uppercase tracking-[0.2em] font-medium">SUBSCRIPTION</p>
                          </div>
                          <div className="text-right">
                            <span className="text-3xl font-bold text-white">₹99</span>
                          </div>
                        </div>

                        {/* 1 Year Plan */}
                        <div 
                          onClick={() => {
                            setSelectedPlan('1year');
                            setIsSubscriptionModalOpen(false);
                            setIsCheckoutModalOpen(true);
                          }}
                          className="bg-[#1a1b26] border border-[#f59e0b] rounded-[24px] p-6 flex items-center justify-between cursor-pointer transition-colors hover:border-[#fbbf24]"
                        >
                          <div>
                            <h4 className="font-bold text-white text-[22px] mb-1">1 Year</h4>
                            <p className="text-[12px] text-gray-400 uppercase tracking-[0.2em] font-medium">SUBSCRIPTION</p>
                          </div>
                          <div className="text-right">
                            <span className="text-3xl font-bold text-white">₹1,999</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>`;

if (regex.test(content)) {
    content = content.replace(regex, newSubModal);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Replaced successfully.");
} else {
    console.log("Could not find the target content to replace.");
}
