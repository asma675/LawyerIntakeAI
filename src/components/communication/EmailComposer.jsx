import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Sparkles, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailComposer({ intake, onEmailSent }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [drafting, setDrafting] = useState(false);

  const draftWithAI = async () => {
    setDrafting(true);
    try {
      const prompt = `Draft a professional email response to this client inquiry:

Client: ${intake.client_name}
Practice Area: ${intake.ai_practice_area || intake.practice_area}
Issue: ${intake.issue_description}

AI Summary: ${intake.ai_summary || 'Not available'}

Write a professional, empathetic email that:
1. Acknowledges their inquiry
2. Mentions you've reviewed their matter
3. Suggests next steps (consultation, document review, etc.)
4. Maintains a professional but warm tone
5. Does not provide legal advice

Format as plain text suitable for email.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            body: { type: "string" }
          }
        }
      });

      setSubject(result.subject);
      setBody(result.body);
      toast.success('Draft generated! Feel free to edit before sending.');
    } catch (err) {
      console.error('Error drafting email:', err);
      toast.error('Failed to generate draft');
    } finally {
      setDrafting(false);
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error('Subject and body are required');
      return;
    }

    setSending(true);
    try {
      await base44.functions.invoke('sendClientEmail', {
        intake_id: intake.id,
        subject: subject,
        body: body,
        recipient: intake.client_email
      });

      toast.success('Email sent successfully!');
      setSubject('');
      setBody('');
      onEmailSent?.();
    } catch (err) {
      console.error('Error sending email:', err);
      toast.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Mail className="w-5 h-5 text-blue-600" />
          Compose Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-blue-800 mb-1 block">To</label>
          <Input 
            value={intake.client_email} 
            disabled 
            className="bg-blue-50 border-blue-200 text-blue-900"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-blue-800 mb-1 block">Subject</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
            className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-blue-800 mb-1 block">Message</label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            rows={8}
            className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={draftWithAI}
            disabled={drafting || sending}
            variant="outline"
            className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50"
          >
            {drafting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Draft with AI
          </Button>

          <Button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !body.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/40"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}