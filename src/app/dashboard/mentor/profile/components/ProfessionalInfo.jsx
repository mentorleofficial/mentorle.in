"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Award, Building, Languages } from "lucide-react";
import ArrayInput from "./ArrayInput";

export default function ProfessionalInfo({ formData, onInputChange, onArrayChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Professional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="current_role" className="text-sm font-medium">
              Current Role *
            </Label>
            <Input
              id="current_role"
              value={formData.current_role || ""}
              onChange={(e) => onInputChange("current_role", e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="industry" className="text-sm font-medium">
              Industry *
            </Label>
            <Input
              id="industry"
              value={formData.industry || ""}
              onChange={(e) => onInputChange("industry", e.target.value)}
              placeholder="e.g., Technology, Finance, Healthcare"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="experience_years" className="text-sm font-medium">
            Years of Experience *
          </Label>
          <Input
            id="experience_years"
            type="number"
            min="0"
            max="50"
            value={formData.experience_years || ""}
            onChange={(e) => onInputChange("experience_years", e.target.value)}
            placeholder="Enter years of experience"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">
            Expertise Areas *
          </Label>
          <ArrayInput
            values={formData.expertise_area || []}
            onChange={(values) => onArrayChange("expertise_area", values)}
            placeholder="e.g., React, Node.js, Python, Machine Learning"
            label="Add expertise area"
          />
          <p className="text-xs text-gray-500 mt-1">
            Add your technical skills and areas of expertise.
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium">
            Languages Spoken
          </Label>
          <ArrayInput
            values={formData.languages_spoken || []}
            onChange={(values) => onArrayChange("languages_spoken", values)}
            placeholder="e.g., English, Hindi, Spanish"
            label="Add language"
          />
          <p className="text-xs text-gray-500 mt-1">
            Languages you can mentor in.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
