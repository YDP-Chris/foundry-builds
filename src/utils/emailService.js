import emailjs from 'emailjs-com';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_foundry';
const EMAILJS_TEMPLATE_ID_MENTEE = 'template_mentee_confirmation';
const EMAILJS_TEMPLATE_ID_MENTOR = 'template_mentor_notification';
const EMAILJS_PUBLIC_KEY = 'foundry_public_key';

// Initialize EmailJS (this would be configured with real credentials in production)
const initEmailJS = () => {
  // In production, these would be environment variables
  const serviceId = localStorage.getItem('emailjs_service_id') || EMAILJS_SERVICE_ID;
  const publicKey = localStorage.getItem('emailjs_public_key') || EMAILJS_PUBLIC_KEY;

  if (publicKey !== 'foundry_public_key') {
    emailjs.init(publicKey);
    return true;
  }

  // For demo purposes, we'll simulate email sending
  console.log('EmailJS not configured - running in demo mode');
  return false;
};

// Send confirmation email to mentee
export const sendMenteeConfirmation = async (bookingData) => {
  const isConfigured = initEmailJS();

  if (!isConfigured) {
    // Demo mode - just log the email content
    console.log('📧 Mentee Confirmation Email (Demo):', {
      to: bookingData.email,
      subject: 'Office Hours Confirmed with Chris Ford',
      message: `Hi ${bookingData.name},

Your office hours session with Chris Ford has been confirmed for ${bookingData.slotDisplay}.

Session Details:
- Date & Time: ${bookingData.slotDisplay}
- Topic: ${bookingData.topic}
- Duration: 30 minutes

Chris will send a calendar invite with the video call link shortly.

Looking forward to our conversation!

Best regards,
Chris Ford
Yadkin Data Partners`
    });
    return { success: true, demo: true };
  }

  try {
    const templateParams = {
      to_email: bookingData.email,
      to_name: bookingData.name,
      slot_display: bookingData.slotDisplay,
      topic: bookingData.topic,
      company: bookingData.company,
      meeting_link: 'Video call link will be provided in calendar invite'
    };

    const result = await emailjs.send(
      localStorage.getItem('emailjs_service_id'),
      localStorage.getItem('emailjs_mentee_template') || EMAILJS_TEMPLATE_ID_MENTEE,
      templateParams
    );

    return { success: true, result };
  } catch (error) {
    console.error('Error sending mentee confirmation:', error);
    return { success: false, error: error.message };
  }
};

// Send notification email to Chris
export const sendMentorNotification = async (bookingData) => {
  const isConfigured = initEmailJS();

  if (!isConfigured) {
    // Demo mode - just log the email content
    console.log('📧 Mentor Notification Email (Demo):', {
      to: 'chris@yadkindata.com',
      subject: `New Office Hours Booking: ${bookingData.name}`,
      message: `New office hours booking confirmed:

Mentee Details:
- Name: ${bookingData.name}
- Email: ${bookingData.email}
- Company: ${bookingData.company}
- Topic: ${bookingData.topic}

Session: ${bookingData.slotDisplay}

Background:
${bookingData.background}

Suggested Prep:
- Review their company/product if mentioned
- Prepare relevant examples from your experience
- Consider connections that might be helpful

Calendar invite has been generated and should be sent manually.`
    });
    return { success: true, demo: true };
  }

  try {
    const templateParams = {
      mentee_name: bookingData.name,
      mentee_email: bookingData.email,
      mentee_company: bookingData.company,
      topic: bookingData.topic,
      slot_display: bookingData.slotDisplay,
      background: bookingData.background,
      prep_notes: generatePrepNotes(bookingData)
    };

    const result = await emailjs.send(
      localStorage.getItem('emailjs_service_id'),
      localStorage.getItem('emailjs_mentor_template') || EMAILJS_TEMPLATE_ID_MENTOR,
      templateParams
    );

    return { success: true, result };
  } catch (error) {
    console.error('Error sending mentor notification:', error);
    return { success: false, error: error.message };
  }
};

// Generate preparation notes for Chris based on topic and background
const generatePrepNotes = (bookingData) => {
  const topicPrepMap = {
    'Product Strategy': 'Review product development frameworks, market validation approaches, and scaling strategies. Consider sharing examples from Vuori\'s growth.',
    'Technical Leadership': 'Prepare to discuss team building, engineering culture, tech stack decisions, and balancing technical debt. Share experiences from analytics team leadership.',
    'Fundraising': 'Review current market conditions, investor expectations, pitch deck best practices, and due diligence processes.',
    'Analytics & Data': 'Discuss D365 implementation strategies, dashboard design principles, data storytelling, and analytics team structure.',
    'Career Transition': 'Cover transitioning between roles, building credibility in new domains, and managing career pivots in tech.',
    'Other': 'General founder mentorship - be prepared to listen and provide guidance based on their specific situation.'
  };

  const basePrepNotes = topicPrepMap[bookingData.topic] || topicPrepMap['Other'];

  return `Topic Focus: ${bookingData.topic}

${basePrepNotes}

Additional Context:
Company: ${bookingData.company}
Background: ${bookingData.background}

Remember to:
- Listen first, understand their specific challenge
- Share relevant experiences from your journey
- Provide actionable next steps
- Offer to make relevant connections if helpful`;
};

// Setup instructions for EmailJS configuration
export const getEmailSetupInstructions = () => {
  return {
    title: "Email Configuration Setup",
    instructions: [
      "1. Create a free EmailJS account at emailjs.com",
      "2. Set up an email service (Gmail, Outlook, etc.)",
      "3. Create email templates for mentee confirmation and mentor notification",
      "4. Get your Service ID, Template IDs, and Public Key from EmailJS dashboard",
      "5. Configure these settings in the app's settings panel"
    ],
    storageKeys: [
      { key: 'emailjs_service_id', description: 'Your EmailJS Service ID' },
      { key: 'emailjs_public_key', description: 'Your EmailJS Public Key' },
      { key: 'emailjs_mentee_template', description: 'Template ID for mentee confirmations' },
      { key: 'emailjs_mentor_template', description: 'Template ID for mentor notifications' }
    ]
  };
};