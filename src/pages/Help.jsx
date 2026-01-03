import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search, 
  Book, 
  Mail, 
  FileText, 
  Settings, 
  Zap,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      icon: Zap,
      title: 'Getting Started',
      color: 'text-blue-600 bg-blue-100',
      items: [
        {
          q: 'How do I share my intake form with clients?',
          a: 'Go to Settings → Intake Form to find your unique intake URL. Copy it and share on your website, email signature, or social media. The URL format is yourfirm.ontariointakeai.com/intake'
        },
        {
          q: 'How does AI analysis work?',
          a: 'Our AI reads each submission and creates a plain-English summary, classifies the practice area, assesses urgency based on deadlines mentioned, and suggests generic next steps. This is administrative analysis only - not legal advice.'
        },
        {
          q: 'What happens when someone submits the form?',
          a: 'The intake appears instantly on your Dashboard. If it\'s flagged as urgent or contains a conflict of interest, you\'ll receive an email notification (if enabled in Settings).'
        }
      ]
    },
    {
      icon: FileText,
      title: 'Managing Intakes',
      color: 'text-green-600 bg-green-100',
      items: [
        {
          q: 'How do I change an intake\'s status?',
          a: 'Open the intake and use the action buttons to mark it as Reviewed, Urgent, or Archived. You can also drag intakes between columns on the Dashboard kanban board.'
        },
        {
          q: 'Can I add private notes to an intake?',
          a: 'Yes. Open any intake and scroll to the Internal Notes section. These notes are private and never visible to clients.'
        },
        {
          q: 'How do I schedule a consultation from an intake?',
          a: 'Open the intake details page and click "Schedule Event" in the Actions section. This creates a Google Calendar event and sends an invitation to the client.'
        },
        {
          q: 'Can I export intake data?',
          a: 'Currently, you can copy summaries to your clipboard. Bulk export features are coming soon. Contact support if you need CSV export assistance.'
        }
      ]
    },
    {
      icon: Settings,
      title: 'Configuration',
      color: 'text-purple-600 bg-purple-100',
      items: [
        {
          q: 'How do I customize my intake form?',
          a: 'Go to Settings → Intake Form. You can customize the welcome message, select which fields to show (phone, timeline, deadline, file uploads), and add your firm logo.'
        },
        {
          q: 'How do I add practice areas?',
          a: 'In Settings → Firm Information, you can add or remove practice areas. These appear as options on your intake form.'
        },
        {
          q: 'Can I customize the email response template?',
          a: 'Yes. Go to Settings → Firm Information and edit the Email Response Template. The AI uses this template when drafting initial responses to clients.'
        },
        {
          q: 'How do notification emails work?',
          a: 'In Settings → Notifications, add email addresses that should receive alerts. You can choose to be notified for all intakes or only urgent ones.'
        }
      ]
    },
    {
      icon: Book,
      title: 'AI Features',
      color: 'text-amber-600 bg-amber-100',
      items: [
        {
          q: 'What is sentiment analysis?',
          a: 'The AI analyzes the client\'s tone to assess their emotional state (calm, concerned, frustrated, or urgent). This helps prioritize responses for clients who may be distressed.'
        },
        {
          q: 'How does conflict checking work?',
          a: 'The AI scans the intake description for mentions of other parties and compares them against your firm\'s existing clients list (configured in Settings). It flags potential conflicts for manual review.'
        },
        {
          q: 'What is the draft email feature?',
          a: 'Based on the intake details and your firm\'s template, the AI generates a professional initial response email. You can copy and customize it before sending to the client.'
        },
        {
          q: 'Is the AI providing legal advice?',
          a: 'No. The AI is an administrative tool that summarizes information and suggests generic next steps. All legal decisions and advice remain the responsibility of licensed lawyers.'
        }
      ]
    }
  ];

  const filteredSections = searchQuery
    ? sections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.items.length > 0)
    : sections;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 bg-clip-text text-transparent mb-4">Help & Documentation</h1>
          <p className="text-blue-600/70 max-w-2xl mx-auto mb-8">
            Everything you need to know about using Ontario Intake AI
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
            <Input
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white border-blue-200 text-blue-900 placeholder:text-blue-400 focus:border-blue-400 focus:ring-blue-500/20 shadow-sm"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-xl hover:shadow-blue-500/20 transition-all cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900 mb-1">Quick Start Guide</h3>
              <p className="text-sm text-blue-700">Get up and running in 5 minutes</p>
            </CardContent>
          </Card>

          <a href="mailto:support@ontariointakeai.com">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-xl hover:shadow-green-500/20 transition-all cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Contact Support</h3>
                <p className="text-sm text-blue-700">Get help from our team</p>
              </CardContent>
            </Card>
          </a>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-xl hover:shadow-purple-500/20 transition-all cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-blue-900 mb-1">Feature Requests</h3>
              <p className="text-sm text-blue-700">Suggest improvements</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Sections */}
        {filteredSections.map((section, idx) => (
          <Card key={idx} className="mb-6 bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <div className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center shadow-inner`}>
                  <section.icon className="w-5 h-5" />
                </div>
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {section.items.map((item, itemIdx) => (
                  <AccordionItem key={itemIdx} value={`item-${idx}-${itemIdx}`}>
                    <AccordionTrigger className="text-left text-blue-900">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-blue-700">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {searchQuery && filteredSections.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-blue-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">No Results Found</h3>
            <p className="text-blue-700 mb-4">
              Try different keywords or contact support for assistance.
            </p>
            <a href="mailto:support@ontariointakeai.com">
              <Button variant="outline" className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50 shadow-sm">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </a>
          </div>
        )}

        {/* Contact Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-500 text-white mt-12 shadow-lg shadow-blue-500/40 border-0">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 shadow-inner">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
                <p className="text-blue-100 mb-4">
                  Our support team is here to help you get the most out of Ontario Intake AI.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="mailto:support@ontariointakeai.com">
                    <Button className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Support
                    </Button>
                  </a>
                  <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}