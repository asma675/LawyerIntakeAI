import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import IntakeColumn from '@/components/dashboard/IntakeColumn';
import BulkActions from '@/components/dashboard/BulkActions';
import { 
  Inbox, 
  AlertTriangle, 
  CheckCircle2, 
  Archive,
  Search,
  Filter,
  RefreshCw,
  Copy,
  ExternalLink,
  TrendingUp,
  Clock,
  Zap,
  Users,
  BarChart3,
  Sparkles,
  Download,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [firm, setFirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [practiceAreaFilter, setPracticeAreaFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('kanban');
  const [selectedIds, setSelectedIds] = useState([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadUserAndFirm();
  }, []);

  const loadUserAndFirm = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      // Load or create firm for this user
      const firms = await base44.entities.Firm.filter({ created_by: currentUser.email });
      if (firms.length > 0) {
        setFirm(firms[0]);
      } else {
        // Create a default firm for new users
        const slug = currentUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const newFirm = await base44.entities.Firm.create({
          name: currentUser.full_name ? `${currentUser.full_name}'s Firm` : 'My Law Firm',
          slug: slug + '-' + Date.now().toString(36),
          practice_areas: ['Family Law', 'Employment Law', 'Real Estate', 'Personal Injury', 'Other'],
          notification_emails: [currentUser.email]
        });
        setFirm(newFirm);
      }
    } catch (err) {
      console.error('Error loading user/firm:', err);
    }
  };

  const { data: intakes = [], isLoading, refetch } = useQuery({
    queryKey: ['intakes', firm?.id],
    queryFn: () => firm ? base44.entities.Intake.filter({ firm_id: firm.id }, '-created_date') : [],
    enabled: !!firm,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Filter intakes
  const filteredIntakes = intakes.filter(intake => {
    const matchesSearch = !searchQuery || 
      intake.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intake.client_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intake.issue_description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUrgency = urgencyFilter === 'all' || intake.ai_urgency === urgencyFilter;
    const matchesPracticeArea = practiceAreaFilter === 'all' || 
      intake.ai_practice_area === practiceAreaFilter || 
      intake.practice_area === practiceAreaFilter;
    const matchesTag = tagFilter === 'all' || (intake.tags || []).includes(tagFilter);
    const matchesAssigned = assignedFilter === 'all' || 
      (assignedFilter === 'unassigned' && !intake.assigned_to) ||
      (assignedFilter === 'me' && intake.assigned_to === user?.email) ||
      intake.assigned_to === assignedFilter;
    
    return matchesSearch && matchesUrgency && matchesPracticeArea && matchesTag && matchesAssigned;
  });

  // Calculate stats
  const todayIntakes = intakes.filter(i => {
    const today = new Date().toDateString();
    return new Date(i.created_date).toDateString() === today;
  }).length;

  const avgResponseTime = intakes.filter(i => i.status === 'reviewed').length > 0
    ? '< 2h'
    : 'N/A';

  const uniquePracticeAreas = [...new Set(intakes.map(i => i.ai_practice_area || i.practice_area))].filter(Boolean);
  const uniqueTags = firm?.available_tags || [...new Set(intakes.flatMap(i => i.tags || []))];
  const teamMembers = firm?.team_members || [];

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await base44.functions.invoke('exportIntakes', {
        firm_id: firm.id,
        format: 'csv',
        filters: {
          ...(urgencyFilter !== 'all' && { ai_urgency: urgencyFilter }),
          ...(practiceAreaFilter !== 'all' && { ai_practice_area: practiceAreaFilter })
        }
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `intakes-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success('Export downloaded');
    } catch (error) {
      toast.error('Failed to export');
    } finally {
      setExporting(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(filteredIntakes.map(i => i.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
    refetch();
  };

  // Categorize intakes
  const newIntakes = filteredIntakes.filter(i => i.status === 'new');
  const urgentIntakes = filteredIntakes.filter(i => i.status === 'urgent' || (i.status === 'new' && i.ai_urgency === 'high'));
  const reviewedIntakes = filteredIntakes.filter(i => i.status === 'reviewed');
  const archivedIntakes = filteredIntakes.filter(i => i.status === 'archived');

  const copyIntakeUrl = () => {
    if (!firm) return;
    const url = `${window.location.origin}/IntakeForm?firm=${firm.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Intake form URL copied to clipboard!');
  };

  if (!user || !firm) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-blue-200 sticky top-0 z-10 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                Intake Command Center
              </h1>
              <p className="text-sm text-blue-300/60 mt-1">{firm.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline"
                onClick={copyIntakeUrl}
                className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Share Form
              </Button>
              <Button 
                variant="outline"
                onClick={handleExport}
                disabled={exporting}
                className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-sm"
              >
                {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Export CSV
              </Button>
              <a 
                href={`/IntakeForm?firm=${firm.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/40">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview Form
                </Button>
              </a>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600/70 font-medium mb-1">Total Intakes</p>
                    <p className="text-2xl font-bold text-blue-900">{intakes.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
                    <Inbox className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-red-200 shadow-lg shadow-red-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-red-600/70 font-medium mb-1">Urgent</p>
                    <p className="text-2xl font-bold text-red-900">{urgentIntakes.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shadow-inner">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-cyan-200 shadow-lg shadow-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-cyan-600/70 font-medium mb-1">Today</p>
                    <p className="text-2xl font-bold text-cyan-900">{todayIntakes}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center shadow-inner">
                    <TrendingUp className="w-6 h-6 text-cyan-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg shadow-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-600/70 font-medium mb-1">Avg Response</p>
                    <p className="text-2xl font-bold text-purple-900">{avgResponseTime}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shadow-inner">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
              <Input
                placeholder="Search intakes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-blue-200 text-blue-900 placeholder:text-blue-400 focus:border-blue-400 focus:ring-blue-500/20 shadow-sm"
              />
            </div>
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-36 bg-white border-blue-200 text-blue-900 shadow-sm">
                <Filter className="w-4 h-4 mr-2 text-blue-600" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-200">
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={practiceAreaFilter} onValueChange={setPracticeAreaFilter}>
              <SelectTrigger className="w-44 bg-white border-blue-200 text-blue-900 shadow-sm">
                <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-200">
                <SelectItem value="all">All Practice Areas</SelectItem>
                {uniquePracticeAreas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {uniqueTags.length > 0 && (
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-36 bg-white border-blue-200 text-blue-900 shadow-sm">
                  <Tag className="w-4 h-4 mr-2 text-blue-600" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-blue-200">
                  <SelectItem value="all">All Tags</SelectItem>
                  {uniqueTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={assignedFilter} onValueChange={setAssignedFilter}>
              <SelectTrigger className="w-36 bg-white border-blue-200 text-blue-900 shadow-sm">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-200">
                <SelectItem value="all">All Assigned</SelectItem>
                <SelectItem value="me">Assigned to Me</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {teamMembers.map(email => (
                  <SelectItem key={email} value={email}>{email.split('@')[0]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filteredIntakes.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={selectedIds.length === filteredIntakes.length ? clearSelection : selectAll}
                className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50"
              >
                <Checkbox checked={selectedIds.length > 0} className="mr-2" />
                {selectedIds.length === filteredIntakes.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-8 w-32 bg-blue-500/10" />
                <Skeleton className="h-32 bg-blue-500/10" />
                <Skeleton className="h-32 bg-blue-500/10" />
              </div>
            ))}
          </div>
        ) : intakes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
              <Inbox className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-3">No Intakes Yet</h2>
            <p className="text-blue-700 mb-8 max-w-md mx-auto">
              Share your intake form URL with potential clients to start receiving submissions.
            </p>
            <Button 
              onClick={copyIntakeUrl} 
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/40"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Intake URL
            </Button>
          </div>
        ) : filteredIntakes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
              <Search className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-3">No Results Found</h2>
            <p className="text-blue-700 mb-8">
              Try adjusting your filters or search query.
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setUrgencyFilter('all');
                setPracticeAreaFilter('all');
              }}
              className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50 shadow-sm"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            {/* AI Insights Banner */}
            {urgentIntakes.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 shadow-lg shadow-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-900 mb-1">AI Alert: Urgent Matters Detected</h3>
                    <p className="text-xs text-red-700">
                      {urgentIntakes.length} intake{urgentIntakes.length > 1 ? 's' : ''} flagged as high urgency. 
                      Review immediately to avoid missing deadlines.
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-900 border-red-300">
                    {urgentIntakes.length} Urgent
                  </Badge>
                </div>
              </div>
            )}

            {/* Kanban Board */}
            <div className="flex gap-6 overflow-x-auto pb-4">
              <IntakeColumn 
                title="New" 
                intakes={newIntakes.filter(i => i.ai_urgency !== 'high')} 
                icon={Inbox}
                color="border-blue-400 shadow-blue-500/30"
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
              <IntakeColumn 
                title="Urgent" 
                intakes={urgentIntakes} 
                icon={AlertTriangle}
                color="border-red-400 shadow-red-500/30"
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
              <IntakeColumn 
                title="Reviewed" 
                intakes={reviewedIntakes} 
                icon={CheckCircle2}
                color="border-green-400 shadow-green-500/30"
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
              <IntakeColumn 
                title="Archived" 
                intakes={archivedIntakes} 
                icon={Archive}
                color="border-slate-400 shadow-slate-500/30"
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
            </div>

            {/* Bulk Actions */}
            <BulkActions 
              selectedIds={selectedIds}
              onComplete={clearSelection}
              teamMembers={teamMembers}
              availableTags={uniqueTags}
            />
          </>
        )}
      </div>
    </div>
  );
}