import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, AlertTriangle, Clock, Sparkles, Tag, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function IntakeCard({ intake }) {
  const urgencyConfig = {
    high: { color: 'bg-red-50 text-red-700 border-red-300', icon: AlertTriangle, glow: 'shadow-red-500/30' },
    medium: { color: 'bg-amber-50 text-amber-700 border-amber-300', icon: Clock, glow: 'shadow-amber-500/30' },
    low: { color: 'bg-green-50 text-green-700 border-green-300', icon: Clock, glow: 'shadow-green-500/30' }
  };

  const statusConfig = {
    new: { color: 'bg-blue-50 text-blue-700 border-blue-300' },
    urgent: { color: 'bg-red-100 text-red-800 border-red-400' },
    reviewed: { color: 'bg-green-50 text-green-700 border-green-300' },
    archived: { color: 'bg-slate-50 text-slate-600 border-slate-300' }
  };

  const urgency = urgencyConfig[intake.ai_urgency] || urgencyConfig.medium;
  const status = statusConfig[intake.status] || statusConfig.new;
  const UrgencyIcon = urgency.icon;

  return (
    <Link to={createPageUrl('IntakeDetail') + `?id=${intake.id}`}>
      <Card className={`hover:shadow-xl transition-all cursor-pointer bg-white border-blue-200 hover:border-blue-400 hover:scale-[1.02] ${urgency.glow}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-blue-300">
                <User className="w-5 h-5 text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-blue-900 text-sm truncate">
                  {intake.client_name}
                </h3>
                <p className="text-xs text-blue-600/70 truncate">{intake.client_email}</p>
              </div>
            </div>
          </div>

          {intake.ai_summary && (
            <p className="text-sm text-blue-800 mb-3 line-clamp-2 leading-relaxed">
              {intake.ai_summary}
            </p>
          )}

          {(intake.assigned_to || intake.tags?.length > 0 || intake.lead_score) && (
            <div className="space-y-1 mb-3 text-xs">
              {intake.assigned_to && (
                <div className="flex items-center gap-1 text-blue-700">
                  <User className="w-3 h-3" />
                  <span>{intake.assigned_to.split('@')[0]}</span>
                </div>
              )}
              {intake.tags?.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <Tag className="w-3 h-3 text-blue-600" />
                  {intake.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                      {tag}
                    </span>
                  ))}
                  {intake.tags.length > 2 && (
                    <span className="text-blue-600">+{intake.tags.length - 2}</span>
                  )}
                </div>
              )}
              {intake.lead_score && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-amber-500" />
                  <span className="text-blue-700">Score: {intake.lead_score}%</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className={`${status.color} border`}>
              {intake.status}
            </Badge>
            {intake.ai_urgency && (
              <Badge className={`${urgency.color} border`}>
                <UrgencyIcon className="w-3 h-3 mr-1" />
                {intake.ai_urgency}
              </Badge>
            )}
            {intake.ai_practice_area && (
              <Badge className="bg-purple-50 text-purple-700 border-purple-300">
                {intake.ai_practice_area}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-blue-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(intake.created_date), { addSuffix: true })}
            </p>
            {intake.ai_summary && (
              <Sparkles className="w-3 h-3 text-blue-600" />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}