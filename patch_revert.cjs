const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const buttonRegex = /<button \s*onClick=\{\(\) => setIsNotificationsOpen\(true\)\}\s*className="w-full flex items-center gap-4 text-left px-4 py-4 text-base text-white bg-white\/5 border border-white\/10 hover:bg-white\/10 transition-all duration-300 rounded-xl"\s*>\s*<div className="w-10 h-10 rounded-full bg-white\/10 flex items-center justify-center">\s*<Bell className="w-5 h-5 text-rose-400" \/>\s*<\/div>\s*<div className="flex flex-1 justify-between items-center">\s*<span className="font-medium">Notifications<\/span>[\s\S]*?<\/div>\s*<\/button>/;

const dropdownContent = `<div className="flex flex-col w-full">
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="w-full flex items-center gap-4 text-left px-4 py-4 text-base text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="flex flex-1 justify-between items-center">
                      <span className="font-medium">Notifications</span>
                      {notifications.filter(n => !n.isRead).length > 0 && (
                        <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                          <span className="text-[10px] font-bold">{notifications.filter(n => !n.isRead).length}</span>
                        </div>
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-2"
                      >
                        <div className="bg-[#1a1a1c]/80 border border-white/10 rounded-xl p-3 space-y-2 max-h-[350px] overflow-y-auto hide-scrollbar">
                          {notifications.length > 0 ? notifications.map((notification) => (
                            <div 
                              key={notification.id}
                              onClick={() => {
                                // Mark as read
                                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
                                // We can also set selected to show message if needed, but they want it inline.
                                setSelectedNotification(notification as any);
                              }}
                              className={\`p-3 rounded-lg border cursor-pointer \${notification.isRead ? 'bg-white/5 border-white/5' : 'bg-rose-500/10 border-rose-500/30'}\`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h4 className={\`text-sm font-bold \${notification.isRead ? 'text-white/70' : 'text-white'}\`}>{notification.title}</h4>
                                <span className="text-[10px] text-white/40 ml-2 whitespace-nowrap">{notification.time}</span>
                              </div>
                              <p className="text-xs text-white/60 leading-relaxed">{notification.message}</p>
                            </div>
                          )) : (
                            <div className="p-4 text-center text-white/40 text-sm">No notifications yet</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>`;

if (buttonRegex.test(content)) {
  content = content.replace(buttonRegex, dropdownContent);
  console.log("Replaced button with dropdown!");
} else {
  console.log("Could not find button to replace.");
}

const modalRegex = /\s*{\/\*\s*Notifications Modal\s*\*\/}\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>/;

if (modalRegex.test(content)) {
  content = content.replace(modalRegex, '');
  console.log("Removed fullscreen modal.");
} else {
  console.log("Could not find fullscreen modal.");
}

fs.writeFileSync('src/App.tsx', content);
