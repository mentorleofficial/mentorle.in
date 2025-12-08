"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, FileText } from "lucide-react";

export default function BasicInfo({ formData, onInputChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => onInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => onInputChange("email", e.target.value)}
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => onInputChange("phone", e.target.value)}
              placeholder="Enter your phone number"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) => onInputChange("location", e.target.value)}
              placeholder="Enter your location"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio" className="text-sm font-medium">
            Bio
          </Label>
          <Textarea
            id="bio"
            value={formData.bio || ""}
            onChange={(e) => onInputChange("bio", e.target.value)}
            placeholder="Tell us about yourself, your background, and what makes you a great mentor..."
            rows={4}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be visible to mentees looking for guidance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
