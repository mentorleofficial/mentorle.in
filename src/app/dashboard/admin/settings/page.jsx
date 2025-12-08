"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import RoleProtected from "@/components/RoleProtected";
import { ROLES } from "@/lib/roles";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

function SettingsContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "Mentorle",
    adminEmail: "admin@mentorle.com",
    autoApproveApplications: false,
    requireProfileCompletion: true,
  });
  
  const [emailSettings, setEmailSettings] = useState({
    sendWelcomeEmails: true,
    sendApplicationStatusEmails: true,
    sendSessionReminders: true,
    emailSignature: "The Mentorle Team",
    supportEmail: "support@mentorle.com"
  });
  
  const [aboutSettings, setAboutSettings] = useState({
    platformDescription: "Mentorle is a mentorship platform connecting experienced professionals with aspiring learners.",
    platformMission: "To provide accessible guidance and support to individuals seeking to advance their careers and skills."
  });
  
  const router = useRouter();
  const { toast } = useToast();

  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEmailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings({
      ...emailSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    setAboutSettings({
      ...aboutSettings,
      [name]: value,
    });
  };

  const handleSwitchChange = (name, section, checked) => {
    if (section === "general") {
      setGeneralSettings({
        ...generalSettings,
        [name]: checked,
      });
    } else if (section === "email") {
      setEmailSettings({
        ...emailSettings,
        [name]: checked,
      });
    }
  };

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real application, you would save these settings to your database
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Updated",
        description: "General settings have been saved successfully."
      });
    } catch (error) {
      
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate saving email settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Updated",
        description: "Email settings have been saved successfully."
      });
    } catch (error) {
      
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate saving about settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Updated",
        description: "About settings have been saved successfully."
      });
    } catch (error) {
      
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-gray-500 mt-1">Configure and customize your mentorship platform</p>
        </div>
        <Link href="/dashboard/admin">
          <Button variant="outline" className="mt-4 md:mt-0">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="general" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="about">About Platform</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic platform settings and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneralSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      name="platformName"
                      value={generalSettings.platformName}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      name="adminEmail"
                      value={generalSettings.adminEmail}
                      onChange={handleGeneralChange}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoApproveApplications" className="mb-1 block">
                        Auto-approve Mentor Applications
                      </Label>
                      <p className="text-sm text-gray-500">
                        Automatically approve all mentor applications without review
                      </p>
                    </div>
                    <Switch
                      id="autoApproveApplications"
                      checked={generalSettings.autoApproveApplications}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("autoApproveApplications", "general", checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireProfileCompletion" className="mb-1 block">
                        Require Profile Completion
                      </Label>
                      <p className="text-sm text-gray-500">
                        Require users to complete their profiles before accessing the platform
                      </p>
                    </div>
                    <Switch
                      id="requireProfileCompletion"
                      checked={generalSettings.requireProfileCompletion}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("requireProfileCompletion", "general", checked)
                      }
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email notifications and templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sendWelcomeEmails" className="mb-1 block">
                        Send Welcome Emails
                      </Label>
                      <p className="text-sm text-gray-500">
                        Send welcome emails to new users upon registration
                      </p>
                    </div>
                    <Switch
                      id="sendWelcomeEmails"
                      checked={emailSettings.sendWelcomeEmails}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("sendWelcomeEmails", "email", checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sendApplicationStatusEmails" className="mb-1 block">
                        Application Status Emails
                      </Label>
                      <p className="text-sm text-gray-500">
                        Send emails when mentor application status changes
                      </p>
                    </div>
                    <Switch
                      id="sendApplicationStatusEmails"
                      checked={emailSettings.sendApplicationStatusEmails}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("sendApplicationStatusEmails", "email", checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sendSessionReminders" className="mb-1 block">
                        Session Reminder Emails
                      </Label>
                      <p className="text-sm text-gray-500">
                        Send reminder emails before scheduled mentoring sessions
                      </p>
                    </div>
                    <Switch
                      id="sendSessionReminders"
                      checked={emailSettings.sendSessionReminders}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("sendSessionReminders", "email", checked)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      name="supportEmail"
                      value={emailSettings.supportEmail}
                      onChange={handleEmailChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emailSignature">Email Signature</Label>
                    <Textarea
                      id="emailSignature"
                      name="emailSignature"
                      value={emailSettings.emailSignature}
                      onChange={handleEmailChange}
                      rows={3}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Email Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* About Platform Tab */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Platform</CardTitle>
              <CardDescription>
                Configure platform description and mission statement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAboutSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="platformDescription">Platform Description</Label>
                    <Textarea
                      id="platformDescription"
                      name="platformDescription"
                      value={aboutSettings.platformDescription}
                      onChange={handleAboutChange}
                      rows={4}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This description appears on the landing page and public profile
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="platformMission">Mission Statement</Label>
                    <Textarea
                      id="platformMission"
                      name="platformMission"
                      value={aboutSettings.platformMission}
                      onChange={handleAboutChange}
                      rows={4}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Your platform's mission, visible on the About page
                    </p>
                  </div>
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save About Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main exported component with role protection
export default function Settings() {
  return (
    <RoleProtected requiredRole={ROLES.ADMIN}>
      <SettingsContent />
    </RoleProtected>
  );
}
