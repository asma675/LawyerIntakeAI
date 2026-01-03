import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, MapPin, ExternalLink } from 'lucide-react';
import { format, isFuture, isPast } from 'date-fns';
import { Button } from "@/components/ui/button";

export default function AppointmentsList({ appointments }) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-blue-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-blue-900 mb-2">No Scheduled Appointments</h3>
        <p className="text-blue-700">
          Calendar events with this client will appear here.
        </p>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(apt => isFuture(new Date(apt.start)));
  const pastAppointments = appointments.filter(apt => isPast(new Date(apt.start)));

  return (
    <div className="space-y-6">
      {upcomingAppointments.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-blue-900 mb-3">Upcoming</h3>
          <div className="space-y-3">
            {upcomingAppointments.map((apt, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/10">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900">{apt.summary}</h4>
                        <p className="text-xs text-blue-600/70 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(apt.start), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                      Upcoming
                    </Badge>
                  </div>

                  {apt.description && (
                    <p className="text-sm text-blue-800 mt-2">{apt.description}</p>
                  )}

                  {apt.location && (
                    <p className="text-xs text-blue-600/70 flex items-center gap-1 mt-2">
                      {apt.location.includes('http') ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <MapPin className="w-3 h-3" />
                      )}
                      {apt.location}
                    </p>
                  )}

                  {apt.htmlLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 border-blue-300 bg-white text-blue-700 hover:bg-blue-50"
                      onClick={() => window.open(apt.htmlLink, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      View in Calendar
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastAppointments.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-blue-900 mb-3">Past</h3>
          <div className="space-y-3">
            {pastAppointments.map((apt, idx) => (
              <Card key={idx} className="bg-white/60 backdrop-blur-sm border-blue-200 shadow-sm opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <div>
                        <h4 className="font-medium text-blue-800">{apt.summary}</h4>
                        <p className="text-xs text-blue-600/70">
                          {format(new Date(apt.start), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-slate-100 text-slate-600 border-slate-300">
                      Completed
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}