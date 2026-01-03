import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, Inbox, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function EmailHistory({ emails }) {
  if (emails.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="w-12 h-12 text-blue-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-blue-900 mb-2">No Email History</h3>
        <p className="text-blue-700">
          Emails sent to this client will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {emails.map((email) => (
        <Card key={email.id} className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {email.direction === 'sent' ? (
                  <Send className="w-4 h-4 text-blue-600" />
                ) : (
                  <Inbox className="w-4 h-4 text-green-600" />
                )}
                <span className="text-sm font-medium text-blue-900">
                  {email.direction === 'sent' ? 'Sent to' : 'Received from'} {email.recipient}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {email.status === 'sent' && (
                  <Badge className="bg-green-50 text-green-700 border-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Sent
                  </Badge>
                )}
                {email.status === 'failed' && (
                  <Badge className="bg-red-50 text-red-700 border-red-300">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Failed
                  </Badge>
                )}
                <span className="text-xs text-blue-600/70">
                  {format(new Date(email.created_date), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            </div>

            <h4 className="font-semibold text-blue-900 mb-2">{email.subject}</h4>
            <p className="text-sm text-blue-800 whitespace-pre-wrap line-clamp-3">
              {email.body}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}