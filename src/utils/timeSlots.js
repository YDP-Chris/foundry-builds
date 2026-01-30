import {
  addDays,
  format,
  getDay,
  isAfter,
  isSameDay,
  parse,
  startOfDay,
  addMinutes,
  parseISO
} from 'date-fns';

// Office hours: Monday-Friday, 8:00 AM - 10:00 AM EST
const OFFICE_HOURS_START = 8; // 8 AM
const OFFICE_HOURS_END = 10; // 10 AM
const SLOT_DURATION = 30; // 30 minutes
const TIMEZONE = 'EST';

// Get booked slots from localStorage
export const getBookedSlots = () => {
  try {
    const stored = localStorage.getItem('foundry_booked_slots');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading booked slots:', error);
    return [];
  }
};

// Save booked slot to localStorage
export const saveBookedSlot = (slot) => {
  try {
    const bookedSlots = getBookedSlots();
    bookedSlots.push({
      datetime: slot.datetime,
      bookedAt: new Date().toISOString(),
      id: `slot_${Date.now()}`
    });
    localStorage.setItem('foundry_booked_slots', JSON.stringify(bookedSlots));
    return true;
  } catch (error) {
    console.error('Error saving booked slot:', error);
    return false;
  }
};

// Check if a slot is already booked
export const isSlotBooked = (datetime) => {
  const bookedSlots = getBookedSlots();
  return bookedSlots.some(slot => slot.datetime === datetime);
};

// Generate available time slots for the next 30 days
export const generateTimeSlots = () => {
  const slots = [];
  const today = new Date();
  const endDate = addDays(today, 30); // Generate 30 days in advance

  for (let date = today; date <= endDate; date = addDays(date, 1)) {
    const dayOfWeek = getDay(date);

    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }

    // Generate time slots for this day
    for (let hour = OFFICE_HOURS_START; hour < OFFICE_HOURS_END; hour++) {
      for (let minutes = 0; minutes < 60; minutes += SLOT_DURATION) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, minutes, 0, 0);

        // Skip past times
        if (isAfter(new Date(), slotTime)) {
          continue;
        }

        const datetime = slotTime.toISOString();

        // Skip if already booked
        if (isSlotBooked(datetime)) {
          continue;
        }

        slots.push({
          datetime,
          date: format(date, 'yyyy-MM-dd'),
          time: format(slotTime, 'h:mm a'),
          displayDate: format(date, 'EEEE, MMM d'),
          available: true
        });
      }
    }
  }

  return slots;
};

// Group slots by date for calendar display
export const groupSlotsByDate = (slots) => {
  return slots.reduce((groups, slot) => {
    const dateKey = slot.date;
    if (!groups[dateKey]) {
      groups[dateKey] = {
        displayDate: slot.displayDate,
        slots: []
      };
    }
    groups[dateKey].slots.push(slot);
    return groups;
  }, {});
};

// Format slot for display
export const formatSlotDisplay = (slot) => {
  return `${slot.displayDate} at ${slot.time} ${TIMEZONE}`;
};

// Generate calendar invite content
export const generateCalendarInvite = (slot, menteeData) => {
  const startTime = parseISO(slot.datetime);
  const endTime = addMinutes(startTime, SLOT_DURATION);

  const formatCalendarDate = (date) => {
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Foundry Office Hours//EN
BEGIN:VEVENT
UID:${Date.now()}@ydp-foundry.com
DTSTAMP:${formatCalendarDate(new Date())}
DTSTART:${formatCalendarDate(startTime)}
DTEND:${formatCalendarDate(endTime)}
SUMMARY:Office Hours: ${menteeData.name}
DESCRIPTION:Office Hours Session\\n\\nMentee: ${menteeData.name}\\nCompany: ${menteeData.company}\\nTopic: ${menteeData.topic}\\n\\nBackground:\\n${menteeData.background}\\n\\nContact: ${menteeData.email}
LOCATION:Video Call (link to be sent separately)
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  return icsContent;
};