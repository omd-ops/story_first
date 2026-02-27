import React, { useState } from 'react';
import { Lightbulb, MessageSquare, Bug, Zap, X, ChevronRight, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function FeedbackButton() {
  const [showModal, setShowModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'idea' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // In a real app, this would send to an API
    console.log('Feedback submitted:', { type: feedbackType, text: feedbackText });
    setIsSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setIsSubmitted(false);
      setFeedbackType(null);
      setFeedbackText('');
    }, 2000);
  };

  const feedbackOptions = [
    {
      type: 'bug' as const,
      icon: <Bug className="w-6 h-6" />,
      title: 'Report a Bug',
      description: 'Let us know if something isn\'t working',
      color: 'bg-red-500',
    },
    {
      type: 'idea' as const,
      icon: <Zap className="w-6 h-6" />,
      title: 'Share an Idea',
      description: 'Suggest a feature or improvement',
      color: 'bg-[var(--accent-yellow)]',
    },
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.5 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 left-6 w-14 h-14 rounded-full bg-[var(--accent-yellow)] hover:bg-[#E6C84F] shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
      >
        <Lightbulb className="w-6 h-6 text-black" />
      </motion.button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center p-0 md:p-5"
            onClick={() => {
              if (!feedbackType) setShowModal(false);
            }}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg md:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {!feedbackType ? (
                // Selection Screen
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--accent-yellow)] flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-black" />
                      </div>
                      <h2 className="text-2xl tracking-wider text-black" style={{ fontFamily: 'var(--font-bebas)' }}>
                        Help Us Improve
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-black" />
                    </button>
                  </div>

                  <p className="text-[var(--secondary-text)] mb-6">
                    Your input helps us make StoryFirst better for everyone
                  </p>

                  <div className="space-y-3">
                    {feedbackOptions.map((option) => (
                      <button
                        key={option.type}
                        onClick={() => setFeedbackType(option.type)}
                        className="w-full bg-[var(--background-elevated)] border-2 border-[var(--border)] hover:border-[var(--accent-yellow)] rounded p-4 transition-all hover:shadow-md group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`${option.color} w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                            {option.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-black font-semibold text-lg mb-0.5">
                              {option.title}
                            </div>
                            <div className="text-[var(--secondary-text)] text-sm">
                              {option.description}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[var(--secondary-text)] group-hover:text-[var(--accent-yellow)] transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : isSubmitted ? (
                // Success Screen
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-8 flex flex-col items-center justify-center min-h-[400px]"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-6"
                  >
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </motion.div>
                  <h3 className="text-3xl tracking-wider text-black mb-3" style={{ fontFamily: 'var(--font-bebas)' }}>
                    Thank You!
                  </h3>
                  <p className="text-[var(--secondary-text)] text-center">
                    We appreciate your {feedbackType}. It helps us improve StoryFirst.
                  </p>
                </motion.div>
              ) : (
                // Form Screen
                <div className="flex flex-col h-full max-h-[600px]">
                  <div className="p-6 border-b border-[var(--border)]">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => setFeedbackType(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-black rotate-180" />
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setFeedbackType(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-black" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`${feedbackOptions.find(o => o.type === feedbackType)?.color} w-10 h-10 rounded-full flex items-center justify-center text-white`}>
                        {feedbackOptions.find(o => o.type === feedbackType)?.icon}
                      </div>
                      <h2 className="text-2xl tracking-wider text-black" style={{ fontFamily: 'var(--font-bebas)' }}>
                        {feedbackOptions.find(o => o.type === feedbackType)?.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto">
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder={
                        feedbackType === 'bug'
                          ? 'Describe the issue you encountered...'
                          : 'What feature or improvement would you like to see?'
                      }
                      rows={10}
                      className="w-full bg-[var(--background-elevated)] border-2 border-[var(--border)] rounded px-5 py-4 text-black placeholder-[var(--secondary-text)] resize-none focus:outline-none focus:border-[var(--accent-yellow)] transition-colors"
                      autoFocus
                    />
                  </div>

                  <div className="p-6 border-t border-[var(--border)]">
                    <button
                      onClick={handleSubmit}
                      disabled={feedbackText.trim().length === 0}
                      className="w-full bg-[var(--accent-yellow)] hover:bg-[#E6C84F] text-black py-3.5 rounded-full font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg"
                    >
                      <Send className="w-5 h-5" />
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}