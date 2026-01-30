import React, { useState } from 'react';
import { formatSlotDisplay } from '../utils/timeSlots';

const TOPIC_OPTIONS = [
  { value: 'Product Strategy', label: 'Product Strategy', description: 'Market validation, roadmapping, go-to-market strategy' },
  { value: 'Technical Leadership', label: 'Technical Leadership', description: 'Team building, engineering culture, architecture decisions' },
  { value: 'Fundraising', label: 'Fundraising', description: 'Pitch decks, investor relations, valuation, due diligence' },
  { value: 'Analytics & Data', label: 'Analytics & Data', description: 'D365, dashboards, data strategy, team building' },
  { value: 'Career Transition', label: 'Career Transition', description: 'Role changes, building credibility, career pivots' },
  { value: 'Other', label: 'Other', description: 'General founder mentorship and guidance' }
];

const BookingForm = ({ selectedSlot, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    topic: '',
    background: '',
    goals: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company/project is required';
    }

    if (!formData.topic) {
      newErrors.topic = 'Please select a topic';
    }

    if (!formData.background.trim()) {
      newErrors.background = 'Please provide some background';
    } else if (formData.background.trim().length < 20) {
      newErrors.background = 'Please provide more detail (at least 20 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const bookingData = {
      ...formData,
      slot: selectedSlot,
      slotDisplay: formatSlotDisplay(selectedSlot),
      submittedAt: new Date().toISOString()
    };

    onSubmit(bookingData);
  };

  if (!selectedSlot) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-gray-500 text-lg mb-2">Select a Time Slot</div>
        <p className="text-gray-400">Choose an available time slot above to continue</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Your Session</h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 font-medium">
            📅 {formatSlotDisplay(selectedSlot)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ydp-blue focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ydp-blue focus:border-transparent ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Company / Project *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ydp-blue focus:border-transparent ${
              errors.company ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Your company or project name"
          />
          {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            Primary Topic *
          </label>
          <select
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ydp-blue focus:border-transparent ${
              errors.topic ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a topic...</option>
            {TOPIC_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {formData.topic && (
            <p className="mt-1 text-sm text-gray-600">
              {TOPIC_OPTIONS.find(opt => opt.value === formData.topic)?.description}
            </p>
          )}
          {errors.topic && <p className="mt-1 text-sm text-red-600">{errors.topic}</p>}
        </div>

        <div>
          <label htmlFor="background" className="block text-sm font-medium text-gray-700 mb-2">
            Background & Context *
          </label>
          <textarea
            id="background"
            name="background"
            rows={4}
            value={formData.background}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ydp-blue focus:border-transparent ${
              errors.background ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Tell me about your company, current stage, team size, and the specific challenges you're facing..."
          />
          <div className="mt-1 text-sm text-gray-500">
            {formData.background.length}/500 characters • Be specific to help me prepare
          </div>
          {errors.background && <p className="mt-1 text-sm text-red-600">{errors.background}</p>}
        </div>

        <div>
          <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
            Session Goals <span className="text-gray-500">(Optional)</span>
          </label>
          <textarea
            id="goals"
            name="goals"
            rows={3}
            value={formData.goals}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ydp-blue focus:border-transparent"
            placeholder="What would make this session valuable for you? Specific questions or outcomes you're hoping for..."
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-ydp-blue text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Booking Session...
              </span>
            ) : (
              'Book Office Hours'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;