import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function CalendarEventDialog({ intake, open, onOpenChange }) {
  const [loading, setLoading] = useState(false);
  const [createdEventLink, setCreatedEventLink] = useState(null);
  const [formData, setFormData] = useState({
    event_type: 'consultation',
    date: '',
    time: '09:00',
    duration_minutes: 60,
    notes: ''
  });

  const handleCreate = async () => {
    if (!formData.date || !formData.time) {
      toast.error('Please select date and time');
      return;
    }

    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('createCalendarEvent', {
        intake_id: intake.id,
        ...formData
      });

      if (data.success) {
        setCreatedEventLink(data.event.htmlLink);
        toast.success('Calendar event created successfully!');
        
        // Reset form after short delay
        setTimeout(() => {
          setFormData({
            event_type: 'consultation',
            date: '',
            time: '09:00',
            duration_minutes: 60,
            notes: ''
          });
          setCreatedEventLink(null);
          onOpenChange(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Calendar event error:', error);
      toast.error('Failed to create calendar event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Create Calendar Event
          </DialogTitle>
          <DialogDescription>
            Schedule a calendar event with {intake?.client_name}
          </DialogDescription>
        </DialogHeader>

        {createdEventLink ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Event Created!</h3>
            <p className="text-sm text-slate-600 mb-4">
              Calendar invitation has been sent to {intake?.client_email}
            </p>
            <a href={createdEventLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View in Google Calendar
              </Button>
            </a>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="event_type">Event Type</Label>
              <Select 
                value={formData.event_type}
                onValueChange={(value) => setFormData({ ...formData, event_type: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Initial Consultation</SelectItem>
                  <SelectItem value="followup">Follow-up Meeting</SelectItem>
                  <SelectItem value="deadline">Deadline Reminder</SelectItem>
                  <SelectItem value="meeting">General Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Select 
                value={formData.duration_minutes.toString()}
                onValueChange={(value) => setFormData({ ...formData, duration_minutes: parseInt(value) })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes for the event..."
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {!createdEventLink && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              Create Event
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}