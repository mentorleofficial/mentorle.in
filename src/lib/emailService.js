/**
 * Email Service for Booking Notifications
 * Uses nodemailer with Gmail SMTP
 * Sender: mentorleofficial@gmail.com
 */

import nodemailer from "nodemailer";

// Initialize email transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "mentorleofficial@gmail.com",
      pass: process.env.EMAIL_PASS, // Should be set in environment variables
    },
  });
};

/**
 * Send email notification
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.html - Email HTML content
 * @returns {Promise<void>}
 */
export async function sendEmail({ to, subject, html }) {
  try {
    const transporter = getTransporter();
    
    await transporter.sendMail({
      from: `"Mentorle" <${process.env.EMAIL_USER || "mentorleofficial@gmail.com"}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
    throw error;
  }
}

/**
 * Get user email from Supabase auth.users table (admin access)
 * @param {Object} supabase - Supabase client instance with admin privileges
 * @param {string} userId - User ID
 * @returns {Promise<string|null>} - User email or null
 */
export async function getUserEmailFromAuth(supabase, userId) {
  try {
    // Try to get user from auth.users (requires admin access)
    if (supabase.auth && supabase.auth.admin) {
      const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
      
      if (!error && user?.email) {
        return user.email;
      }
    }
    return null;
  } catch (error) {
    // Admin API might not be available, that's okay
    return null;
  }
}

/**
 * Get mentor/mentee name and email
 * @param {Object} supabase - Supabase client instance
 * @param {string} userId - User ID
 * @param {string} role - 'mentor' or 'mentee'
 * @returns {Promise<{name: string, email: string}|null>}
 */
export async function getUserDetails(supabase, userId, role = 'mentor') {
  try {
    let name = null;
    let email = null;

    // First try to get email and name from mentor_data or mentee_data tables
    if (role === 'mentor') {
      const { data: mentorData } = await supabase
        .from('mentor_data')
        .select('name, email')
        .eq('user_id', userId)
        .single();
      
      if (mentorData) {
        name = mentorData.name;
        email = mentorData.email;
      }
    } else {
      const { data: menteeData } = await supabase
        .from('mentee_data')
        .select('name, email')
        .eq('user_id', userId)
        .single();
      
      if (menteeData) {
        name = menteeData.name;
        email = menteeData.email;
      }
    }

    // If email not found in data tables, try auth.users (admin API)
    if (!email) {
      email = await getUserEmailFromAuth(supabase, userId);
    }

    // If still no email, try to get name from user_roles table
    if (!name) {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('name')
        .eq('user_id', userId)
        .single();
      
      if (userRole?.name) {
        name = userRole.name;
      }
    }

    // Fallback: use email prefix as name if no name found
    if (!name && email) {
      name = email.split('@')[0];
    }

    if (!email) {
      console.warn(`No email found for user ${userId} (role: ${role})`);
      return null;
    }

    return { name: name || 'User', email };
  } catch (error) {
    console.error(`Error fetching user details for ${userId}:`, error);
    return null;
  }
}
