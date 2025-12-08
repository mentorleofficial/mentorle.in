import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Calendar, MapPin, School, Tag, BookOpen } from "lucide-react";
import { getISTDateString, getISTTimeString, extractISTTime } from "../utils/timezone";

export default function EventForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null,
  isSubmitting 
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "workshop",
    college_name: "",
    location: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    registration_deadline: "",
    prerequisites: "",
    learning_outcomes: "",
    banner_image_url: "",
    meeting_link: "",
    status: "upcoming"
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        event_type: initialData.event_type || "workshop",
        college_name: initialData.college_name || "",
        location: initialData.location || "",
        start_date: initialData.start_date ? getISTDateString(initialData.start_date) : "",
        start_time: initialData.start_date ? extractISTTime(initialData.start_date) : "",
        end_date: initialData.end_date ? getISTDateString(initialData.end_date) : "",
        end_time: initialData.end_date ? extractISTTime(initialData.end_date) : "",
        registration_deadline: initialData.registration_deadline ? getISTDateString(initialData.registration_deadline) : "",
        prerequisites: initialData.prerequisites || "",
        learning_outcomes: initialData.learning_outcomes || "",
        banner_image_url: initialData.banner_image_url || "",
        meeting_link: initialData.meeting_link || "",
        status: initialData.status || "upcoming"
      });
      setImagePreview(initialData.banner_image_url || null);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_type: "workshop",
      college_name: "",
      location: "",
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      registration_deadline: "",
      prerequisites: "",
      learning_outcomes: "",
      banner_image_url: "",
      meeting_link: "",
      status: "upcoming"
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, imageFile);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {initialData ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="required">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="required">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_type" className="required">Event Type</Label>
                  <select
                    id="event_type"
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="workshop">Workshop</option>
                    <option value="bootcamp">Bootcamp</option>
                    <option value="guest_session">Guest Session</option>
                    <option value="event">Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="status" className="required">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location & College */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <School className="h-5 w-5" />
              Location & College
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="college_name" className="required">College Name</Label>
                <Input
                  id="college_name"
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleInputChange}
                  placeholder="Enter college name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              </div>
            </div>
          </div>

          {/* Date & Time (IST) */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date & Time (Indian Standard Time)
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date" className="required">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="start_time" className="required">Start Time (IST)</Label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="end_date" className="required">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_time" className="required">End Time (IST)</Label>
                  <Input
                    id="end_time"
                    name="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="registration_deadline">Registration Deadline</Label>
                <Input
                  id="registration_deadline"
                  name="registration_deadline"
                  type="date"
                  value={formData.registration_deadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Academic Content */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Academic Content
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Textarea
                  id="prerequisites"
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleInputChange}
                  placeholder="Enter prerequisites"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="learning_outcomes">Learning Outcomes</Label>
                <Textarea
                  id="learning_outcomes"
                  name="learning_outcomes"
                  value={formData.learning_outcomes}
                  onChange={handleInputChange}
                  placeholder="Enter learning outcomes"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div className="bg-pink-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Banner Image
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="banner_image">Upload Banner</Label>
                <Input
                  id="banner_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="cursor-pointer"
                />
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <img
                    src={imagePreview}
                    alt="Banner preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Meeting Link */}
          <div className="bg-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Online Meeting
            </h3>
            
            <div>
              <Label htmlFor="meeting_link">Meeting Link</Label>
              <Input
                id="meeting_link"
                name="meeting_link"
                type="url"
                value={formData.meeting_link}
                onChange={handleInputChange}
                placeholder="https://zoom.us/j/..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
