const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Add state
app = app.replace(
  "const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);",
  "const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);\n  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);"
);

// Replace button onClick and modal content
const oldModalContent = `                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">We value your feedback</h2>
                    <p className="text-white/60 text-sm">Let us know how we can improve Brainova.</p>
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          className={\`w-8 h-8 transition-colors \${
                            star <= feedbackRating 
                              ? 'text-[#f59e0b] fill-[#f59e0b]' 
                              : 'text-white/20 hover:text-white/40'
                          }\`} 
                        />
                      </button>
                    ))}
                  </div>
                  
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us more about your experience..."
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 resize-none transition-colors mb-6"
                  ></textarea>
                  
                  <button
                    onClick={() => {
                      // Here you would typically send the feedback to your backend
                      console.log({ rating: feedbackRating, text: feedbackText });
                      setIsFeedbackOpen(false);
                      setFeedbackRating(0);
                      setFeedbackText('');
                    }}
                    disabled={feedbackRating === 0}
                    className="w-full py-4 rounded-xl font-bold text-white transition-colors relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-transform group-hover:scale-[1.02]"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Submit Feedback
                    </span>
                  </button>`;

const newModalContent = `                  {!isFeedbackSubmitted ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">We value your feedback</h2>
                        <p className="text-white/60 text-sm">Let us know how we can improve Brainova.</p>
                      </div>
                      
                      <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setFeedbackRating(star)}
                            className="p-1 focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star 
                              className={\`w-8 h-8 transition-colors \${
                                star <= feedbackRating 
                                  ? 'text-[#f59e0b] fill-[#f59e0b]' 
                                  : 'text-white/20 hover:text-white/40'
                              }\`} 
                            />
                          </button>
                        ))}
                      </div>
                      
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Tell us more about your experience..."
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 resize-none transition-colors mb-6"
                      ></textarea>
                      
                      <button
                        onClick={() => {
                          console.log({ rating: feedbackRating, text: feedbackText });
                          setIsFeedbackSubmitted(true);
                          setTimeout(() => {
                            setIsFeedbackSubmitted(false);
                            setIsFeedbackOpen(false);
                            setFeedbackRating(0);
                            setFeedbackText('');
                          }, 2000);
                        }}
                        disabled={feedbackRating === 0}
                        className="w-full py-4 rounded-xl font-bold text-white transition-colors relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-transform group-hover:scale-[1.02]"></div>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Send className="w-5 h-5" />
                          Submit Feedback
                        </span>
                      </button>
                    </>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">Thank You!</h2>
                      <p className="text-white/60">Your feedback has been submitted successfully.</p>
                    </motion.div>
                  )}`;

app = app.replace(oldModalContent, newModalContent);

fs.writeFileSync('src/App.tsx', app);
