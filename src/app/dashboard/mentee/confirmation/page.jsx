// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { JitsiMeeting } from "@jitsi/react-sdk";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { supabase } from "@/lib/supabase";

// export default function ConfirmationPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [menteeName, setMenteeName] = useState("");
//   const [menteeEmail, setMenteeEmail] = useState("");
//   const [notes, setNotes] = useState("");
//   const [loading, setLoading] = useState(false);
//   // Extract query parameters
//   const slotId = searchParams.get("slotId");
//   const bookingId = searchParams.get("bookingId");
//   const mentorId = searchParams.get("mentorId");
//   const menteeId = searchParams.get("menteeId");
//   const meetingRoomName = searchParams.get("meetingRoomName");
//   const startTime = searchParams.get("startTime");
//   const endTime = searchParams.get("endTime");
//   const menteeEmailParam = searchParams.get("menteeEmail");
//   const menteeNameParam = searchParams.get("menteeName");
//   const mentorEmail = searchParams.get("mentorEmail");
//   const mentorName = searchParams.get("mentorName");

//   useEffect(() => {
//     if (menteeNameParam) setMenteeName(decodeURIComponent(menteeNameParam));
//     if (menteeEmailParam) setMenteeEmail(decodeURIComponent(menteeEmailParam));
//   }, [menteeNameParam, menteeEmailParam]);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);    try {
//       // Generate meeting link from Jitsi room name
//       const meetingLink = `https://meet.jit.si/${meetingRoomName}`;

//       // First create the booking in the database
//       const bookingData = {
//         mentor_id: mentorId,
//         mentee_id: menteeId,
//         start_time: decodeURIComponent(startTime),
//         end_time: decodeURIComponent(endTime),
//         status: "pending",
//         created_at: new Date().toISOString(),
//         meeting_room_name: meetingRoomName,
//         meeting_link: meetingLink,
//         notes: notes,
//       };

//       console.log("Creating booking with data:", bookingData);

//       // Insert booking
//       const { data: bookingResponse, error: bookingError } = await supabase
//         .from("bookings")
//         .insert([bookingData])
//         .select()
//         .single();

//       if (bookingError) {
//         console.error("Booking insertion error:", bookingError);
//         throw new Error(`Failed to create booking: ${bookingError.message}`);
//       }

//       console.log("Booking created successfully:", bookingResponse);

//       // Update slot status to booked
//       if (slotId) {
//         const { error: updateError } = await supabase
//           .from("mentor_availability")
//           .update({ status: "booked" })
//           .eq("id", slotId);

//         if (updateError) {
//           console.error("Error updating availability slot:", updateError);
//           throw new Error("Failed to update availability slot.");
//         }
//       }

//       // Hardcode admin email or fetch from Supabase settings table
//       const adminEmail = "admin@yourdomain.com";
//       /*
//       const { data: adminData, error: adminError } = await supabase
//         .from("settings")
//         .select("admin_email")
//         .single();
//       if (adminError || !adminData?.admin_email) {
//         throw new Error("Could not fetch admin email.");
//       }
//       const adminEmail = adminData.admin_email;
//       */

//       // Send email via API
//       const response = await fetch("/api/sendEmail", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           bookingId: bookingResponse.id,
//           mentorId,
//           menteeId,
//           meetingRoomName,
//           startTime: decodeURIComponent(startTime),
//           menteeName,
//           menteeEmail,
//           mentorEmail,
//           mentorName: decodeURIComponent(mentorName),
//           adminEmail,
//           notes,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.error || "Failed to send confirmation emails."
//         );
//       }

//       alert("Session booked and confirmation emails sent successfully!");
//       router.push("/dashboard/mentee/booking-success");
//     } catch (error) {
//       console.error("Error confirming booking:", error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 mt-10">
//       <h1 className="text-2xl font-bold mb-6">Confirm Your Booking</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label htmlFor="menteeName">Name</Label>
//           <Input
//             id="menteeName"
//             value={menteeName}
//             onChange={(e) => setMenteeName(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <Label htmlFor="menteeEmail">Email</Label>
//           <Input
//             id="menteeEmail"
//             type="email"
//             value={menteeEmail}
//             onChange={(e) => setMenteeEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <Label htmlFor="notes">Additional Notes (Optional)</Label>
//           <Textarea
//             id="notes"
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//           />
//         </div>
//         <Button type="submit" className="w-full" disabled={loading}>
//           {loading ? "Sending..." : "Confirm Booking"}
//         </Button>
//       </form>
//     </div>
//   );
// }

// update code

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

// 🧩 Wrap logic using useSearchParams inside this inner component
function ConfirmationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [menteeName, setMenteeName] = useState("");
  const [menteeEmail, setMenteeEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const slotId = searchParams.get("slotId");
  const bookingId = searchParams.get("bookingId");
  const mentorId = searchParams.get("mentorId");
  const menteeId = searchParams.get("menteeId");
  const meetingRoomName = searchParams.get("meetingRoomName");
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");
  const menteeEmailParam = searchParams.get("menteeEmail");
  const menteeNameParam = searchParams.get("menteeName");
  const mentorEmail = searchParams.get("mentorEmail");
  const mentorName = searchParams.get("mentorName");

  useEffect(() => {
    if (menteeNameParam) setMenteeName(decodeURIComponent(menteeNameParam));
    if (menteeEmailParam) setMenteeEmail(decodeURIComponent(menteeEmailParam));
  }, [menteeNameParam, menteeEmailParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const meetingLink = `https://meet.jit.si/${meetingRoomName}`;

      const bookingData = {
        mentor_id: mentorId,
        mentee_id: menteeId,
        start_time: decodeURIComponent(startTime),
        end_time: decodeURIComponent(endTime),
        status: "pending",
        created_at: new Date().toISOString(),
        meeting_room_name: meetingRoomName,
        meeting_link: meetingLink,
        notes,
      };

      const { data: bookingResponse, error: bookingError } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select()
        .single();

      if (bookingError) throw new Error(bookingError.message);

      if (slotId) {
        const { error: updateError } = await supabase
          .from("mentor_availability")
          .update({ status: "booked" })
          .eq("id", slotId);
        if (updateError) throw new Error(updateError.message);
      }

      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingResponse.id,
          mentorId,
          menteeId,
          meetingRoomName,
          startTime: decodeURIComponent(startTime),
          menteeName,
          menteeEmail,
          mentorEmail,
          mentorName: decodeURIComponent(mentorName),
          notes,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Detect user's timezone
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to send confirmation emails."
        );
      }

      alert("Session booked and confirmation emails sent!");
      router.push("/dashboard/mentee/booking-success");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="menteeName">Name</Label>
        <Input
          id="menteeName"
          value={menteeName}
          onChange={(e) => setMenteeName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="menteeEmail">Email</Label>
        <Input
          id="menteeEmail"
          type="email"
          value={menteeEmail}
          onChange={(e) => setMenteeEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Confirm Booking"}
      </Button>
    </form>
  );
}

// 🧩 Outer component to wrap inner component in Suspense
export default function ConfirmationPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <h1 className="text-2xl font-bold mb-6">Confirm Your Booking</h1>
      <Suspense fallback={<div>Loading form...</div>}>
        <ConfirmationForm />
      </Suspense>
    </div>
  );
}
