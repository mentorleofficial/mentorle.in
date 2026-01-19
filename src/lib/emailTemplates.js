/**
 * Email Templates for Booking Notifications
 * Sender: mentorleofficial@gmail.com
 */

export function getBookingCreatedEmailTemplate({ 
  mentorName, 
  menteeName, 
  offeringTitle, 
  scheduledAt, 
  durationMinutes, 
  meetingLink,
  meetingNotes,
  timezone = 'UTC'
}) {
  const formattedDate = new Date(scheduledAt).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: timezone
  });

  const timezoneName = timezone === "Asia/Kolkata" ? "IST" : 
                      timezone === "America/New_York" ? "EST/EDT" :
                      timezone === "Europe/London" ? "GMT/BST" :
                      timezone === "UTC" ? "UTC" : timezone;

  return {
    subject: `New Booking Request: ${offeringTitle} - Action Required`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header Section -->
          <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">New Booking Request</h1>
            <p style="color: #cccccc; margin: 10px 0 0 0; font-size: 16px;">A mentee has requested a session with you</p>
          </div>
          
          <!-- Content Section -->
          <div style="padding: 32px; background: white;">
            
            <!-- Professional Greeting -->
            <div style="margin-bottom: 24px;">
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0;">Dear ${mentorName},</p>
            </div>
            
            <div style="margin-bottom: 32px;">
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                You have received a new booking request from <strong>${menteeName}</strong>. Please review the details below and confirm or decline the session.
              </p>
            </div>
            
            <!-- Booking Information -->
            <div style="background: #f8f9fa; border-left: 4px solid #000; padding: 24px; margin: 24px 0; border-radius: 4px;">
              <h3 style="color: #2c3e50; margin: 0 0 18px 0; font-size: 18px; font-weight: 600;">Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Session:</td>
                  <td style="padding: 8px 0; color: #2c3e50; font-weight: 500;">${offeringTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Mentee:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">${menteeName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Scheduled Time:</td>
                  <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">
                    ${formattedDate} (${timezoneName})
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Duration:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">${durationMinutes} minutes</td>
                </tr>
                ${meetingNotes ? `
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Mentee Notes:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">${meetingNotes}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Meeting Link:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">
                    <a href="${meetingLink}" style="color: #000; text-decoration: underline; font-weight: 500;">${meetingLink}</a>
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Action Required -->
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px; margin: 24px 0;">
              <h4 style="color: #856404; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                ⚠️ Action Required
              </h4>
              <p style="color: #856404; margin: 0; line-height: 1.6;">
                Please confirm or decline this booking request in your dashboard. The mentee will be notified once you confirm the session.
              </p>
            </div>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://mentorle.in/dashboard/bookings" 
                 style="display: inline-block; 
                        background-color: #000; 
                        color: white; 
                        text-decoration: none; 
                        font-weight: 600; 
                        font-size: 16px; 
                        padding: 14px 28px; 
                        border-radius: 4px; 
                        border: none;
                        cursor: pointer;">
                Review Booking
              </a>
            </div>
            
            <!-- Professional Closing -->
            <div style="margin: 32px 0 24px 0; padding-top: 24px; border-top: 1px solid #e9ecef;">
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0;">
                Best regards,<br>
                <strong>The Mentorle Team</strong>
              </p>
            </div>
            
            <!-- Support Information -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; margin-top: 24px;">
              <p style="color: #6c757d; font-size: 14px; margin: 0 0 8px 0; font-weight: 500;">Need Assistance?</p>
              <p style="margin: 0;">
                <a href="mailto:mentorleofficial@gmail.com" 
                   style="color: #000; 
                          text-decoration: none; 
                          font-weight: 600;
                          border-bottom: 1px solid #000;">
                  mentorleofficial@gmail.com
                </a>
              </p>
            </div>
            
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 16px 0; margin-top: 16px;">
          <p style="color: #6c757d; font-size: 12px; margin: 0;">
            © 2025 Mentorle. All rights reserved. This email was sent regarding your booking request.
          </p>
        </div>
      </div>
    `
  };
}

export function getBookingConfirmedEmailTemplate({ 
  menteeName, 
  mentorName, 
  offeringTitle, 
  scheduledAt, 
  durationMinutes, 
  meetingLink,
  meetingNotes,
  timezone = 'UTC'
}) {
  const formattedDate = new Date(scheduledAt).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: timezone
  });

  const timezoneName = timezone === "Asia/Kolkata" ? "IST" : 
                      timezone === "America/New_York" ? "EST/EDT" :
                      timezone === "Europe/London" ? "GMT/BST" :
                      timezone === "UTC" ? "UTC" : timezone;

  return {
    subject: `Booking Confirmed: ${offeringTitle} - Session Details`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header Section -->
          <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Session Confirmed!</h1>
            <p style="color: #cccccc; margin: 10px 0 0 0; font-size: 16px;">Your mentoring session is all set</p>
          </div>
          
          <!-- Content Section -->
          <div style="padding: 32px; background: white;">
            
            <!-- Professional Greeting -->
            <div style="margin-bottom: 24px;">
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0;">Dear ${menteeName},</p>
            </div>
            
            <div style="margin-bottom: 32px;">
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                Great news! Your mentor <strong>${mentorName}</strong> has confirmed your booking request. Your mentoring session is now confirmed and scheduled.
              </p>
            </div>
            
            <!-- Session Information -->
            <div style="background: #f8f9fa; border-left: 4px solid #000; padding: 24px; margin: 24px 0; border-radius: 4px;">
              <h3 style="color: #2c3e50; margin: 0 0 18px 0; font-size: 18px; font-weight: 600;">Session Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Session:</td>
                  <td style="padding: 8px 0; color: #2c3e50; font-weight: 500;">${offeringTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Mentor:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">${mentorName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Scheduled Time:</td>
                  <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">
                    ${formattedDate} (${timezoneName})
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Duration:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">${durationMinutes} minutes</td>
                </tr>
                ${meetingNotes ? `
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Your Notes:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">${meetingNotes}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Meeting Link:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">
                    <a href="${meetingLink}" style="color: #000; text-decoration: underline; font-weight: 500;">${meetingLink}</a>
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Important Instructions -->
            <div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 6px; padding: 20px; margin: 24px 0;">
              <h4 style="color: #0c5460; margin: 0 0 12px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                <span style="margin-right: 8px;">📅</span> Important Session Guidelines
              </h4>
              <ul style="color: #0c5460; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li style="margin-bottom: 8px;">The meeting link will be available in your dashboard <strong>15 minutes before</strong> the scheduled start time.</li>
                <li style="margin-bottom: 8px;">We recommend logging into your Mentorle dashboard at least <strong>5 minutes early</strong> to ensure smooth connection.</li>
                <li style="margin-bottom: 8px;">Please verify your internet connection and test your audio/video equipment beforehand.</li>
                <li style="margin-bottom: 8px;"><strong>Note:</strong> Session time is displayed in ${timezoneName}. Please check your dashboard for the correct time in your local timezone.</li>
                <li>For technical support during the session, please contact our support team immediately.</li>
              </ul>
            </div>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://mentorle.in/dashboard/mentee/bookings" 
                 style="display: inline-block; 
                        background-color: #000; 
                        color: white; 
                        text-decoration: none; 
                        font-weight: 600; 
                        font-size: 16px; 
                        padding: 14px 28px; 
                        border-radius: 4px; 
                        border: none;
                        cursor: pointer;">
                View Booking Details
              </a>
            </div>
            
            <!-- Professional Closing -->
            <div style="margin: 32px 0 24px 0; padding-top: 24px; border-top: 1px solid #e9ecef;">
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                We look forward to facilitating a productive mentoring experience. Should you have any questions or require assistance, please do not hesitate to contact our support team.
              </p>
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0;">
                Best regards,<br>
                <strong>The Mentorle Team</strong>
              </p>
            </div>
            
            <!-- Support Information -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; margin-top: 24px;">
              <p style="color: #6c757d; font-size: 14px; margin: 0 0 8px 0; font-weight: 500;">Need Assistance?</p>
              <p style="margin: 0;">
                <a href="mailto:mentorleofficial@gmail.com" 
                   style="color: #000; 
                          text-decoration: none; 
                          font-weight: 600;
                          border-bottom: 1px solid #000;">
                  mentorleofficial@gmail.com
                </a>
              </p>
            </div>
            
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 16px 0; margin-top: 16px;">
          <p style="color: #6c757d; font-size: 12px; margin: 0;">
            © 2025 Mentorle. All rights reserved. This email was sent regarding your confirmed mentoring session.
          </p>
        </div>
      </div>
    `
  };
}
