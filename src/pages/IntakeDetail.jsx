import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CalendarEventDialog from '@/components/intake/CalendarEventDialog';
import EmailComposer from '@/components/communication/EmailComposer';
import EmailHistory from '@/components/communication/EmailHistory';
import AppointmentsList from '@/components/communication/AppointmentsList';
import MessageCenter from '@/components/messaging/MessageCenter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Archive,
  Copy,
  Download,
  Loader2,
  Sparkles,
  ExternalLink,
  Save,
  CalendarPlus,
  MessageSquare,
  Tag,
  TrendingUp,
  UserPlus,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function IntakeDetail() {
  const [intake, setIntake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [emailHistory, setEmailHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [firm, setFirm] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [updatingField, setUpdatingField] = useState(false);

  const intakeId = new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    loadIntake();
    loadEmailHistory();
  }, [intakeId]);

  const loadIntake = async () => {
    try {
      const intakes = await base44.entities.Intake.filter({ id: intakeId });
      if (intakes.length > 0) {
        const intakeData = intakes[0];
        setIntake(intakeData);
        setNotes(intakeData.internal_notes || '');
        
        // Load firm data
        const firms = await base44.entities.Firm.filter({ id: intakeData.firm_id });
        if (firms.length > 0) {
          setFirm(firms[0]);
        }
      }
    } catch (err) {
      console.error('Error loading intake:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEmailHistory = async () => {
    try {
      const emails = await base44.entities.EmailHistory.filter(
        { intake_id: intakeId },
        '-created_date'
      );
      setEmailHistory(emails);
    } catch (err) {
      console.error('Error loading email history:', err);
    }
  };

  const processWithAI = async () => {
    setProcessing(true);
    try {
      const prompt = `Analyze this legal intake submission and provide:
1. A clear 2-3 sentence summary in plain English
2. The most likely practice area (choose from: Family Law, Employment Law, Real Estate, Personal Injury, Criminal Defence, Immigration, Corporate/Commercial, Wills & Estates, Civil Litigation, Other)
3. Urgency level (high, medium, or low) based on any mentioned deadlines, court dates, or time-sensitive circumstances
4. A brief suggested next step (generic administrative action, NOT legal advice)

Client Name: ${intake.client_name}
Area of Law Selected: ${intake.practice_area}
Timeline Urgency: ${intake.timeline || 'Not specified'}
Deadline Date: ${intake.deadline_date || 'None mentioned'}
Deadline Details: ${intake.deadline_description || 'None'}

Issue Description:
${intake.issue_description}

IMPORTANT: Do not provide legal advice. Focus on administrative triage only.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            practice_area: { type: "string" },
            urgency: { type: "string", enum: ["high", "medium", "low"] },
            next_steps: { type: "string" }
          },
          required: ["summary", "practice_area", "urgency", "next_steps"]
        }
      });

      await base44.entities.Intake.update(intake.id, {
        ai_summary: result.summary,
        ai_practice_area: result.practice_area,
        ai_urgency: result.urgency,
        ai_next_steps: result.next_steps,
        status: result.urgency === 'high' ? 'urgent' : intake.status
      });

      await loadIntake();
      toast.success('AI analysis complete!');
    } catch (err) {
      console.error('AI processing error:', err);
      toast.error('Failed to process with AI');
    } finally {
      setProcessing(false);
    }
  };

  const updateStatus = async (newStatus) => {
    const oldStatus = intake.status;
    try {
      await base44.entities.Intake.update(intake.id, { status: newStatus });
      setIntake({ ...intake, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      
      // Notify client of status change
      base44.functions.invoke('notifyStatusChange', {
        intake_id: intake.id,
        old_status: oldStatus,
        new_status: newStatus
      }).catch(() => {});
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const updateAssignment = async (assignedTo) => {
    setUpdatingField(true);
    try {
      await base44.entities.Intake.update(intake.id, { assigned_to: assignedTo });
      setIntake({ ...intake, assigned_to: assignedTo });
      toast.success('Assignment updated');
    } catch (err) {
      toast.error('Failed to update assignment');
    } finally {
      setUpdatingField(false);
    }
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    const currentTags = intake.tags || [];
    if (currentTags.includes(newTag.trim())) {
      toast.error('Tag already exists');
      return;
    }
    
    try {
      const updatedTags = [...currentTags, newTag.trim()];
      await base44.entities.Intake.update(intake.id, { tags: updatedTags });
      setIntake({ ...intake, tags: updatedTags });
      setNewTag('');
      toast.success('Tag added');
    } catch (err) {
      toast.error('Failed to add tag');
    }
  };

  const removeTag = async (tagToRemove) => {
    try {
      const updatedTags = (intake.tags || []).filter(t => t !== tagToRemove);
      await base44.entities.Intake.update(intake.id, { tags: updatedTags });
      setIntake({ ...intake, tags: updatedTags });
      toast.success('Tag removed');
    } catch (err) {
      toast.error('Failed to remove tag');
    }
  };

  const updateFollowUp = async (date) => {
    try {
      await base44.entities.Intake.update(intake.id, { next_follow_up_date: date });
      setIntake({ ...intake, next_follow_up_date: date });
      toast.success('Follow-up date set');
    } catch (err) {
      toast.error('Failed to set follow-up date');
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      await base44.entities.Intake.update(intake.id, { internal_notes: notes });
      toast.success('Notes saved');
    } catch (err) {
      toast.error('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const copySummary = () => {
    const text = `Client: ${intake.client_name}
Email: ${intake.client_email}
Phone: ${intake.client_phone || 'Not provided'}
Practice Area: ${intake.ai_practice_area || intake.practice_area}
Urgency: ${intake.ai_urgency || 'Not assessed'}

Summary:
${intake.ai_summary || 'Not yet processed'}

Next Steps:
${intake.ai_next_steps || 'Not yet processed'}`;
    
    navigator.clipboard.writeText(text);
    toast.success('Summary copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-48" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!intake) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Intake Not Found</h2>
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const urgencyConfig = {
    high: { color: 'bg-red-100 text-red-700', label: 'High Urgency' },
    medium: { color: 'bg-amber-100 text-amber-700', label: 'Medium Urgency' },
    low: { color: 'bg-green-100 text-green-700', label: 'Low Urgency' }
  };

  const statusConfig = {
    new: { color: 'bg-blue-100 text-blue-700', label: 'New' },
    urgent: { color: 'bg-red-100 text-red-700', label: 'Urgent' },
    reviewed: { color: 'bg-slate-100 text-slate-700', label: 'Reviewed' },
    archived: { color: 'bg-slate-50 text-slate-500', label: 'Archived' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-blue-200 sticky top-0 z-10 shadow-lg shadow-blue-500/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" className="text-blue-700 hover:text-blue-900 hover:bg-blue-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={copySummary} className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50 shadow-sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy Summary
              </Button>
              <Button 
                onClick={processWithAI}
                disabled={processing}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/40"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {processing ? 'Processing...' : 'Analyze with AI'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Client Info */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center ring-2 ring-blue-300">
                  <User className="w-7 h-7 text-blue-700" />
                </div>
                <div>
                  <CardTitle className="text-xl text-blue-900">{intake.client_name}</CardTitle>
                  <p className="text-sm text-blue-600/70">
                    Submitted {format(new Date(intake.created_date), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusConfig[intake.status]?.color}>
                  {statusConfig[intake.status]?.label}
                </Badge>
                {intake.ai_urgency && (
                  <Badge className={urgencyConfig[intake.ai_urgency]?.color}>
                    {urgencyConfig[intake.ai_urgency]?.label}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-blue-600/70">Email</p>
                  <a href={`mailto:${intake.client_email}`} className="text-sm text-blue-700 hover:text-blue-900 hover:underline">
                    {intake.client_email}
                  </a>
                </div>
              </div>
              {intake.client_phone && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-blue-600/70">Phone</p>
                    <a href={`tel:${intake.client_phone}`} className="text-sm text-blue-700 hover:text-blue-900 hover:underline">
                      {intake.client_phone}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-blue-600/70">Practice Area</p>
                  <p className="text-sm font-medium text-blue-900">{intake.ai_practice_area || intake.practice_area}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Summary */}
        {intake.ai_summary && (
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                <Sparkles className="w-5 h-5 text-blue-600" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">Summary</h4>
                <p className="text-blue-900">{intake.ai_summary}</p>
              </div>
              {intake.ai_next_steps && (
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Suggested Next Steps</h4>
                  <p className="text-blue-900">{intake.ai_next_steps}</p>
                </div>
              )}
              
              {/* Sentiment Analysis */}
              {intake.ai_sentiment && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Client Sentiment</h4>
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      intake.ai_sentiment.level === 'urgent' ? 'bg-red-100 text-red-700' :
                      intake.ai_sentiment.level === 'frustrated' ? 'bg-orange-100 text-orange-700' :
                      intake.ai_sentiment.level === 'concerned' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {intake.ai_sentiment.level === 'urgent' ? '😰 Urgent/Distressed' :
                       intake.ai_sentiment.level === 'frustrated' ? '😤 Frustrated' :
                       intake.ai_sentiment.level === 'concerned' ? '😟 Concerned' :
                       '😌 Calm'}
                    </div>
                    <span className="text-sm text-slate-500">
                      Distress Level: {intake.ai_sentiment.score}/10
                    </span>
                  </div>
                  {intake.ai_sentiment.indicators?.length > 0 && (
                    <div className="text-xs text-slate-500">
                      Key indicators: {intake.ai_sentiment.indicators.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Conflict Check */}
              {intake.ai_conflict_check && (
                <div className={`pt-4 border-t ${intake.ai_conflict_check.has_potential_conflict ? 'bg-red-50 -mx-6 -mb-6 mt-4 p-6 rounded-b-xl' : ''}`}>
                  <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    {intake.ai_conflict_check.has_potential_conflict && (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    Conflict of Interest Check
                  </h4>
                  {intake.ai_conflict_check.has_potential_conflict ? (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-red-700 font-medium">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Potential Conflict Detected - Manual Review Required</span>
                      </div>
                      <p className="text-sm text-red-600">{intake.ai_conflict_check.conflict_details}</p>
                      {intake.ai_conflict_check.mentioned_parties?.length > 0 && (
                        <div className="text-sm text-red-600">
                          <span className="font-medium">Mentioned parties:</span> {intake.ai_conflict_check.mentioned_parties.join(', ')}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>No obvious conflicts detected</span>
                    </div>
                  )}
                  {intake.ai_conflict_check.mentioned_parties?.length > 0 && !intake.ai_conflict_check.has_potential_conflict && (
                    <div className="text-xs text-slate-500 mt-2">
                      Parties mentioned: {intake.ai_conflict_check.mentioned_parties.join(', ')}
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-blue-600/60 italic">
                Note: This is administrative analysis only, not legal advice.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Draft Response Email */}
        {intake.ai_draft_email && (
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 backdrop-blur-sm border-cyan-200 shadow-lg shadow-cyan-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                  <Mail className="w-5 h-5 text-cyan-600" />
                  Draft Response Email
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cyan-300 bg-white text-cyan-700 hover:bg-cyan-50 shadow-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(intake.ai_draft_email);
                    toast.success('Email copied to clipboard');
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Email
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="mb-3 pb-3 border-b border-blue-200 text-sm text-blue-700">
                  <div><strong>To:</strong> {intake.client_email}</div>
                  <div><strong>Subject:</strong> Re: Your Inquiry to [Firm Name]</div>
                </div>
                <div className="text-blue-900 whitespace-pre-wrap text-sm leading-relaxed">
                  {intake.ai_draft_email}
                </div>
              </div>
              <p className="text-xs text-blue-600/60 mt-3 italic">
                This is an AI-generated draft. Please review and customize before sending.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Issue Description */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Client's Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 whitespace-pre-wrap">{intake.issue_description}</p>
            
            {/* Timeline & Deadlines */}
            {(intake.timeline || intake.deadline_date) && (
              <div className="mt-6 pt-6 border-t border-blue-200 space-y-3">
                {intake.timeline && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800">
                      Timeline: <span className="font-medium capitalize">{intake.timeline.replace('_', ' ')}</span>
                    </span>
                  </div>
                )}
                {intake.deadline_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800">
                      Deadline: <span className="font-medium">{format(new Date(intake.deadline_date), 'MMMM d, yyyy')}</span>
                    </span>
                  </div>
                )}
                {intake.deadline_description && (
                  <p className="text-sm text-blue-800 pl-6">{intake.deadline_description}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Files */}
        {intake.file_urls?.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {intake.file_urls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-900 flex-1">Document {index + 1}</span>
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assignment & Tags */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Case Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Assignment */}
            {firm?.team_members?.length > 0 && (
              <div>
                <Label className="text-sm text-blue-800 mb-2 block">Assigned To</Label>
                <Select 
                  value={intake.assigned_to || 'unassigned'} 
                  onValueChange={updateAssignment}
                  disabled={updatingField}
                >
                  <SelectTrigger className="bg-white border-blue-200">
                    <UserPlus className="w-4 h-4 mr-2 text-blue-600" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {firm.team_members.map(email => (
                      <SelectItem key={email} value={email}>
                        {email.split('@')[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Tags */}
            <div>
              <Label className="text-sm text-blue-800 mb-2 block">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(intake.tags || []).map(tag => (
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
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="bg-white border-blue-200"
                />
                <Button onClick={addTag} variant="outline" className="border-blue-300 text-blue-700">
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Lead Score */}
            {intake.lead_score && (
              <div>
                <Label className="text-sm text-blue-800 mb-2 block">Lead Score</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-blue-50 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all"
                      style={{ width: `${intake.lead_score}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-blue-900">{intake.lead_score}%</span>
                </div>
              </div>
            )}

            {/* Follow-up Date */}
            <div>
              <Label className="text-sm text-blue-800 mb-2 block">Follow-up Date</Label>
              <Input
                type="date"
                value={intake.next_follow_up_date || ''}
                onChange={(e) => updateFollowUp(e.target.value)}
                className="bg-white border-blue-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Communication Hub */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Communication Hub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="messages" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-blue-50 border border-blue-200">
                <TabsTrigger value="messages" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 text-blue-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="email" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 text-blue-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 text-blue-700">
                  History
                </TabsTrigger>
                <TabsTrigger value="appointments" className="data-[state=active]:bg-white data-[state=active]:text-blue-900 text-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Meetings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="messages" className="mt-6">
                <MessageCenter intake={intake} userType="staff" />
              </TabsContent>

              <TabsContent value="email" className="mt-6">
                <EmailComposer intake={intake} onEmailSent={loadEmailHistory} />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <EmailHistory emails={emailHistory} />
              </TabsContent>

              <TabsContent value="appointments" className="mt-6">
                <AppointmentsList appointments={appointments} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Internal Notes */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Internal Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add private notes about this intake..."
              rows={4}
              className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
            />
            <Button onClick={saveNotes} disabled={saving} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/40">
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Notes
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-blue-800 mb-3">Status</p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant={intake.status === 'reviewed' ? 'default' : 'outline'}
                  onClick={() => updateStatus('reviewed')}
                  className={intake.status === 'reviewed' ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30' : 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Reviewed
                </Button>
                <Button 
                  variant={intake.status === 'urgent' ? 'default' : 'outline'}
                  onClick={() => updateStatus('urgent')}
                  className={intake.status === 'urgent' ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/40' : 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Mark Urgent
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => updateStatus('archived')}
                  className="border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-3">Calendar</p>
              <Button 
                variant="outline"
                onClick={() => setCalendarDialogOpen(true)}
                className="w-full sm:w-auto border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                <CalendarPlus className="w-4 h-4 mr-2" />
                Schedule Event
              </Button>
              <p className="text-xs text-blue-600/60 mt-2">
                Create a Google Calendar event with this client
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Event Dialog */}
        <CalendarEventDialog 
          intake={intake}
          open={calendarDialogOpen}
          onOpenChange={setCalendarDialogOpen}
        />
      </div>
    </div>
  );
}