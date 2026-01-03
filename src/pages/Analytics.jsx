import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  AlertTriangle,
  FileText,
  CheckCircle2
} from 'lucide-react';

export default function Analytics() {
  const [user, setUser] = useState(null);
  const [firm, setFirm] = useState(null);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadUserAndFirm();
  }, []);

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

  const { data: intakes = [], isLoading } = useQuery({
    queryKey: ['intakes-analytics', firm?.id, timeRange],
    queryFn: () => firm ? base44.entities.Intake.filter({ firm_id: firm.id }, '-created_date') : [],
    enabled: !!firm
  });

  if (!user || !firm) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </div>
    );
  }

  // Filter by time range
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
  const filteredIntakes = intakes.filter(i => new Date(i.created_date) >= cutoffDate);

  // Calculate metrics
  const totalIntakes = filteredIntakes.length;
  const urgentIntakes = filteredIntakes.filter(i => i.ai_urgency === 'high' || i.status === 'urgent').length;
  const reviewedIntakes = filteredIntakes.filter(i => i.status === 'reviewed' || i.status === 'archived').length;
  const responseRate = totalIntakes > 0 ? Math.round((reviewedIntakes / totalIntakes) * 100) : 0;

  // Practice area distribution
  const practiceAreaData = filteredIntakes.reduce((acc, intake) => {
    const area = intake.ai_practice_area || intake.practice_area || 'Unknown';
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {});
  const practiceAreaChart = Object.entries(practiceAreaData).map(([name, value]) => ({ name, value }));

  // Urgency distribution
  const urgencyData = [
    { name: 'High', value: filteredIntakes.filter(i => i.ai_urgency === 'high').length, color: '#dc2626' },
    { name: 'Medium', value: filteredIntakes.filter(i => i.ai_urgency === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: filteredIntakes.filter(i => i.ai_urgency === 'low').length, color: '#10b981' }
  ].filter(d => d.value > 0);

  // Intake timeline (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });
  const timelineData = last7Days.map(date => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    intakes: filteredIntakes.filter(i => i.created_date.split('T')[0] === date).length
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
            <p className="text-slate-600 mt-1">Intake performance and insights</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Intakes</CardTitle>
                  <FileText className="w-4 h-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{totalIntakes}</div>
                  <p className="text-xs text-slate-500 mt-1">Submissions received</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Urgent Matters</CardTitle>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{urgentIntakes}</div>
                  <p className="text-xs text-slate-500 mt-1">High urgency flagged</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Response Rate</CardTitle>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{responseRate}%</div>
                  <p className="text-xs text-slate-500 mt-1">Intakes reviewed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Avg. Per Day</CardTitle>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">
                    {(totalIntakes / parseInt(timeRange)).toFixed(1)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Daily intake rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Intake Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Intake Volume (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="intakes" stroke="#0f172a" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Urgency Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Urgency Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={urgencyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {urgencyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Practice Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Intakes by Practice Area</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={practiceAreaChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0f172a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* No Data State */}
            {totalIntakes === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Data Yet</h3>
                <p className="text-slate-600">
                  Analytics will appear here once you start receiving intakes.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}