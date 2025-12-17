"use client";

import { useEffect, useState } from "react";
import RoleProtected from "@/components/RoleProtected";
import { ROLES } from "@/lib/roles";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Plus,
  Users,
  CalendarDays,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function InstitutionsContent() {
  const { toast } = useToast();
  const [institutions, setInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    logo_url: "",
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [statsByInstitution, setStatsByInstitution] = useState({});

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("institutions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const instList = data || [];
      setInstitutions(instList);

      // Load basic institution-level stats
      const [
        { data: mentees } ,
        { data: mentors } ,
        { data: bookings } ,
        { data: participants } ,
        { data: events },
      ] = await Promise.all([
        supabase
          .from("mentee_data")
          .select("user_id, institution_id"),
        supabase
          .from("mentor_data")
          .select("user_id, institution_id"),
        supabase
          .from("mentorship_bookings")
          .select("mentor_id, mentee_id"),
        supabase
          .from("event_participants")
          .select("event_id"),
        supabase
          .from("events_programs")
          .select("id, institution_id"),
      ]);

      const stats = {};
      const menteeInst = {};
      const mentorInst = {};
      const eventInst = {};

      (mentees || []).forEach((m) => {
        if (m.institution_id) {
          menteeInst[m.user_id] = m.institution_id;
        }
      });

      (mentors || []).forEach((m) => {
        if (m.institution_id) {
          mentorInst[m.user_id] = m.institution_id;
        }
      });

      (events || []).forEach((ev) => {
        if (ev.institution_id) {
          eventInst[ev.id] = ev.institution_id;
        }
      });

      // Initialize stats for each institution
      instList.forEach((inst) => {
        stats[inst.id] = {
          mentees: 0,
          mentors: 0,
          sessions: 0,
          registrations: 0,
        };
      });

      // Count mentees and mentors per institution
      Object.values(menteeInst).forEach((instId) => {
        if (stats[instId]) stats[instId].mentees += 1;
      });
      Object.values(mentorInst).forEach((instId) => {
        if (stats[instId]) stats[instId].mentors += 1;
      });

      // Sessions (bookings) per institution (via mentor institution, fall back to mentee institution)
      (bookings || []).forEach((b) => {
        const instId =
          mentorInst[b.mentor_id] || menteeInst[b.mentee_id] || null;
        if (instId && stats[instId]) {
          stats[instId].sessions += 1;
        }
      });

      // Event registrations per institution (via event institution)
      (participants || []).forEach((p) => {
        const instId = eventInst[p.event_id];
        if (instId && stats[instId]) {
          stats[instId].registrations += 1;
        }
      });

      setStatsByInstitution(stats);
    } catch (error) {
      console.error("Error fetching institutions:", error);
      toast({
        title: "Error",
        description: "Failed to load institutions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({
      name: "",
      domain: "",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      logo_url: "",
    });
    setIsDialogOpen(true);
  };

  const openEdit = (institution) => {
    setEditing(institution);
    setFormData({
      name: institution.name || "",
      domain: institution.domain || "",
      contact_name: institution.contact_name || "",
      contact_email: institution.contact_email || "",
      contact_phone: institution.contact_phone || "",
      logo_url: institution.logo_url || "",
    });
    setIsDialogOpen(true);
  };

  const openDelete = (institution) => {
    setDeleteTarget(institution);
    setIsDeleteOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name.trim(),
        domain: formData.domain.trim() || null,
        contact_name: formData.contact_name.trim() || null,
        contact_email: formData.contact_email.trim() || null,
        contact_phone: formData.contact_phone.trim() || null,
        logo_url: formData.logo_url.trim() || null,
      };

      let error;
      let data;

      if (editing) {
        const result = await supabase
          .from("institutions")
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editing.id)
          .select()
          .single();
        error = result.error;
        data = result.data;
      } else {
        const result = await supabase
          .from("institutions")
          .insert(payload)
          .select()
          .single();
        error = result.error;
        data = result.data;
      }

      if (error) throw error;

      if (editing) {
        setInstitutions((prev) =>
          prev.map((inst) => (inst.id === editing.id ? data : inst))
        );
        toast({ title: "Updated", description: "Institution updated." });
      } else {
        setInstitutions((prev) => [data, ...prev]);
        toast({ title: "Created", description: "Institution created." });
      }

      setIsDialogOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Error saving institution:", error);
      toast({
        title: "Error",
        description: "Failed to save institution.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase
        .from("institutions")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      setInstitutions((prev) =>
        prev.filter((inst) => inst.id !== deleteTarget.id)
      );

      toast({
        title: "Deleted",
        description: "Institution removed.",
      });
    } catch (error) {
      console.error("Error deleting institution:", error);
      toast({
        title: "Error",
        description: "Failed to delete institution.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-7 h-7 text-gray-800" />
              Institutions
            </h1>
            <p className="text-gray-600 mt-1">
              Manage partner institutions and their key contacts.
            </p>
          </div>
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Institution
          </Button>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
            <p className="mt-4 text-gray-500">Loading institutions...</p>
          </div>
        ) : institutions.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-gray-600 mb-3">
              No institutions added yet.
            </p>
            <Button variant="outline" onClick={openCreate}>
              Create first institution
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((inst) => (
              <Card
                key={inst.id}
                className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {inst.logo_url ? (
                      <img
                        src={inst.logo_url}
                        alt={inst.name}
                        className="w-10 h-10 rounded-md object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gray-900 text-white flex items-center justify-center font-bold">
                        {inst.name?.charAt(0).toUpperCase() || "I"}
                      </div>
                    )}
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {inst.name}
                      </h2>
                      {inst.domain && (
                        <p className="text-xs text-gray-500">
                          Domain: {inst.domain}
                        </p>
                      )}
                    </div>
                  </div>
                  {inst.contact_name && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Contact:</span>{" "}
                      {inst.contact_name}
                    </p>
                  )}
                  {inst.contact_email && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Email:</span>{" "}
                      {inst.contact_email}
                    </p>
                  )}
                  {inst.contact_phone && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Phone:</span>{" "}
                      {inst.contact_phone}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    Created on{" "}
                    {inst.created_at
                      ? new Date(inst.created_at).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex flex-col text-xs text-gray-600 gap-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>
                        {statsByInstitution[inst.id]?.mentees || 0} mentees •{" "}
                        {statsByInstitution[inst.id]?.mentors || 0} mentors
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      <span>
                        {statsByInstitution[inst.id]?.sessions || 0} sessions •{" "}
                        {statsByInstitution[inst.id]?.registrations || 0} event
                        registrations
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(inst)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => openDelete(inst)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Institution" : "Add Institution"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="domain">Email Domain (optional)</Label>
                <Input
                  id="domain"
                  name="domain"
                  placeholder="example.edu"
                  value={formData.domain}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_name">Contact Name</Label>
                  <Input
                    id="contact_name"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="logo_url">Logo URL (optional)</Label>
                <Input
                  id="logo_url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editing ? "Save Changes" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Institution</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {deleteTarget?.name || "this institution"}
              </span>
              ? Links from mentors, mentees, or events will be cleared but those
              records will remain.
            </p>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function InstitutionsPage() {
  return (
    <RoleProtected requiredRole={ROLES.ADMIN}>
      <InstitutionsContent />
    </RoleProtected>
  );
}


