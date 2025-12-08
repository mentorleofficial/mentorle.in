"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Youtube, Github, ExternalLink } from "lucide-react";

export default function SocialLinks({ formData, onInputChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Social Links & Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="linkedin_url" className="text-sm font-medium">
            LinkedIn Profile
          </Label>
          <div className="relative mt-1">
            <Input
              id="linkedin_url"
              value={formData.linkedin_url || ""}
              onChange={(e) => onInputChange("linkedin_url", e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="pl-10"
            />
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your professional LinkedIn profile
          </p>
        </div>

        <div>
          <Label htmlFor="github_url" className="text-sm font-medium">
            GitHub Profile
          </Label>
          <div className="relative mt-1">
            <Input
              id="github_url"
              value={formData.github_url || ""}
              onChange={(e) => onInputChange("github_url", e.target.value)}
              placeholder="https://github.com/yourusername"
              className="pl-10"
            />
            <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your GitHub profile to showcase your code
          </p>
        </div>

        <div>
          <Label htmlFor="youtube" className="text-sm font-medium">
            YouTube Channel
          </Label>
          <div className="relative mt-1">
            <Input
              id="youtube"
              value={formData.youtube || ""}
              onChange={(e) => onInputChange("youtube", e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
              className="pl-10"
            />
            <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your YouTube channel for tutorials or content
          </p>
        </div>

        <div>
          <Label htmlFor="portfolio_url" className="text-sm font-medium">
            Portfolio Website
          </Label>
          <div className="relative mt-1">
            <Input
              id="portfolio_url"
              value={formData.portfolio_url || ""}
              onChange={(e) => onInputChange("portfolio_url", e.target.value)}
              placeholder="https://yourportfolio.com"
              className="pl-10"
            />
            <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your personal portfolio or website
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
