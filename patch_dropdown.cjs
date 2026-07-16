const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const dropdownRegex = /<AnimatePresence>\s*\{isNotificationsOpen && \([\s\S]*?<\/AnimatePresence>\s*<\/div>/;

const newDropdown = `<AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-2"
                      >
                        <div className="bg-[#1a1a1c] border border-white/10 rounded-xl p-4 min-h-[200px] max-h-[400px] overflow-y-auto hide-scrollbar">
                          {selectedNotification ? (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex flex-col h-full"
                            >
                              <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedNotification(null);
                                  }}
                                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                  </svg>
                                </button>
                                <span className="font-bold text-white text-sm">Message Details</span>
                              </div>
                              <h3 className="text-lg font-bold text-white mb-1 leading-tight">{selectedNotification.title}</h3>
                              <span className="text-xs text-white/40 mb-4">{selectedNotification.time}</span>
                              <div className="bg-white/5 rounded-xl p-4 flex-1">
                                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{selectedNotification.message}</p>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="space-y-2"
                            >
                              {notifications.length > 0 ? notifications.map((notification) => (
                                <div 
                                  key={notification.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
                                    setSelectedNotification(notification as any);
                                  }}
                                  className={\`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] \${notification.isRead ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20'}\`}
                                >
                                  <div className="flex justify-between items-start mb-1.5">
                                    <h4 className={\`text-sm font-bold \${notification.isRead ? 'text-white/70' : 'text-white'}\`}>{notification.title}</h4>
                                    <span className="text-[10px] text-white/40 ml-2 whitespace-nowrap">{notification.time}</span>
                                  </div>
                                  <p className="text-xs text-white/60 leading-relaxed line-clamp-2">{notification.message}</p>
                                </div>
                              )) : (
                                <div className="p-8 text-center flex flex-col items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                    <Bell className="w-5 h-5 text-white/30" />
                                  </div>
                                  <span className="text-white/50 text-sm font-medium">No notifications yet</span>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>`;

if (dropdownRegex.test(content)) {
  content = content.replace(dropdownRegex, newDropdown);
  console.log("Updated dropdown to include selected notification view!");
  fs.writeFileSync('src/App.tsx', content);
} else {
  console.log("Could not find dropdown regex.");
}
