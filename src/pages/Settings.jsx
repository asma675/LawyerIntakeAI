import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  Upload, 
  Link2, 
  Bell, 
  Save,
  Loader2,
  Copy,
  Check,
  Plus,
  X,
  ExternalLink,
  Users,
  Tag,
  Clock,
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner';

const PRACTICE_AREAS = [
  "Family Law",
  "Employment Law",
  "Real Estate",
  "Personal Injury",
  "Criminal Defence",
  "Immigration",
  "Corporate/Commercial",
  "Wills & Estates",
  "Civil Litigation",
  "Other"
];

export default function Settings() {
  const [user, setUser] = useState(null);
  const [firm, setFirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newTeamMember, setNewTeamMember] = useState('');
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo_url: '',
    practice_areas: [],
    intro_text: '',
    notification_emails: [],
    urgent_only_notifications: false,
    email_template: '',
    enabled_fields: {
      phone: true,
      timeline: true,
      deadline: true,
      files: true
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const firms = await base44.entities.Firm.filter({ created_by: currentUser.email });
      if (firms.length > 0) {
        const f = firms[0];
        setFirm(f);
        setFormData({
          name: f.name || '',
          slug: f.slug || '',
          logo_url: f.logo_url || '',
          practice_areas: f.practice_areas || [],
          intro_text: f.intro_text || '',
          notification_emails: f.notification_emails || [currentUser.email],
          urgent_only_notifications: f.urgent_only_notifications || false,
          email_template: f.email_template || '',
          enabled_fields: f.enabled_fields || {
            phone: true,
            timeline: true,
            deadline: true,
            files: true
          },
          team_members: f.team_members || [],
          available_tags: f.available_tags || [],
          follow_up_days: f.follow_up_days || 3,
          assignment_rules: f.assignment_rules || {
            enabled: false,
            type: 'round_robin',
            practice_area_assignments: {}
          }
        });
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, logo_url: file_url });
      toast.success('Logo uploaded');
    } catch (err) {
      toast.error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const togglePracticeArea = (area) => {
    const current = formData.practice_areas;
    if (current.includes(area)) {
      setFormData({
        ...formData,
        practice_areas: current.filter(a => a !== area)
      });
    } else {
      setFormData({
        ...formData,
        practice_areas: [...current, area]
      });
    }
  };

  const addEmail = () => {
    if (!newEmail || !newEmail.includes('@')) return;
    if (formData.notification_emails.includes(newEmail)) return;
    
    setFormData({
      ...formData,
      notification_emails: [...formData.notification_emails, newEmail]
    });
    setNewEmail('');
  };

  const removeEmail = (email) => {
    setFormData({
      ...formData,
      notification_emails: formData.notification_emails.filter(e => e !== email)
    });
  };

  const addTeamMember = () => {
    if (!newTeamMember || !newTeamMember.includes('@')) return;
    if (formData.team_members.includes(newTeamMember)) return;
    
    setFormData({
      ...formData,
      team_members: [...formData.team_members, newTeamMember]
    });
    setNewTeamMember('');
  };

  const removeTeamMember = (email) => {
    setFormData({
      ...formData,
      team_members: formData.team_members.filter(e => e !== email)
    });
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    if (formData.available_tags.includes(newTag.trim())) return;
    
    setFormData({
      ...formData,
      available_tags: [...formData.available_tags, newTag.trim()]
    });
    setNewTag('');
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      available_tags: formData.available_tags.filter(t => t !== tag)
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Firm.update(firm.id, formData);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/IntakeForm?firm=${formData.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('URL copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48 bg-blue-500/10" />
          <Skeleton className="h-64 bg-blue-500/10" />
          <Skeleton className="h-48 bg-blue-500/10" />
        </div>
      </div>
    );
  }

  const intakeUrl = `${window.location.origin}/IntakeForm?firm=${formData.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 py-8 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 bg-clip-text text-transparent">Settings</h1>
            <p className="text-blue-600/70 mt-2">Configure your firm and intake form</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/40">
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="firm" className="space-y-6">
          <TabsList className="bg-blue-50 border border-blue-200">
            <TabsTrigger value="firm" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 text-blue-700">Firm Info</TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 text-blue-700">Team & Workflow</TabsTrigger>
            <TabsTrigger value="intake" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 text-blue-700">Intake Form</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 text-blue-700">Notifications</TabsTrigger>
          </TabsList>

          {/* Firm Info */}
          <TabsContent value="firm" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Firm Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo */}
                <div>
                  <Label className="text-blue-800">Firm Logo</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {formData.logo_url ? (
                      <img 
                        src={formData.logo_url} 
                        alt="Logo" 
                        className="w-20 h-20 object-contain bg-blue-50 rounded-lg border border-blue-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
                        <Building2 className="w-8 h-8 text-blue-400" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload">
                        <Button variant="outline" asChild disabled={uploadingLogo} className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50">
                          <span className="cursor-pointer">
                            {uploadingLogo ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 mr-2" />
                            )}
                            Upload Logo
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-blue-600/70 mt-1">PNG or JPG, max 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-blue-800">Firm Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 bg-white border-blue-200 text-blue-900"
                  />
                </div>

                {/* Slug */}
                <div>
                  <Label htmlFor="slug" className="text-blue-800">Intake URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    className="mt-1 bg-white border-blue-200 text-blue-900"
                  />
                  <p className="text-xs text-blue-600/70 mt-1">
                    Only lowercase letters, numbers, and hyphens
                  </p>
                </div>

                {/* Practice Areas */}
                <div>
                  <Label className="text-blue-800">Practice Areas</Label>
                  <p className="text-xs text-blue-600/70 mb-2">
                    Select the areas of law your firm handles
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {PRACTICE_AREAS.map((area) => (
                      <div 
                        key={area}
                        className="flex items-center gap-2 p-2 rounded-lg border border-blue-200 hover:bg-blue-50 cursor-pointer"
                        onClick={() => togglePracticeArea(area)}
                      >
                        <Checkbox 
                          checked={formData.practice_areas.includes(area)}
                          onCheckedChange={() => togglePracticeArea(area)}
                        />
                        <span className="text-sm text-blue-900">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Template */}
                <div>
                  <Label htmlFor="email_template" className="text-blue-800">Response Email Template</Label>
                  <p className="text-xs text-blue-600/70 mb-2">
                    Template for AI-generated initial response emails. Use {'{'}firm_name{'}'} and {'{'}practice_area{'}'} as placeholders.
                  </p>
                  <Textarea
                    id="email_template"
                    value={formData.email_template || ''}
                    onChange={(e) => setFormData({ ...formData, email_template: e.target.value })}
                    placeholder="Thank you for contacting {firm_name}. We have received your inquiry regarding {practice_area}..."
                    rows={4}
                    className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team & Workflow */}
          <TabsContent value="team" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Users className="w-5 h-5 text-blue-600" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-blue-700">Add team members who can be assigned intakes</p>
                <div className="space-y-2">
                  {formData.team_members.map((email) => (
                    <div key={email} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                      <span className="text-sm text-blue-900">{email}</span>
                      <button 
                        onClick={() => removeTeamMember(email)}
                        className="text-blue-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={newTeamMember}
                    onChange={(e) => setNewTeamMember(e.target.value)}
                    placeholder="team@example.com"
                    onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
                    className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                  />
                  <Button variant="outline" onClick={addTeamMember} className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Tag className="w-5 h-5 text-blue-600" />
                  Available Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-blue-700">Create tags for categorizing intakes</p>
                <div className="flex flex-wrap gap-2">
                  {formData.available_tags.map((tag) => (
                    <Badge key={tag} className="bg-blue-50 text-blue-700 border-blue-300 pr-1">
                      {tag}
                      <button 
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag (e.g., VIP, Referral, Follow-up)"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                  />
                  <Button variant="outline" onClick={addTag} className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Follow-up Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="follow_up_days" className="text-blue-800">
                  Auto-follow-up after (days)
                </Label>
                <p className="text-xs text-blue-600/70 mb-2">
                  Send automated follow-up email if client hasn't been contacted
                </p>
                <Input
                  id="follow_up_days"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.follow_up_days}
                  onChange={(e) => setFormData({ ...formData, follow_up_days: parseInt(e.target.value) })}
                  className="w-32 bg-white border-blue-200 text-blue-900"
                />
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  Auto-Assignment Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-blue-800">Enable Auto-Assignment</Label>
                    <p className="text-xs text-blue-600/70">Automatically assign new intakes to team members</p>
                  </div>
                  <Switch
                    checked={formData.assignment_rules.enabled}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      assignment_rules: { ...formData.assignment_rules, enabled: checked }
                    })}
                  />
                </div>

                {formData.assignment_rules.enabled && (
                  <>
                    <div>
                      <Label className="text-blue-800">Assignment Method</Label>
                      <Select
                        value={formData.assignment_rules.type}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          assignment_rules: { ...formData.assignment_rules, type: value }
                        })}
                      >
                        <SelectTrigger className="bg-white border-blue-200 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="round_robin">Round Robin (Equal distribution)</SelectItem>
                          <SelectItem value="practice_area">By Practice Area</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.assignment_rules.type === 'practice_area' && (
                      <div className="space-y-3 pt-2 border-t border-blue-200">
                        <Label className="text-blue-800">Practice Area Assignments</Label>
                        <p className="text-xs text-blue-600/70">Assign team members to specific practice areas</p>
                        {formData.practice_areas.map((area) => (
                          <div key={area} className="flex items-center gap-2">
                            <span className="text-sm text-blue-900 w-40">{area}</span>
                            <Select
                              value={formData.assignment_rules.practice_area_assignments[area] || ''}
                              onValueChange={(value) => setFormData({
                                ...formData,
                                assignment_rules: {
                                  ...formData.assignment_rules,
                                  practice_area_assignments: {
                                    ...formData.assignment_rules.practice_area_assignments,
                                    [area]: value
                                  }
                                }
                              })}
                            >
                              <SelectTrigger className="bg-white border-blue-200">
                                <SelectValue placeholder="Select team member" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={null}>Unassigned</SelectItem>
                                {formData.team_members.map((email) => (
                                  <SelectItem key={email} value={email}>
                                    {email.split('@')[0]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intake Form */}
          <TabsContent value="intake" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Link2 className="w-5 h-5 text-blue-600" />
                  Intake Form Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* URL Preview */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Label className="text-sm text-blue-700">Your Intake Form URL</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="flex-1 bg-white px-3 py-2 rounded border border-blue-200 text-sm truncate text-blue-900">
                      {intakeUrl}
                    </code>
                    <Button variant="outline" size="sm" onClick={copyUrl} className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50">
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <a href={intakeUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Intro Text */}
                <div>
                  <Label htmlFor="intro" className="text-blue-800">Welcome Message</Label>
                  <Textarea
                    id="intro"
                    value={formData.intro_text}
                    onChange={(e) => setFormData({ ...formData, intro_text: e.target.value })}
                    placeholder="Optional message shown at the top of your intake form..."
                    rows={3}
                    className="mt-1 bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                  />
                </div>

                {/* Enabled Fields */}
                <div>
                  <Label className="text-blue-800">Form Fields</Label>
                  <p className="text-xs text-blue-600/70 mb-3">
                    Choose which optional fields to show on your intake form
                  </p>
                  <div className="space-y-3">
                    {[
                      { key: 'phone', label: 'Phone Number' },
                      { key: 'timeline', label: 'Urgency/Timeline' },
                      { key: 'deadline', label: 'Deadlines & Court Dates' },
                      { key: 'files', label: 'Document Uploads' }
                    ].map((field) => (
                      <div key={field.key} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="text-sm text-blue-900">{field.label}</span>
                        <Switch
                          checked={formData.enabled_fields[field.key]}
                          onCheckedChange={(checked) => setFormData({
                            ...formData,
                            enabled_fields: { ...formData.enabled_fields, [field.key]: checked }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Bell className="w-5 h-5 text-blue-600" />
                  Email Notifications
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Get notified when new intakes are submitted
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email List */}
                <div>
                  <Label className="text-blue-800">Notification Recipients</Label>
                  <div className="space-y-2 mt-2">
                    {formData.notification_emails.map((email) => (
                      <div key={email} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                        <span className="text-sm text-blue-900">{email}</span>
                        <button 
                          onClick={() => removeEmail(email)}
                          className="text-blue-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Add email address"
                      onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                      className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                    />
                    <Button variant="outline" onClick={addEmail} className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Urgent Only Toggle */}
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <p className="font-medium text-sm text-amber-900">Urgent Intakes Only</p>
                    <p className="text-xs text-amber-700">
                      Only send notifications for high-urgency intakes
                    </p>
                  </div>
                  <Switch
                    checked={formData.urgent_only_notifications}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      urgent_only_notifications: checked
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}