"use client";

import { useEffect, useMemo, useState } from "react";
import RoleProtected from "@/components/RoleProtected";
import { ROLES } from "@/lib/roles";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  Users,
  Star,
  IndianRupee,
  Download,
  Calendar,
  Building2,
} from "lucide-react";

function AdminAnalyticsContent() {
  const { toast } = useToast();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [mentorFilter, setMentorFilter] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("");
  const [programType, setProgramType] = useState("all"); // all, sessions, events
  const [isLoading, setIsLoading] = useState(true);

  const [bookings, setBookings] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [mentorsById, setMentorsById] = useState({});
  const [institutionsById, setInstitutionsById] = useState({});
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo]);

  const getDateRange = () => {
    const now = new Date();
    let from = dateFrom ? new Date(dateFrom) : null;
    let to = dateTo ? new Date(dateTo) : null;

    if (!from) {
      from = new Date(now);
      from.setDate(from.getDate() - 30); // default last 30 days
    }
    if (!to) {
      to = now;
    } else {
      to.setHours(23, 59, 59, 999);
    }

    return {
      fromIso: from.toISOString(),
      toIso: to.toISOString(),
    };
  };

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const { fromIso, toIso } = getDateRange();

      // 1) Fetch bookings (sessions)
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("mentorship_bookings")
        .select("*")
        .gte("scheduled_at", fromIso)
        .lte("scheduled_at", toIso);

      if (bookingsError) throw bookingsError;

      // 2) Fetch registrations (events/courses/hackathons)
      const { data: registrationsData, error: registrationsError } =
        await supabase
          .from("event_participants")
          .select("id, event_id, user_id, registered_at, attendance_status")
          .gte("registered_at", fromIso)
          .lte("registered_at", toIso);

      if (registrationsError) throw registrationsError;

      const eventIds = Array.from(
        new Set((registrationsData || []).map((r) => r.event_id))
      );

      let eventsById = {};
      if (eventIds.length > 0) {
        const { data: eventsData, error: eventsError } = await supabase
          .from("events_programs")
          .select("id, title, event_type, institution_id, start_date")
          .in("id", eventIds);

        if (eventsError) throw eventsError;
        eventsById = (eventsData || []).reduce((acc, ev) => {
          acc[ev.id] = ev;
          return acc;
        }, {});
      }

      // 3) Fetch feedback for bookings
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback")
        .select("rating, feedback_type, reference_id, created_at")
        .eq("feedback_type", "booking")
        .gte("created_at", fromIso)
        .lte("created_at", toIso);

      if (feedbackError) throw feedbackError;

      // 4) Fetch mentor & institution data for enrichment
      const mentorIds = Array.from(
        new Set((bookingsData || []).map((b) => b.mentor_id))
      );

      let mentorsMap = {};
      if (mentorIds.length > 0) {
        const { data: mentorsData, error: mentorsError } = await supabase
          .from("mentor_data")
          .select("user_id, name, institution_id")
          .in("user_id", mentorIds);

        if (mentorsError) throw mentorsError;
        mentorsMap = (mentorsData || []).reduce((acc, m) => {
          acc[m.user_id] = m;
          return acc;
        }, {});
      }

      const institutionIds = new Set();
      Object.values(mentorsMap).forEach((m) => {
        if (m.institution_id) institutionIds.add(m.institution_id);
      });
      Object.values(eventsById).forEach((ev) => {
        if (ev.institution_id) institutionIds.add(ev.institution_id);
      });

      let institutionsMap = {};
      if (institutionIds.size > 0) {
        const { data: instData, error: instError } = await supabase
          .from("institutions")
          .select("id, name")
          .in("id", Array.from(institutionIds));

        if (instError) throw instError;
        institutionsMap = (instData || []).reduce((acc, inst) => {
          acc[inst.id] = inst;
          return acc;
        }, {});
      }

      // 5) Fetch payouts
      const { data: payoutsData, error: payoutsError } = await supabase
        .from("mentor_payouts")
        .select("*")
        .gte("created_at", fromIso)
        .lte("created_at", toIso);

      if (payoutsError) throw payoutsError;

      setBookings(bookingsData || []);
      setRegistrations(
        (registrationsData || []).map((r) => ({
          ...r,
          event: eventsById[r.event_id] || null,
        }))
      );
      setFeedback(feedbackData || []);
      setMentorsById(mentorsMap);
      setInstitutionsById(institutionsMap);
      setPayouts(payoutsData || []);
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics and earnings data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered views by mentor/institution/program type
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const mentor = mentorsById[b.mentor_id];
      const mentorName = mentor?.name || "";
      const institutionName = mentor?.institution_id
        ? institutionsById[mentor.institution_id]?.name || ""
        : "";

      if (
        mentorFilter &&
        !mentorName.toLowerCase().includes(mentorFilter.toLowerCase())
      ) {
        return false;
      }
      if (
        institutionFilter &&
        !institutionName
          .toLowerCase()
          .includes(institutionFilter.toLowerCase())
      ) {
        return false;
      }
      if (programType === "events") {
        return false; // sessions only
      }
      return true;
    });
  }, [bookings, mentorsById, institutionsById, mentorFilter, institutionFilter, programType]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      const ev = r.event;
      if (!ev) return false;

      const institutionName = ev.institution_id
        ? institutionsById[ev.institution_id]?.name || ""
        : "";

      if (institutionFilter && !institutionName.toLowerCase().includes(institutionFilter.toLowerCase())) {
        return false;
      }

      if (programType === "sessions") {
        return false; // events only
      }

      return true;
    });
  }, [registrations, institutionsById, institutionFilter, programType]);

  // Summary metrics
  const activeMentorIds = new Set(filteredBookings.map((b) => b.mentor_id));
  const activeMenteeIds = new Set(filteredBookings.map((b) => b.mentee_id));

  const bookingsCount = filteredBookings.length;
  const registrationsCount = filteredRegistrations.length;

  const ratingStats = useMemo(() => {
    if (!feedback.length) return { avgRating: 0, count: 0 };
    const ratings = feedback.map((f) => f.rating).filter(Boolean);
    if (!ratings.length) return { avgRating: 0, count: 0 };
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    return {
      avgRating: sum / ratings.length,
      count: ratings.length,
    };
  }, [feedback]);

  const revenueStats = useMemo(() => {
    const paidBookings = filteredBookings.filter(
      (b) => b.payment_status === "paid"
    );
    if (!paidBookings.length) {
      return {
        totalRevenue: 0,
        platformCommission: 0,
        mentorEarnings: 0,
      };
    }
    const totalRevenue = paidBookings.reduce(
      (acc, b) => acc + Number(b.amount || 0),
      0
    );
    const platformRate = 0.2; // 20% platform commission
    const platformCommission = totalRevenue * platformRate;
    const mentorEarnings = totalRevenue - platformCommission;
    return { totalRevenue, platformCommission, mentorEarnings };
  }, [filteredBookings]);

  // Payout summary per mentor
  const payoutSummary = useMemo(() => {
    const map = {};

    // Revenue per mentor
    filteredBookings
      .filter((b) => b.payment_status === "paid")
      .forEach((b) => {
        const key = b.mentor_id;
        if (!map[key]) {
          map[key] = {
            mentor: mentorsById[key] || { name: "Mentor" },
            revenue: 0,
            payouts: 0,
          };
        }
        map[key].revenue += Number(b.amount || 0);
      });

    // Payouts per mentor
    payouts.forEach((p) => {
      const key = p.mentor_id;
      if (!map[key]) {
        map[key] = {
          mentor: mentorsById[key] || { name: "Mentor" },
          revenue: 0,
          payouts: 0,
        };
      }
      if (p.status === "completed" || p.status === "approved") {
        map[key].payouts += Number(p.amount || 0);
      }
    });

    return Object.entries(map).map(([mentorId, data]) => ({
      mentorId,
      mentorName: data.mentor.name || "Mentor",
      revenue: data.revenue,
      payouts: data.payouts,
      balance: data.revenue - data.payouts,
    }));
  }, [filteredBookings, payouts, mentorsById]);

  // CSV exports
  const downloadCsv = (filename, headers, rows) => {
    if (!rows.length) {
      toast({
        title: "No data",
        description: "There is no data to export for this selection.",
      });
      return;
    }
    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSessions = () => {
    const rows = filteredBookings.map((b) => {
      const mentor = mentorsById[b.mentor_id];
      const mentorName = mentor?.name || "";
      const instName = mentor?.institution_id
        ? institutionsById[mentor.institution_id]?.name || ""
        : "";
      return [
        b.id,
        mentorName,
        instName,
        b.mentee_id,
        b.status,
        b.payment_status,
        b.amount,
        b.currency,
        b.scheduled_at,
      ];
    });
    downloadCsv(
      "sessions.csv",
      [
        "Booking ID",
        "Mentor",
        "Institution",
        "Mentee ID",
        "Status",
        "Payment Status",
        "Amount",
        "Currency",
        "Scheduled At",
      ],
      rows
    );
  };

  const exportRegistrations = () => {
    const rows = filteredRegistrations.map((r) => {
      const ev = r.event;
      const instName = ev?.institution_id
        ? institutionsById[ev.institution_id]?.name || ""
        : "";
      return [
        r.id,
        ev?.title || "",
        ev?.event_type || "",
        instName,
        r.user_id,
        r.registered_at,
        r.attendance_status,
      ];
    });
    downloadCsv(
      "registrations.csv",
      [
        "Registration ID",
        "Event Title",
        "Event Type",
        "Institution",
        "User ID",
        "Registered At",
        "Attendance Status",
      ],
      rows
    );
  };

  const exportEarnings = () => {
    const rows = payoutSummary.map((p) => [
      p.mentorId,
      p.mentorName,
      p.revenue,
      p.payouts,
      p.balance,
    ]);
    downloadCsv(
      "earnings.csv",
      ["Mentor ID", "Mentor Name", "Total Revenue", "Total Payouts", "Balance"],
      rows
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-gray-800" />
              Analytics & Earnings
            </h1>
            <p className="text-gray-600 mt-1">
              Get an overview of platform activity, quality, and revenue.
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="mentor">Mentor (name contains)</Label>
                <Input
                  id="mentor"
                  value={mentorFilter}
                  onChange={(e) => setMentorFilter(e.target.value)}
                  placeholder="Search by mentor name"
                />
              </div>
              <div>
                <Label htmlFor="institution">Institution (name contains)</Label>
                <Input
                  id="institution"
                  value={institutionFilter}
                  onChange={(e) => setInstitutionFilter(e.target.value)}
                  placeholder="Search by institution"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 items-center">
              <div>
                <Label htmlFor="programType">Program Type</Label>
                <select
                  id="programType"
                  value={programType}
                  onChange={(e) => setProgramType(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option value="all">All</option>
                  <option value="sessions">Mentorship Sessions Only</option>
                  <option value="events">Events/Courses Only</option>
                </select>
              </div>
              <div className="ml-auto flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                    setMentorFilter("");
                    setInstitutionFilter("");
                    setProgramType("all");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
            <p className="mt-4 text-gray-500">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Active Mentors
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activeMentorIds.size}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Active Mentees
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activeMenteeIds.size}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Bookings</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {bookingsCount}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      Event Registrations
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {registrationsCount}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quality & Revenue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Quality Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {ratingStats.avgRating
                        ? ratingStats.avgRating.toFixed(2)
                        : "0.00"}
                    </span>
                    <span className="text-sm text-gray-500">/ 5.0</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on{" "}
                    <span className="font-semibold">
                      {ratingStats.count}
                    </span>{" "}
                    booking feedback entries.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Revenue Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 uppercase">
                        Total Revenue
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        ₹{revenueStats.totalRevenue.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase">
                        Platform Commission
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        ₹{revenueStats.platformCommission.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase">
                        Mentor Earnings (Gross)
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        ₹{revenueStats.mentorEarnings.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exports */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Datasets
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={exportSessions}>
                  Sessions CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportRegistrations}
                >
                  Registrations CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportEarnings}>
                  Earnings CSV
                </Button>
              </CardContent>
            </Card>

            {/* Payout Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Payout Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payoutSummary.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No payout or revenue data for the selected range.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="px-3 py-2 text-left font-medium">
                            Mentor
                          </th>
                          <th className="px-3 py-2 text-right font-medium">
                            Total Revenue
                          </th>
                          <th className="px-3 py-2 text-right font-medium">
                            Total Payouts
                          </th>
                          <th className="px-3 py-2 text-right font-medium">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {payoutSummary.map((row) => (
                          <tr key={row.mentorId} className="border-t">
                            <td className="px-3 py-2">
                              <div className="font-medium text-gray-900">
                                {row.mentorName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {row.mentorId}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right">
                              ₹{row.revenue.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 text-right">
                              ₹{row.payouts.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 text-right font-semibold">
                              ₹{row.balance.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <RoleProtected requiredRole={ROLES.ADMIN}>
      <AdminAnalyticsContent />
    </RoleProtected>
  );
}


