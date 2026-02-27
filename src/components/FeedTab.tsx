import React, { useState } from 'react';
import { Heart, TrendingUp, Trophy, Flame } from 'lucide-react';
import { StreakDisplay } from './StreakDisplay';
import { mockUser, mockFeedItems, mockLeaderboard, FeedItem } from '../data/mockData';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function FeedTab() {
  const [feedItems, setFeedItems] = useState(mockFeedItems);
  const [likedStories, setLikedStories] = useState<{ [key: string]: boolean }>({
    'story-1': false,
    'story-2': false,
    'story-3': false,
    'story-4': false,
  });
  const [leaderboardTab, setLeaderboardTab] = useState<'global' | 'circle'>('global');

  const toggleLike = (id: string) => {
    setFeedItems(items =>
      items.map(item =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    );
  };

  const toggleStoryLike = (storyId: string) => {
    setLikedStories(prev => ({
      ...prev,
      [storyId]: !prev[storyId],
    }));
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-white">
      {/* Main Content - Responsive Layout */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 pt-8 md:pt-12 pb-4">
        {/* Centered content container - similar to intro screen on desktop */}
        <div className="lg:max-w-3xl lg:mx-auto">
          {/* Status Cards Grid - Horizontal on desktop, 2-col grid on mobile */}
          <div className="grid grid-cols-2 gap-4 md:gap-5 mb-8 md:mb-12">
            {/* Streak Card - Game-style */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative bg-gradient-to-br from-[var(--accent-orange)] via-[#FF7A28] to-[var(--accent-orange-dark)] rounded p-6 md:p-8 aspect-square lg:aspect-auto flex flex-col justify-between overflow-hidden shadow-lg"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/5 rounded-full -ml-10 -mb-10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-2">
                  <Flame className="w-5 h-5 text-white" />
                  <div className="text-xs text-white tracking-[0.1em] font-bold uppercase" style={{ fontFamily: 'var(--font-helvetica)' }}>
                    Streak
                  </div>
                </div>
              </div>
              <div className="relative z-10">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl md:text-7xl lg:text-6xl font-bold text-white leading-none" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '-0.02em' }}>
                    {mockUser.streak}
                  </span>
                  <span className="text-xl md:text-2xl text-white/90 font-bold" style={{ fontFamily: 'var(--font-bebas)' }}>
                    Days
                  </span>
                </div>
                <div className="text-sm text-white/95 font-medium">Keep it going! 🔥</div>
              </div>
            </motion.div>

            {/* XP Card - Game-style */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="relative bg-gradient-to-br from-[var(--accent-blue)] via-[#0055EE] to-[var(--accent-blue-dark)] rounded p-6 md:p-8 aspect-square lg:aspect-auto flex flex-col justify-between overflow-hidden shadow-lg"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/5 rounded-full -ml-10 -mb-10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <div className="text-xs text-white tracking-[0.1em] font-bold uppercase" style={{ fontFamily: 'var(--font-helvetica)' }}>
                    Total XP
                  </div>
                </div>
              </div>
              <div className="relative z-10">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl md:text-6xl lg:text-5xl font-bold text-white leading-none" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '-0.02em' }}>
                    {mockUser.xp.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-white/95 font-medium">Experience Points</div>
              </div>
            </motion.div>
          </div>

          {/* Leaderboard Section - Desktop only, moved above stories */}
          <div className="hidden lg:block mb-8 md:mb-12">
            <h3 className="text-sm tracking-[0.1em] text-[var(--secondary-text)] mb-4 flex items-center gap-2 font-bold uppercase" style={{ fontFamily: 'var(--font-helvetica)' }}>
              <Trophy className="w-5 h-5" />
              Leaderboard
            </h3>
            
            {/* List-style Leaderboard */}
            <div className="bg-white rounded border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Toggle at top */}
              <div className="px-5 py-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLeaderboardTab('global')}
                    className={`flex-1 py-3 px-5 rounded-full text-sm font-semibold transition-all ${
                      leaderboardTab === 'global'
                        ? 'bg-[var(--accent-orange)] text-white shadow-md hover:bg-[var(--accent-orange-dark)]'
                        : 'bg-white text-black hover:bg-gray-50 border-2 border-gray-300'
                    }`}
                  >
                    Global
                  </button>
                  <button
                    onClick={() => setLeaderboardTab('circle')}
                    className={`flex-1 py-3 px-5 rounded-full text-sm font-semibold transition-all ${
                      leaderboardTab === 'circle'
                        ? 'bg-[var(--accent-orange)] text-white shadow-md hover:bg-[var(--accent-orange-dark)]'
                        : 'bg-white text-black hover:bg-gray-50 border-2 border-gray-300'
                    }`}
                  >
                    Circle
                  </button>
                </div>
              </div>

              {/* Top 5 List */}
              <div className="p-5">
                {mockLeaderboard.map((user, index) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-4 py-4 transition-colors hover:bg-[var(--background-elevated)] -mx-3 px-3 rounded ${
                      index < mockLeaderboard.length - 1 ? 'border-b border-[var(--border)]' : ''
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-transform hover:scale-110 ${
                      index === 0
                        ? 'bg-gradient-to-br from-[var(--accent-orange)] to-[var(--accent-orange-dark)] text-white shadow-md'
                        : index === 1
                        ? 'bg-gradient-to-br from-[#FFD166] to-[#FFC233] text-black shadow-md'
                        : index === 2
                        ? 'bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-pink-dark)] text-white shadow-md'
                        : 'bg-[var(--background-elevated)] text-[var(--secondary-text)]'
                    }`} style={{ fontFamily: 'var(--font-bebas)' }}>
                      {user.rank}
                    </div>

                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full overflow-hidden transition-transform hover:scale-110 ${
                      index === 0
                        ? 'border-2 border-[var(--accent-orange)]'
                        : 'border-2 border-[var(--border-medium)]'
                    }`}>
                      <div className={`w-full h-full flex items-center justify-center text-2xl ${
                        index === 0
                          ? 'bg-gradient-to-br from-orange-100 to-amber-200'
                          : index === 1
                          ? 'bg-gradient-to-br from-yellow-100 to-amber-100'
                          : index === 2
                          ? 'bg-gradient-to-br from-pink-100 to-rose-100'
                          : 'bg-gradient-to-br from-gray-100 to-gray-200'
                      }`}>
                        {index === 0 ? '🧑' : index === 1 ? '👩' : index === 2 ? '👨' : index === 3 ? '👧' : '🧔'}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="flex-1">
                      <div className={`font-semibold ${
                        index === 0 ? 'text-black text-base' : 'text-black text-sm'
                      }`}>
                        {user.name}
                        {index === 0 && (
                          <span className="ml-2 text-base">👑</span>
                        )}
                      </div>
                    </div>

                    {/* XP */}
                    <div className={`text-right font-bold ${
                      index === 0
                        ? 'text-[var(--accent-orange)] text-lg'
                        : 'text-[var(--secondary-text)] text-sm'
                    }`} style={{ fontFamily: 'var(--font-bebas)' }}>
                      {user.xp.toLocaleString()} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard Section - Mobile/Tablet only, above stories */}
          <div className="lg:hidden mb-8 md:mb-12">
            <h3 className="text-sm tracking-[0.1em] text-[var(--secondary-text)] mb-4 flex items-center gap-2 font-bold uppercase" style={{ fontFamily: 'var(--font-helvetica)' }}>
              <Trophy className="w-5 h-5" />
              Leaderboard
            </h3>
            
            {/* List-style Leaderboard */}
            <div className="bg-white rounded border border-[var(--border)] overflow-hidden shadow-sm">
              {/* Toggle at top */}
              <div className="px-4 py-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLeaderboardTab('global')}
                    className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all ${
                      leaderboardTab === 'global'
                        ? 'bg-[var(--accent-orange)] text-white shadow-md'
                        : 'bg-white text-black hover:bg-gray-50 border-2 border-gray-300'
                    }`}
                  >
                    Global
                  </button>
                  <button
                    onClick={() => setLeaderboardTab('circle')}
                    className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all ${
                      leaderboardTab === 'circle'
                        ? 'bg-[var(--accent-orange)] text-white shadow-md'
                        : 'bg-white text-black hover:bg-gray-50 border-2 border-gray-300'
                    }`}
                  >
                    Circle
                  </button>
                </div>
              </div>

              {/* Top 5 List */}
              <div className="p-4">
                {mockLeaderboard.map((user, index) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-3 py-3 ${
                      index < mockLeaderboard.length - 1 ? 'border-b border-[var(--border)]' : ''
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? 'bg-gradient-to-br from-[var(--accent-orange)] to-[var(--accent-orange-dark)] text-white shadow-md'
                        : index === 1
                        ? 'bg-gradient-to-br from-[#FFD166] to-[#FFC233] text-black shadow-md'
                        : index === 2
                        ? 'bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-pink-dark)] text-white shadow-md'
                        : 'bg-[var(--background-elevated)] text-[var(--secondary-text)]'
                    }`} style={{ fontFamily: 'var(--font-bebas)' }}>
                      {user.rank}
                    </div>

                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full overflow-hidden ${
                      index === 0
                        ? 'border-2 border-[var(--accent-orange)]'
                        : 'border-2 border-[var(--border-medium)]'
                    }`}>
                      <div className={`w-full h-full flex items-center justify-center text-2xl ${
                        index === 0
                          ? 'bg-gradient-to-br from-orange-100 to-amber-200'
                          : index === 1
                          ? 'bg-gradient-to-br from-yellow-100 to-amber-100'
                          : index === 2
                          ? 'bg-gradient-to-br from-pink-100 to-rose-100'
                          : 'bg-gradient-to-br from-gray-100 to-gray-200'
                      }`}>
                        {index === 0 ? '🧑' : index === 1 ? '👩' : index === 2 ? '👨' : index === 3 ? '👧' : '🧔'}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="flex-1">
                      <div className={`font-semibold ${
                        index === 0 ? 'text-black text-base' : 'text-black text-sm'
                      }`}>
                        {user.name}
                        {index === 0 && (
                          <span className="ml-2 text-base">👑</span>
                        )}
                      </div>
                    </div>

                    {/* XP */}
                    <div className={`text-right font-bold ${
                      index === 0
                        ? 'text-[var(--accent-orange)] text-base'
                        : 'text-[var(--secondary-text)] text-sm'
                    }`} style={{ fontFamily: 'var(--font-bebas)' }}>
                      {user.xp.toLocaleString()} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Community Stories Section */}
          <div className="mb-8">
            <h3 className="text-sm tracking-[0.1em] text-[var(--secondary-text)] mb-4 font-bold uppercase" style={{ fontFamily: 'var(--font-helvetica)' }}>
              Community Stories
            </h3>
            
            {/* Responsive Grid for Stories - 2 columns on desktop/tablet, 1 on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {/* Featured Story Cards with Images */}
              <div className="bg-white rounded overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-xl hover:border-[var(--border-medium)] transition-all duration-300 cursor-pointer group">
                <div className="h-48 md:h-56 lg:h-48 relative overflow-hidden">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1766925591424-bfe928a739a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBydW5uaW5nJTIwZm9yZXN0JTIwbW9ybmluZ3xlbnwxfHx8fDE3NzA3MjQ0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Morning run in forest"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-black font-semibold text-lg mb-2">Morning Run</h4>
                  <p className="text-sm text-[var(--secondary-text)] mb-4 line-clamp-2 leading-relaxed">
                    I never talk while I walk or run. That changed this morning...
                  </p>
                  <div className="flex items-center justify-end">
                    <button 
                      onClick={() => toggleStoryLike('story-1')}
                      className="text-[var(--secondary-text)] hover:text-[var(--accent-pink)] transition-all hover:scale-110"
                    >
                      <Heart className={`w-5 h-5 ${likedStories['story-1'] ? 'fill-current text-[var(--accent-pink)]' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-xl hover:border-[var(--border-medium)] transition-all duration-300 cursor-pointer group">
                <div className="h-48 md:h-56 lg:h-48 relative overflow-hidden">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NzA2NTQwNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Healthy food salad bowl"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-black font-semibold text-lg mb-2">Fueling Up</h4>
                  <p className="text-sm text-[var(--secondary-text)] mb-4 line-clamp-2 leading-relaxed">
                    Sometimes the story isn't in the words, it's in the ritual...
                  </p>
                  <div className="flex items-center justify-end">
                    <button 
                      onClick={() => toggleStoryLike('story-2')}
                      className="transition-all hover:scale-110"
                    >
                      <Heart className={`w-5 h-5 ${likedStories['story-2'] ? 'fill-current text-[var(--accent-pink)]' : 'text-[var(--secondary-text)] hover:text-[var(--accent-pink)]'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-xl hover:border-[var(--border-medium)] transition-all duration-300 cursor-pointer group">
                <div className="h-48 md:h-56 lg:h-48 relative overflow-hidden">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1758274539654-23fa349cc090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHlvZ2ElMjBtZWRpdGF0aW9uJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzcwNzE0MDIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Woman doing yoga meditation"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-black font-semibold text-lg mb-2">Yoga Session</h4>
                  <p className="text-sm text-[var(--secondary-text)] mb-4 line-clamp-2 leading-relaxed">
                    Today's practice was about finding stillness in chaos...
                  </p>
                  <div className="flex items-center justify-end">
                    <button 
                      onClick={() => toggleStoryLike('story-3')}
                      className="transition-all hover:scale-110"
                    >
                      <Heart className={`w-5 h-5 ${likedStories['story-3'] ? 'fill-current text-[var(--accent-pink)]' : 'text-[var(--secondary-text)] hover:text-[var(--accent-pink)]'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Fourth story card - only visible on desktop */}
              <div className="hidden lg:block bg-white rounded overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-xl hover:border-[var(--border-medium)] transition-all duration-300 cursor-pointer group">
                <div className="h-48 relative overflow-hidden">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1543269865-4430f94492b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY29udmVyc2F0aW9uJTIwcGVvcGxlfGVufDF8fHx8MTc3MDcyNDQ5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Coffee shop conversation"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-black font-semibold text-lg mb-2">Coffee Chat</h4>
                  <p className="text-sm text-[var(--secondary-text)] mb-4 line-clamp-2 leading-relaxed">
                    A stranger asked me about my book. What happened next surprised me...
                  </p>
                  <div className="flex items-center justify-end">
                    <button 
                      onClick={() => toggleStoryLike('story-4')}
                      className="transition-all hover:scale-110"
                    >
                      <Heart className={`w-5 h-5 ${likedStories['story-4'] ? 'fill-current text-[var(--accent-pink)]' : 'text-[var(--secondary-text)] hover:text-[var(--accent-pink)]'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-12"></div>
    </div>
  );
}