import React, { useState, useEffect } from 'react';
import { generateTimeSlots, groupSlotsByDate, formatSlotDisplay } from '../utils/timeSlots';

const BookingCalendar = ({ onSlotSelect, selectedSlot }) => {
  const [slots, setSlots] = useState([]);
  const [groupedSlots, setGroupedSlots] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate available time slots
    const availableSlots = generateTimeSlots();
    const grouped = groupSlotsByDate(availableSlots);

    setSlots(availableSlots);
    setGroupedSlots(grouped);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg mb-2">No available slots</div>
        <p className="text-gray-400">
          Office hours are Monday-Friday, 8:00-10:00 AM EST.
          New slots are released daily.
        </p>
      </div>
    );
  }

  const handleSlotClick = (slot) => {
    onSlotSelect(slot);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Office Hours Schedule</h3>
        <p className="text-blue-800 text-sm">
          Monday - Friday, 8:00 AM - 10:00 AM EST<br/>
          30-minute sessions • Next 30 days available
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSlots).map(([date, dayData]) => (
          <div key={date} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              {dayData.displayDate}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dayData.slots.map((slot) => {
                const isSelected = selectedSlot && selectedSlot.datetime === slot.datetime;

                return (
                  <button
                    key={slot.datetime}
                    onClick={() => handleSlotClick(slot)}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
                      ${isSelected
                        ? 'border-ydp-blue bg-ydp-blue text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-ydp-blue hover:bg-blue-50'
                      }
                    `}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {slots.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {slots.length} available slots over the next 30 days
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;