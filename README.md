# Founder Office Hours

A booking system for Chris Ford's founder mentorship office hours. Built with React, Tailwind CSS, and EmailJS for a complete end-to-end booking experience.

## Features

🗓️ **Smart Scheduling**: Available Monday-Friday, 8:00-10:00 AM EST
📧 **Email Confirmations**: Dual confirmations for mentor and mentee
📱 **Mobile Responsive**: Works seamlessly on all devices
⚡ **Real-time Booking**: Prevents double-booking with localStorage persistence
🎯 **Topic Selection**: Focused sessions on specific founder challenges

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

## Email Configuration (Optional)

The app works in demo mode without email configuration. For production use with real email confirmations:

1. Create a free account at [EmailJS](https://emailjs.com)
2. Set up an email service (Gmail, Outlook, etc.)
3. Create email templates for confirmations
4. Click the settings gear icon in the app to configure your credentials

### Required EmailJS Settings:
- Service ID
- Public Key
- Mentee confirmation template ID
- Mentor notification template ID

## How It Works

### For Mentees:
1. Browse available time slots (next 30 days)
2. Select a convenient time
3. Fill out the booking form with background and goals
4. Receive email confirmation and calendar invite

### For Mentors:
1. Receive notification with mentee details and session prep notes
2. Get calendar invite with all relevant information
3. Manage availability through the simple time slot system

## Tech Stack

- **React 18**: Modern UI framework
- **Tailwind CSS**: Utility-first styling
- **date-fns**: Date/time handling
- **EmailJS**: Email service integration
- **Vite**: Fast build tool
- **Vercel**: Deployment platform

## Architecture

```
src/
├── components/
│   ├── BookingCalendar.jsx    # Time slot selection
│   ├── BookingForm.jsx        # Mentee information form
│   ├── ConfirmationModal.jsx  # Success confirmation
│   └── SettingsPanel.jsx     # Email configuration
├── utils/
│   ├── timeSlots.js          # Availability & booking logic
│   └── emailService.js       # Email integration
└── App.jsx                   # Main application
```

## Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel --prod
```

### Environment Variables
No environment variables required for demo mode. For email functionality, configure through the UI settings panel.

## Customization

### Office Hours Schedule
Edit `src/utils/timeSlots.js` to modify:
- Available days (currently Mon-Fri)
- Time window (currently 8-10 AM EST)
- Session duration (currently 30 minutes)

### Mentorship Topics
Edit `src/components/BookingForm.jsx` to modify the `TOPIC_OPTIONS` array.

### Branding
Update colors in `tailwind.config.js` and replace Chris's information in `src/App.jsx`.

## Data Persistence

- **Booking Storage**: localStorage (prevents double-booking)
- **Settings Storage**: localStorage (email configuration)
- **No Backend Required**: Fully client-side application

## Browser Support

- Chrome/Edge 80+
- Firefox 78+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is part of the Foundry autonomous product builder. For questions or issues, contact chris@yadkindata.com.

## License

MIT - Built by [Yadkin Data Partners](https://ydp-portfolio.vercel.app)