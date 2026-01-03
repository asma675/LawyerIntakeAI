import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailHistory from '@/components/communication/EmailHistory';
import AppointmentsList from '@/components/communication/AppointmentsList';
import { 
  FileText, 
  Mail, 
  Lock,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Shield,
  ExternalLink,
  Copy,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ClientPortal() {
  const [user, setUser] = useState(null);
  const [firm, setFirm] = useState(null);
  const [intake, setIntake] = useState(null);
  const [emailHistory, setEmailHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const intakeId = new URLSearchParams(window.location.search).get('intake');

  useEffect(() => {
    if (!intakeId) {
      loadUserAndFirm();
    }
  }, [intakeId]);

  const loadUserAndFirm = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const firms = await base44.entities.Firm.filter({ created_by: currentUser.email });
      if (firms.length > 0) {
        setFirm(firms[0]);
      }
    } catch (err) {
      console.error('Error loading user/firm:', err);
    }
  };

  const { data: intakes = [], isLoading: intakesLoading } = useQuery({
    queryKey: ['intakes', firm?.id],
    queryFn: () => firm ? base44.entities.Intake.filter({ firm_id: firm.id }, '-created_date') : [],
    enabled: !!firm && !intakeId,
  });

  const verifyAccess = async () => {
    if (!verificationEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const intakes = await base44.entities.Intake.filter({ id: intakeId });
      
      if (intakes.length === 0) {
        toast.error('Intake not found');
        setLoading(false);
        return;
      }

      const foundIntake = intakes[0];
      
      if (foundIntake.client_email.toLowerCase() !== verificationEmail.toLowerCase()) {
        toast.error('Email does not match our records');
        setLoading(false);
        return;
      }

      setIntake(foundIntake);
      setAuthenticated(true);
      
      // Load email history
      const emails = await base44.entities.EmailHistory.filter(
        { intake_id: intakeId },
        '-created_date'
      );
      setEmailHistory(emails);

      toast.success('Access granted!');
    } catch (err) {
      console.error('Error verifying access:', err);
      toast.error('Failed to verify access');
    } finally {
      setLoading(false);
    }
  };

  // Admin view - list all intakes with portal links
  if (!intakeId) {
    const copyPortalLink = (intakeId) => {
      const url = `${window.location.origin}/ClientPortal?intake=${intakeId}`;
      navigator.clipboard.writeText(url);
      toast.success('Portal link copied!');
    };

    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-700', label: 'New' },
      urgent: { color: 'bg-red-100 text-red-700', label: 'Urgent' },
      reviewed: { color: 'bg-green-100 text-green-700', label: 'Reviewed' },
      archived: { color: 'bg-slate-100 text-slate-700', label: 'Archived' }
    };

    if (intakesLoading || !user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-12 w-64 bg-blue-500/10" />
            <Skeleton className="h-32 bg-blue-500/10" />
            <Skeleton className="h-32 bg-blue-500/10" />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 bg-clip-text text-transparent mb-2">
              Client Portal Links
            </h1>
            <p className="text-blue-600/70">Share these links with clients to track their intake status</p>
          </div>

          {intakes.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
              <CardContent className="pt-12 pb-12 text-center">
                <User className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">No Intakes Yet</h3>
                <p className="text-blue-700">
                  Portal links will appear here once clients submit intake forms
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {intakes.map((intake) => (
                <Card key={intake.id} className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20 hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-blue-900 mb-1">{intake.client_name}</h3>
                        <p className="text-sm text-blue-700">{intake.client_email}</p>
                        <p className="text-xs text-blue-600/70 mt-1">
                          Submitted {format(new Date(intake.created_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge className={statusConfig[intake.status]?.color}>
                        {statusConfig[intake.status]?.label}
                      </Badge>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-xs text-blue-600/70 mb-1">Client Portal Link</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs text-blue-900 truncate">
                          {window.location.origin}/ClientPortal?intake={intake.id}
                        </code>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyPortalLink(intake.id)}
                          className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <a 
                          href={`/ClientPortal?intake=${intake.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-900">Client Portal Access</CardTitle>
            <p className="text-sm text-blue-700 mt-2">
              Verify your email to view your intake status
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-blue-800 mb-2 block">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email..."
                value={verificationEmail}
                onChange={(e) => setVerificationEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verifyAccess()}
                className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
              />
            </div>
            <Button 
              onClick={verifyAccess} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/40"
            >
              {loading ? (
                <>
                  <Lock className="w-4 h-4 mr-2 animate-pulse" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Access Portal
                </>
              )}
            </Button>
            <p className="text-xs text-blue-600/70 text-center">
              Enter the email address you used when submitting your intake form
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = {
    new: { 
      color: 'bg-blue-100 text-blue-700 border-blue-300', 
      label: 'Under Review',
      icon: Clock,
      description: 'Your submission is being reviewed by our team'
    },
    urgent: { 
      color: 'bg-amber-100 text-amber-700 border-amber-300', 
      label: 'High Priority',
      icon: AlertTriangle,
      description: 'Your matter has been flagged as high priority'
    },
    reviewed: { 
      color: 'bg-green-100 text-green-700 border-green-300', 
      label: 'Reviewed',
      icon: CheckCircle2,
      description: 'Your submission has been reviewed'
    },
    archived: { 
      color: 'bg-slate-100 text-slate-700 border-slate-300', 
      label: 'Closed',
      icon: CheckCircle2,
      description: 'This matter has been closed'
    }
  };

  const currentStatus = statusConfig[intake.status] || statusConfig.new;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-blue-200 shadow-lg shadow-blue-500/10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Client Portal</h1>
              <p className="text-sm text-blue-600/70">Track your legal intake submission</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Status Overview */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl text-blue-900 mb-1">
                  {intake.client_name}
                </CardTitle>
                <p className="text-sm text-blue-600/70">
                  Submitted {format(new Date(intake.created_date), 'MMMM d, yyyy')}
                </p>
              </div>
              <Badge className={`${currentStatus.color} px-4 py-2 text-sm border`}>
                <StatusIcon className="w-4 h-4 mr-2" />
                {currentStatus.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-800 mb-3">
                <strong>Practice Area:</strong> {intake.ai_practice_area || intake.practice_area}
              </p>
              <p className="text-sm text-blue-700">
                {currentStatus.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
              <Clock className="w-5 h-5 text-blue-600" />
              Status Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 border-2 border-green-300">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-blue-900">Submission Received</p>
                  <p className="text-sm text-blue-700">
                    {format(new Date(intake.created_date), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>

              {intake.status !== 'new' && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 border-2 border-blue-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">Status Updated</p>
                    <p className="text-sm text-blue-700">
                      Marked as {currentStatus.label.toLowerCase()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border-2 border-blue-300 border-dashed">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-blue-700">Next Steps</p>
                  <p className="text-sm text-blue-600">
                    We'll reach out soon with next steps
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Communication Hub */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Communications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="emails" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-blue-50 border border-blue-200">
                <TabsTrigger 
                  value="emails" 
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-900 text-blue-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Emails
                </TabsTrigger>
                <TabsTrigger 
                  value="appointments" 
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-900 text-blue-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Appointments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="emails" className="mt-6">
                <EmailHistory emails={emailHistory} />
              </TabsContent>

              <TabsContent value="appointments" className="mt-6">
                <AppointmentsList appointments={appointments} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-500 text-white border-0 shadow-lg shadow-blue-500/40">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 shadow-inner">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Need to update your information?</h3>
                <p className="text-blue-100 mb-4">
                  If you have questions or need to provide additional information, please reply to any email we've sent you or contact us directly.
                </p>
                <a href={`mailto:${intake.client_email}`}>
                  <Button className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}