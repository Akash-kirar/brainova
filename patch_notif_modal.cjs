const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const dropdownRegex = /<div className="flex flex-col w-full">\s*<button[\s\S]*?<AnimatePresence>[\s\S]*?<\/AnimatePresence>\s*<\/div>/;

const buttonReplacement = `<button 
                    onClick={() => setIsNotificationsOpen(true)}
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
                  </button>`;

if (dropdownRegex.test(content)) {
  content = content.replace(dropdownRegex, buttonReplacement);
  console.log("Replaced dropdown with normal button!");
} else {
  console.log("Could not find dropdown to replace.");
}

const modalContent = `
        {/* Notifications Modal */}
        <AnimatePresence>
          {isNotificationsOpen && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-0 z-[10000] bg-[#0a0a0c] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0c]">
                {selectedNotification ? (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedNotification(null)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors -ml-2"
                    >
                      <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h2 className="text-xl font-bold text-white">Message</h2>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-rose-400" />
                    <h2 className="text-xl font-bold text-white">Notifications</h2>
                  </div>
                )}
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    setSelectedNotification(null);
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <AnimatePresence mode="wait">
                  {selectedNotification ? (
                    <motion.div 
                      key="notification-details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full flex flex-col"
                    >
                      <div className="mb-6 mt-2">
                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                          {selectedNotification.title}
                        </h3>
                        <div className="text-sm text-white/40 font-medium">
                          {selectedNotification.time}
                        </div>
                      </div>
                      
                      <div className="bg-[#1a1a1c] border border-white/5 rounded-3xl p-6 shadow-xl flex-1 flex flex-col">
                        <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-6">
                          <Bell className="w-8 h-8 text-rose-400" />
                        </div>
                        <p className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap">
                          {selectedNotification.message}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="notifications-list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {notifications.length > 0 ? (
                        <div className="space-y-4">
                          {notifications.map((notification) => (
                            <div 
                              key={notification.id}
                              onClick={() => {
                                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
                                setSelectedNotification(notification as any);
                              }}
                              className={\`p-4 rounded-2xl border cursor-pointer hover:bg-white/5 transition-colors \${notification.isRead ? 'bg-[#1a1a1c] border-white/5' : 'bg-rose-500/10 border-rose-500/30'}\`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className={\`font-bold \${notification.isRead ? 'text-white/80' : 'text-white'}\`}>
                                  {notification.title}
                                </h3>
                                <span className="text-xs text-white/40">{notification.time}</span>
                              </div>
                              <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-white/50">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Bell className="w-8 h-8 text-white/30" />
                          </div>
                          <p className="text-lg font-medium">No notifications yet</p>
                          <p className="text-sm text-white/40 mt-1">We'll let you know when something comes up</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>`;

// Insert the modal at the bottom just before the end of the Content Area.
const insertPointRegex = /\{celebrationData && \(/;

if (insertPointRegex.test(content)) {
  content = content.replace(insertPointRegex, modalContent + '\n        {celebrationData && (');
  console.log("Inserted modal before celebrationData");
} else {
  console.log("Could not find place to insert modal.");
}

fs.writeFileSync('src/App.tsx', content);
