import React, { useState } from 'react';
import BookingCalendar from './components/BookingCalendar';
import BookingForm from './components/BookingForm';
import ConfirmationModal from './components/ConfirmationModal';
import SettingsPanel from './components/SettingsPanel';
import { saveBookedSlot } from './utils/timeSlots';
import { sendMenteeConfirmation, sendMentorNotification } from './utils/emailService';

function App() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    // Smooth scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('booking-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleBookingSubmit = async (bookingData) => {
    setIsSubmitting(true);

    try {
      // Save the booked slot to prevent double-booking
      const slotSaved = saveBookedSlot(bookingData.slot);
      if (!slotSaved) {
        throw new Error('Failed to save booking slot');
      }

      // Send confirmation emails
      const [menteeResult, mentorResult] = await Promise.all([
        sendMenteeConfirmation(bookingData),
        sendMentorNotification(bookingData)
      ]);

      // Set email status for UI feedback
      setEmailStatus({
        success: menteeResult.success && mentorResult.success,
        demo: menteeResult.demo || mentorResult.demo,
        details: { menteeResult, mentorResult }
      });

      // Store booking result
      setBookingResult(bookingData);

      // Show confirmation modal
      setShowConfirmation(true);

      // Reset form state
      setSelectedSlot(null);

      console.log('✅ Booking completed successfully:', {
        slot: bookingData.slotDisplay,
        mentee: bookingData.name,
        topic: bookingData.topic,
        emailStatus: { menteeResult, mentorResult }
      });

    } catch (error) {
      console.error('❌ Booking failed:', error);
      alert('Sorry, there was an error booking your session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setBookingResult(null);
    setEmailStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Office Hours with Chris Ford
              </h1>
              <p className="text-gray-600 mt-1">
                Free 30-minute mentorship sessions for founders and makers
              </p>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Email Settings"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-ydp-blue rounded-full flex items-center justify-center text-white text-xl font-bold">
                CF
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About These Sessions</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Hi! I'm Chris Ford, founder and analytics leader with experience building products from
                zero to scale. I offer free office hours to give back to the founder community.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">100% Free</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">30-minute sessions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Actionable guidance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Column */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Choose Your Time</h2>
            <BookingCalendar
              onSlotSelect={handleSlotSelect}
              selectedSlot={selectedSlot}
            />
          </div>

          {/* Form Column */}
          <div id="booking-form">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Book Your Session</h2>
            <BookingForm
              selectedSlot={selectedSlot}
              onSubmit={handleBookingSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">What can we discuss?</h3>
              <p className="text-sm text-gray-600">
                Product strategy, technical leadership, fundraising, analytics/data, career transitions,
                or general founder challenges. I tailor each session to your specific needs.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">How should I prepare?</h3>
              <p className="text-sm text-gray-600">
                Come with specific questions or challenges. The more context you provide in the booking
                form, the better I can prepare to help you.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">What's the format?</h3>
              <p className="text-sm text-gray-600">
                30-minute video calls. I'll send a calendar invite with the meeting link after you book.
                Sessions are conversational and focused on actionable guidance.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Can I book multiple sessions?</h3>
              <p className="text-sm text-gray-600">
                Absolutely! Many founders benefit from periodic check-ins. Feel free to book follow-up
                sessions as your challenges evolve.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              Built by{' '}
              <a
                href="https://ydp-portfolio.vercel.app"
                className="text-ydp-blue hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Yadkin Data Partners
              </a>{' '}
              • Questions? Email chris@yadkindata.com
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        bookingData={bookingResult}
        emailStatus={emailStatus}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default App;