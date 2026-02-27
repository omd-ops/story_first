import React, { useRef, useState } from 'react';
import { mockUser } from '../../data/mockData';

export function SettingsSection() {
  const [selectedTime, setSelectedTime] = useState({ hour: 8, minute: 0, period: 'AM' });
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);
  const periodScrollRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 4 }, (_, i) => i * 15);
  const periods = ['AM', 'PM'];
  const daysOfWeek = [
    { full: 'Mon', short: 'M' },
    { full: 'Tue', short: 'T' },
    { full: 'Wed', short: 'W' },
    { full: 'Thu', short: 'T' },
    { full: 'Fri', short: 'F' },
    { full: 'Sat', short: 'S' },
    { full: 'Sun', short: 'S' }
  ];

  // Scroll-based selection handler - matches reference behavior
  const handleScroll = (
    scrollRef: React.RefObject<HTMLDivElement>,
    items: any[],
    setter: (value: any) => void
  ) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenterY = containerRect.top + containerRect.height / 2;

    // Find which item is closest to the center
    const itemElements = container.querySelectorAll('button:not([class*="opacity-0"])');
    let closestItem = null;
    let closestDistance = Infinity;

    itemElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const itemCenterY = rect.top + rect.height / 2;
      const distance = Math.abs(containerCenterY - itemCenterY);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = index;
      }
    });

    if (closestItem !== null && items[closestItem] !== undefined) {
      setter(items[closestItem]);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-6 pb-24">
        <div className="bg-white border-2 border-[var(--border)] divide-y divide-[var(--border)] shadow-sm">
          <div className="p-5">
            <label className="block text-sm text-[var(--secondary-text)] mb-2">
              Display Name
            </label>
            <input
              type="text"
              defaultValue={mockUser.name}
              className="w-full px-4 py-3 bg-white border-2 border-[var(--border)] text-black focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
            />
          </div>

          <div className="p-5">
            <label className="block text-sm text-[var(--secondary-text)] mb-3">
              Reminder Time
            </label>
            
            {/* Time Display Button */}
            <button
              onClick={() => setShowTimePicker(!showTimePicker)}
              className="w-full px-4 py-3 bg-white border-2 border-[var(--border)] text-black focus:outline-none hover:border-[var(--accent-orange)] transition-colors text-left"
            >
              {selectedTime.hour}:{selectedTime.minute.toString().padStart(2, '0')} {selectedTime.period}
            </button>

            {/* Refined Time Picker Modal */}
            {showTimePicker && (
              <div className="mt-4 bg-white p-6 border-2 border-[var(--border)] shadow-2xl">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-black font-medium text-base tracking-tight">
                    Choose reminder time
                  </h3>
                  <button
                    onClick={() => setShowTimePicker(false)}
                    className="text-[var(--accent-orange)] text-base font-medium hover:text-[#FF9D5C] transition-colors"
                  >
                    Done
                  </button>
                </div>
                
                {/* Time Picker Wheel */}
                <div className="relative h-52 bg-[var(--background-elevated)] rounded-2xl overflow-hidden shadow-inner">
                  {/* Selection Bar - Warm Orange/Yellow with Soft Glow */}
                  <div className="absolute top-1/2 left-0 right-0 h-11 -translate-y-1/2 pointer-events-none z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF8B3D] via-[#FFD166] to-[#FF8B3D] rounded-xl opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF8B3D] via-[#FFD166] to-[#FF8B3D] rounded-xl blur-md opacity-40"></div>
                  </div>
                  
                  {/* Gradient Overlays for soft fade */}
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[var(--background-elevated)] via-[var(--background-elevated)]/80 to-transparent pointer-events-none z-20"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--background-elevated)] via-[var(--background-elevated)]/80 to-transparent pointer-events-none z-20"></div>
                  
                  <div className="flex h-full">
                    {/* Hour Picker */}
                    <div className="flex-1 relative overflow-y-auto scrollbar-hide py-20 scroll-smooth" ref={hourScrollRef} onScroll={() => handleScroll(hourScrollRef, hours, (h: number) => setSelectedTime({ ...selectedTime, hour: h }))}>
                      <div className="flex flex-col items-center">
                        {hours.map((h) => (
                          <button
                            key={h}
                            onClick={() => setSelectedTime({ ...selectedTime, hour: h })}
                            className={`py-2.5 px-4 transition-all duration-300 ease-out relative z-30 ${
                              selectedTime.hour === h
                                ? 'text-black text-2xl font-bold'
                                : 'text-[var(--secondary-text)] text-lg font-normal'
                            }`}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Minute Picker */}
                    <div className="flex-1 relative overflow-y-auto scrollbar-hide py-20 scroll-smooth" ref={minuteScrollRef} onScroll={() => handleScroll(minuteScrollRef, minutes, (m: number) => setSelectedTime({ ...selectedTime, minute: m }))}>
                      <div className="flex flex-col items-center">
                        {minutes.map((m) => (
                          <button
                            key={m}
                            onClick={() => setSelectedTime({ ...selectedTime, minute: m })}
                            className={`py-2.5 px-4 transition-all duration-300 ease-out relative z-30 ${
                              selectedTime.minute === m
                                ? 'text-black text-2xl font-bold'
                                : 'text-[var(--secondary-text)] text-lg font-normal'
                            }`}
                          >
                            {m.toString().padStart(2, '0')}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Period Picker (AM/PM) - Stack vertically without scroll */}
                    <div className="flex-1 relative overflow-y-auto scrollbar-hide py-20 scroll-smooth" ref={periodScrollRef} onScroll={() => handleScroll(periodScrollRef, periods, (p: string) => setSelectedTime({ ...selectedTime, period: p }))}>
                      <div className="flex flex-col items-center">
                        {periods.map((p) => (
                          <button
                            key={p}
                            onClick={() => setSelectedTime({ ...selectedTime, period: p })}
                            className={`py-2.5 px-4 transition-all duration-300 ease-out relative z-30 ${
                              selectedTime.period === p
                                ? 'text-black text-2xl font-bold'
                                : 'text-[var(--secondary-text)] text-lg font-normal'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5">
            <label className="block text-sm text-[var(--secondary-text)] mb-2">
              Timezone
            </label>
            <select className="w-full px-4 py-3 bg-white border-2 border-[var(--border)] text-black focus:outline-none focus:border-[var(--accent-orange)] transition-colors">
              <option>Pacific Time (PT)</option>
              <option>Mountain Time (MT)</option>
              <option>Central Time (CT)</option>
              <option>Eastern Time (ET)</option>
            </select>
          </div>

          <div className="p-5">
            <label className="block text-sm text-[var(--secondary-text)] mb-3">
              Practice Days
            </label>
            <div className="flex gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day.full}
                  onClick={() => toggleDay(day.full)}
                  className={`flex-1 aspect-square rounded-full font-semibold text-sm transition-all ${
                    selectedDays.includes(day.full)
                      ? 'bg-[var(--accent-orange)] text-white shadow-lg'
                      : 'bg-white text-[var(--secondary-text)] border-2 border-[var(--border)]'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--secondary-text)] mt-3">
              Select the days you want to practice. You'll receive reminders only on selected days.
            </p>
          </div>

          <div className="p-5">
            <label className="block text-sm text-[var(--secondary-text)] mb-2">
              Phone
            </label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-4 py-3 bg-white border-2 border-[var(--border)] text-black focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
            />
          </div>

          <div className="p-5">
            <label className="block text-sm text-[var(--secondary-text)] mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue="alex@example.com"
              className="w-full px-4 py-3 bg-white border-2 border-[var(--border)] text-black focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Sticky CTA at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[var(--border)] z-50 px-5 py-4">
        <div className="max-w-md mx-auto">
          <button className="w-full py-4 bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] text-white rounded-full font-semibold transition-colors shadow-lg">
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
