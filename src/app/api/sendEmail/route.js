import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const {
      bookingId,
      mentorId,
      menteeId,
      meetingRoomName,
      startTime,
      menteeName,
      menteeEmail,
      mentorEmail,
      mentorName,
      notes,
      timezone = "Asia/Kolkata" // Default timezone, can be passed from frontend
    } = await req.json();

    // Configure Nodemailer transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Format the date and time consistently for email display
    // Use the timezone parameter or default to IST
    const startDate = new Date(startTime).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: timezone
    });

    // Also create a UTC version for reference
    const startDateUTC = new Date(startTime).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric", 
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "UTC"
    });

    // Get timezone name for display
    const timezoneName = timezone === "Asia/Kolkata" ? "IST" : 
                        timezone === "America/New_York" ? "EST/EDT" :
                        timezone === "Europe/London" ? "GMT/BST" :
                        timezone === "UTC" ? "UTC" : timezone;

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header Section -->
          <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 40px 30px; text-align: center;">
            <img src="https://mentorle.in/logo.png" alt="Mentorle Logo" style="width: 180px; height: auto; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Session Confirmed</h1>
            <p style="color: #cccccc; margin: 10px 0 0 0; font-size: 16px;">Your mentoring session is all set!</p>
          </div>
          
          <!-- Content Section -->
          <div style="padding: 32px; background: white;">
            
            <!-- Professional Greeting -->
            <div style="margin-bottom: 24px;">
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0;">Dear ${menteeName},</p>
            </div>
            
            <div style="margin-bottom: 32px;">
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                We are pleased to confirm that your mentoring session has been successfully scheduled. Please find the session details below for your reference.
              </p>
            </div>
            
            <!-- Session Information -->
            <div style="background: #f8f9fa; border-left: 4px solid #000; padding: 24px; margin: 24px 0; border-radius: 4px;">
              <h3 style="color: #2c3e50; margin: 0 0 18px 0; font-size: 18px; font-weight: 600;">Session Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Booking Reference:</td>
                  <td style="padding: 8px 0; color: #2c3e50; font-weight: 500;">${bookingId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Mentor:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">${mentorName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Mentee:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">${menteeName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Scheduled Time:</td>
                  <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">
                    ${startDate} (${timezoneName})
                    <br>
                    <small style="color: #6c757d; font-size: 12px;">${startDateUTC} UTC</small>
                  </td>
                </tr>
                ${notes ? `
                <tr>
                  <td style="padding: 8px 0; color: #5a6c7d; font-weight: 500; width: 140px; vertical-align: top;">Session Notes:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">${notes}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <!-- Important Instructions -->
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px; margin: 24px 0;">
              <h4 style="color: #856404; margin: 0 0 12px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                <span style="margin-right: 8px;">⚠️</span> Important Session Guidelines
              </h4>
              <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li style="margin-bottom: 8px;">The session access button will become available in your dashboard <strong>30 minutes prior</strong> to the scheduled start time.</li>
                <li style="margin-bottom: 8px;">We recommend logging into your Mentorle dashboard at least <strong>5 minutes early</strong> to ensure smooth connection.</li>
                <li style="margin-bottom: 8px;">Please verify your internet connection and test your audio/video equipment beforehand.</li>
                <li style="margin-bottom: 8px;"><strong>Note:</strong> Session time is displayed in ${timezoneName}. Please check your dashboard for the correct time in your local timezone.</li>
                <li>For technical support during the session, please contact our support team immediately.</li>
              </ul>
            </div>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://mentorle.in/dashboard" 
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
                Access Dashboard
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
                <a href="mailto:support@mentorle.in" 
                   style="color: #000; 
                          text-decoration: none; 
                          font-weight: 600;
                          border-bottom: 1px solid #000;">
                  support@mentorle.in
                </a>
              </p>
            </div>
            
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 16px 0; margin-top: 16px;">
          <p style="color: #6c757d; font-size: 12px; margin: 0;">
            © 2025 Mentorle. All rights reserved. This email was sent regarding your mentoring session booking.
          </p>
        </div>
      </div>
    `;

    // Send emails to both mentee and mentor
    await Promise.all([
      transporter.sendMail({
        from: `"Mentorle" <${process.env.EMAIL_USER}>`,
        to: menteeEmail,
        subject: "Mentoring Session Confirmed - Join 30 Minutes Before",
        html: emailHtml,
      }),
      transporter.sendMail({
        from: `"Mentorle" <${process.env.EMAIL_USER}>`,
        to: mentorEmail,
        subject: "New Mentoring Session Booked - Join 30 Minutes Before",
        html: emailHtml,
      }),
    ]);

    return NextResponse.json(
      { message: "Confirmation emails sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
