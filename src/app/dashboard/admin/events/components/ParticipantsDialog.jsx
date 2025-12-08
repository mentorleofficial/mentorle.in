import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Users, Mail, Calendar, CheckCircle, XCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ParticipantsDialog({ isOpen, onClose, event }) {
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && event) {
      fetchParticipants();
    }
  }, [isOpen, event]);

  const fetchParticipants = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch participants first
      const { data: participantsData, error: fetchError } = await supabase
        .from("event_participants")
        .select("id, registered_at, attendance_status, user_id, feedback, rating")
        .eq("event_id", event.id)
        .order("registered_at", { ascending: false });

      if (fetchError) throw fetchError;

      // Fetch user details from mentee_data for each participant
      const participantsWithDetails = await Promise.all(
        (participantsData || []).map(async (participant) => {
          const { data: menteeData } = await supabase
            .from("mentee_data")
            .select("name, email, phone, *")
            .eq("user_id", participant.user_id)
            .single();

          return {
            ...participant,
            mentee_data: menteeData
          };
        })
      );

      setParticipants(participantsWithDetails);
    } catch (err) {
      console.error("Error fetching participants:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      registered: { color: "bg-blue-100 text-blue-800", icon: CheckCircle, label: "REGISTERED" },
      attended: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "ATTENDED" },
      no_show: { color: "bg-red-100 text-red-800", icon: XCircle, label: "NO SHOW" }
    };

    const badge = badges[status] || badges.registered;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const downloadCSV = () => {
    if (participants.length === 0) return;

    // Prepare CSV content
    const headers = ["Name", "Email", "Phone", "Registration Date", "Status"];
    const rows = participants.map(p => [
      p.mentee_data?.name || "N/A",
      p.mentee_data?.email || "N/A",
      p.mentee_data?.phone || "N/A",
      formatDate(p.registered_at),
      p.attendance_status || "registered"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${event.title.replace(/[^a-z0-9]/gi, '_')}_participants.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6 text-blue-600" />
            Event Participants
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">{event?.title}</p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading participants: {error}</p>
            <Button onClick={fetchParticipants} variant="outline" className="mt-4">
              Retry
            </Button>
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No participants yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Participants will appear here once they register for this event.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">Total Registered</p>
                <p className="text-2xl font-bold text-blue-900">{participants.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium">Attended</p>
                <p className="text-2xl font-bold text-green-900">
                  {participants.filter(p => p.attendance_status === "attended").length}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-600 font-medium">No Show</p>
                <p className="text-2xl font-bold text-red-900">
                  {participants.filter(p => p.attendance_status === "no_show").length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {participants.filter(p => p.attendance_status === "registered").length}
                </p>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-end mb-4">
              <Button onClick={downloadCSV} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>

            {/* Participants List */}
            <div className="space-y-3">
              {participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {participant.mentee_data?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {participant.mentee_data?.name || "Unknown User"}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="h-3 w-3" />
                            {participant.mentee_data?.email || "No email"}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 ml-13">
                        {participant.mentee_data?.phone && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Phone:</span> {participant.mentee_data.phone}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">Registered:</span> {formatDate(participant.registered_at)}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      {getStatusBadge(participant.attendance_status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
