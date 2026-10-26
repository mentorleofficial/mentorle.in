// Header notification bell (signed-in mentees). Rows come from the platform's `notifications` table, written by
// database triggers (bookings, cancellations, reschedules…), so the wording of each message is the platform's.
// No Figma (logged in SPEC-VS-DESIGN, NB rows).

export const notificationsCopy = {
  label: "Notifications",
  unread: (n: number) => (n === 1 ? "1 unread notification" : `${n} unread notifications`),
  markAll: "Mark all as read",
  remove: "Remove notification",
  empty: "You’re all caught up.",
  error: "Couldn’t load notifications.",
  viewSessions: "View my sessions",
  justNow: "Just now",
  loading: "Loading…",
  unreadDot: "Unread",
};

// Session notifications open "My sessions", plan ones the plan card (or pricing, once it has ended); anything else
// just marks itself read.
export const notificationLinks: Record<string, string> = {
  membership_activated: "/account#plan",
  membership_ending: "/account#plan",
  membership_ended: "/pricing",
  session_booked: "/sessions",
  session_cancelled_by_mentor: "/sessions",
  session_cancelled_by_mentee: "/sessions",
  session_rescheduled: "/sessions",
  session_completed: "/sessions",
  session_updated: "/sessions",
  action_item_assigned: "/sessions#action-items",
};
