const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the Notifications button
const buttonRegex = /<button\s+onClick=\{\(\) => setIsNotificationsOpen\(true\)\}\s+className="w-full flex items-center gap-4 text-left px-4 py-4 text-base text-white bg-white\/5 border border-white\/10 hover:bg-white\/10 transition-all duration-300 rounded-xl"\s*>\s*<div className="w-10 h-10 rounded-full bg-white\/10 flex items-center justify-center">\s*<Bell className="w-5 h-5 text-rose-400" \/>\s*<\/div>\s*<span className="font-medium">Notifications<\/span>\s*<\/button>/;

const replacementButton = `<div className="flex flex-col w-full">
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
                              className={\`p-3 rounded-lg border \${notification.isRead ? 'bg-white/5 border-white/5' : 'bg-rose-500/10 border-rose-500/30'}\`}
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
  content = content.replace(buttonRegex, replacementButton);
  console.log("Button patched!");
} else {
  console.log("Button NOT found!");
}

// Now remove the modal
const modalRegex = /\s*{\/\*\s*Notifications Modal\s*\*\/}\s*<AnimatePresence>[\s\S]*?<\/svg>\s*<\/div>\s*<p className="text-lg font-medium">No notifications yet<\/p>\s*<\/div>\s*\)\}\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>\s*<\/div>\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/;

if (modalRegex.test(content)) {
  content = content.replace(modalRegex, '');
  console.log("Modal removed!");
} else {
  console.log("Modal NOT found!");
  // Maybe just try finding the beginning
  const altModalRegex = /\s*{\/\*\s*Notifications Modal\s*\*\/}[\s\S]*?(?={\/\*\s*Game Overlay\s*\*\/}|{\/\*\s*Premium Subscription Modal\s*\*\/})/;
  if (altModalRegex.test(content)) {
      content = content.replace(altModalRegex, '');
      console.log("Alt Modal removed!");
  } else {
      console.log("Alt Modal NOT found!");
  }
}

fs.writeFileSync('src/App.tsx', content);
