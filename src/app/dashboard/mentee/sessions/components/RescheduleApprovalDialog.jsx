"use client";

import { useState } from "react";
import { X, Calendar, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function RescheduleApprovalDialog({ 
  isOpen, 
  onClose, 
  onApprove, 
  onDecline,
  isLoading,
  session,
  mentorName = "Mentor" 
}) {
  const [declineReason, setDeclineReason] = useState("");
  const [action, setAction] = useState(null); // 'approve' or 'decline'

  const handleApprove = () => {
    setAction('approve');
    onApprove();
    resetForm();
  };

  const handleDecline = () => {
    setAction('decline');
    onDecline(declineReason);
    resetForm();
  };

  const resetForm = () => {
    setDeclineReason("");
    setAction(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const predefinedDeclineReasons = [
    "Preferred the original time",
    "New time doesn't work for me",
    "Already have other commitments",
    "Too short notice",
    "Would like to reschedule differently"
  ];

  // Format session details for display
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    
    const dateTime = new Date(dateTimeStr);
    
    const dateStr = dateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const timeStr = dateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return `${dateStr} at ${timeStr}`;
  };

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return "";
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                Reschedule Request
              </h3>
              <p className="text-sm text-gray-500">
                {mentorName} has requested to reschedule your session
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Reschedule Reason */}
          {session.reschedule_reason && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Reason for Reschedule
              </h4>
              <p className="text-sm text-orange-800">{session.reschedule_reason}</p>
            </div>
          )}

          {/* Time Comparison */}
          <div className="space-y-4">
            {/* Original Time */}
            {session.original_start_time && session.original_end_time && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  Original Time
                </h4>
                <p className="text-sm text-gray-600">
                  {formatDateTime(session.original_start_time)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Duration: {formatTimeRange(session.original_start_time, session.original_end_time)}
                </p>
              </div>
            )}

            {/* New Time */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                Proposed New Time
              </h4>
              <p className="text-sm text-green-800">
                {formatDateTime(session.start_time)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Duration: {formatTimeRange(session.start_time, session.end_time)}
              </p>
            </div>
          </div>

          {/* Decline Reason Section (only show when declining) */}
          {action === 'decline' && (
            <div className="space-y-4">
              {/* Quick Decline Reasons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick reasons (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {predefinedDeclineReasons.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setDeclineReason(reason)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${
                        declineReason === reason
                          ? "bg-red-50 border-red-200 text-red-700"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Decline Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for declining (optional)
                </label>
                <Textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Let the mentor know why this time doesn't work..."
                  className="w-full h-20 resize-none border-gray-200 focus:border-red-300 focus:ring-red-200"
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {declineReason.length}/300 characters
                </p>
              </div>
            </div>
          )}

          {/* Action Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Please review the new time</p>
                <p className="text-blue-600 mt-1">
                  {action === 'approve' 
                    ? "Approving will confirm the new session time."
                    : action === 'decline'
                    ? "Declining will notify the mentor and may require further discussion."
                    : "You can approve the new time or decline with your preferred alternative."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-100">
          {action === 'decline' ? (
            // Decline confirmation buttons
            <>
              <Button
                variant="outline"
                onClick={() => setAction(null)}
                disabled={isLoading}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleDecline}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Declining...
                  </>
                ) : (
                  "Confirm Decline"
                )}
              </Button>
            </>
          ) : (
            // Initial action buttons
            <>
              <Button
                variant="outline"
                onClick={() => setAction('decline')}
                disabled={isLoading}
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
