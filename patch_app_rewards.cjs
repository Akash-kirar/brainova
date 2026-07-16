const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="max-w-md mx-auto w-full space-y-4">.*?<div className="mt-8 text-center pt-4">\s*<p className="text-white\/40 text-sm">That's all your rewards so far!<\/p>\s*<\/div>\s*<\/div>/s;

const newModal = `<div className="max-w-md mx-auto w-full space-y-4">
                      {stats.rewardsHistory && stats.rewardsHistory.length > 0 ? (
                        stats.rewardsHistory.map((reward) => (
                          <div key={reward.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-white font-bold text-[17px]">{reward.title}</span>
                              <span className="text-white/60 text-sm">
                                {new Date(reward.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 font-bold">+{reward.amount}</span>
                              <Gem className="w-5 h-5 text-[#8b5cf6]" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center pt-8 pb-4">
                          <p className="text-white/60 text-sm">No rewards yet. Play games to earn gems!</p>
                        </div>
                      )}

                      {stats.rewardsHistory && stats.rewardsHistory.length > 0 && (
                        <div className="mt-8 text-center pt-4">
                          <p className="text-white/40 text-sm">That's all your rewards so far!</p>
                        </div>
                      )}
                    </div>`;

if (regex.test(content)) {
    content = content.replace(regex, newModal);
    fs.writeFileSync('src/App.tsx', content);
    console.log("App.tsx patched successfully.");
} else {
    console.log("Could not find old modal content in App.tsx.");
}
