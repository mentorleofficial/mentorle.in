import { supabase } from './supabase';

/**
 * Send password reset email to user
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendPasswordResetEmail(email) {
  try {
    if (!email) {
      return { success: false, error: 'Email is required' };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
      // Note: Email deliverability (avoiding spam) is primarily controlled by Supabase configuration:
      // - SPF/DKIM records in Supabase Dashboard > Authentication > Email Templates
      // - Custom SMTP configuration (if using custom email provider)
      // - Sender reputation and domain authentication
    });

    if (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'Failed to send password reset email' };
  }
}

/**
 * Update user password
 * @param {string} password - New password
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateUserPassword(password) {
  try {
    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('Password update error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Password update error:', error);
    return { success: false, error: 'Failed to update password' };
  }
}

/**
 * Check if user has valid session for password reset
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function checkPasswordResetSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: 'Invalid or expired reset link' };
    }

    return { success: true };
  } catch (error) {
    console.error('Session check error:', error);
    return { success: false, error: 'Failed to check session' };
  }
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
export function validatePassword(password) {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    if (!/[A-Za-z]/.test(password)) {
      errors.push('Password must contain at least one letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
