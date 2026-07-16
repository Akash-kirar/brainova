const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const badCode = `                        })}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>`;

const goodCode = `                        })}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>`;

content = content.replace(badCode, goodCode);
fs.writeFileSync('src/App.tsx', content);
console.log("Fixed syntax");
