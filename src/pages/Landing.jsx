import { } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { 
  Clock, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  AlertTriangle,
  FileText,
  Bell,
  BarChart3
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-blue-100 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-blue-900 text-lg">Ontario Intake AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to={createPageUrl('Pricing')} className="text-blue-700 hover:text-blue-900 text-sm font-medium transition-colors">
              Pricing
            </Link>
            <Link to={createPageUrl('Privacy')} className="text-blue-700 hover:text-blue-900 text-sm font-medium transition-colors">
              Privacy
            </Link>
            <Link to={createPageUrl('Terms')} className="text-blue-700 hover:text-blue-900 text-sm font-medium transition-colors">
              Terms
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" className="text-blue-700 hover:text-blue-900 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
            <Link to={createPageUrl('Dashboard')}>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-blue-200 shadow-sm">
            <Zap className="w-4 h-4" />
            Built for Ontario Law Firms
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              AI-Powered Client Intake
            </span>
            <span className="block text-blue-900 mt-2">That Never Misses a Lead</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-700/80 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Capture, triage, and prioritize potential clients 24/7. Intelligent summaries and urgency detection help your firm respond faster to the matters that need you most.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 h-14 text-lg font-semibold shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 transition-all">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Pricing')}>
              <Button size="lg" variant="outline" className="border-2 border-blue-300 bg-white/80 backdrop-blur-sm text-blue-700 hover:bg-blue-50 hover:border-blue-400 px-10 h-14 text-lg font-semibold shadow-lg">
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-blue-600/70 mt-6 font-medium">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">The Cost of Missed Opportunities</h2>
            <p className="text-lg text-blue-700/80 max-w-2xl mx-auto">
              Every day, Ontario law firms lose potential clients to slow response times and overwhelmed intake processes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-8 rounded-2xl border-2 border-red-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-3">Missed Urgent Cases</h3>
              <p className="text-red-800/80">
                Limitation periods don't wait. A buried email could mean a missed deadline and a lost client.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-8 rounded-2xl border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-3">Slow Response Times</h3>
              <p className="text-amber-800/80">
                Potential clients expect quick responses. Delays mean they'll call another firm.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <FileText className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Admin Overload</h3>
              <p className="text-blue-800/80">
                Staff spend hours triaging inquiries instead of supporting billable work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">How It Works</h2>
            <p className="text-lg text-blue-700/80 max-w-2xl mx-auto">
              Three simple steps to transform your client intake process.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/40">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Share Your Link</h3>
              <p className="text-blue-700/80">
                Get a branded intake form URL. Share it on your website, social media, or marketing materials.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/40">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">AI Analyzes Intakes</h3>
              <p className="text-blue-700/80">
                Our AI summarizes submissions, classifies practice areas, and flags urgent matters automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/40">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Respond Faster</h3>
              <p className="text-blue-700/80">
                Get instant notifications for urgent cases. Review summaries and take action in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Built for Law Firms</h2>
            <p className="text-lg text-blue-700/80 max-w-2xl mx-auto">
              Every feature designed with Ontario legal professionals in mind.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "AI Summaries", desc: "Instant plain-English summaries of every submission" },
              { icon: AlertTriangle, title: "Urgency Detection", desc: "Automatic flagging of time-sensitive matters" },
              { icon: Bell, title: "Instant Alerts", desc: "Email notifications for new and urgent intakes" },
              { icon: Shield, title: "Secure & Private", desc: "Your data stays yours. No selling. No sharing." },
              { icon: FileText, title: "Document Uploads", desc: "Clients can attach relevant documents securely" },
              { icon: BarChart3, title: "Practice Area Triage", desc: "Auto-classification by area of law" },
              { icon: CheckCircle, title: "Custom Forms", desc: "Tailor fields to your firm's needs" },
              { icon: Clock, title: "24/7 Availability", desc: "Capture leads even after hours" },
            ].map((feature, i) => (
              <div key={i} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200 shadow-md hover:shadow-xl hover:border-blue-300 transition-all">
                <feature.icon className="w-7 h-7 text-blue-600 mb-4" />
                <h3 className="font-bold text-blue-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-blue-700/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-blue-700/80 mb-12">
            Start free. Upgrade when you're ready.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white p-8 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-blue-900 mb-2 text-lg">Starter</h3>
              <div className="text-4xl font-bold text-blue-900 mb-2">$29<span className="text-lg font-normal text-blue-600">/mo</span></div>
              <p className="text-sm text-blue-700/80">Perfect for solo practitioners</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-8 rounded-2xl text-white shadow-xl shadow-blue-500/40 transform scale-105">
              <h3 className="font-bold mb-2 text-lg">Professional</h3>
              <div className="text-4xl font-bold mb-2">$59<span className="text-lg font-normal text-blue-100">/mo</span></div>
              <p className="text-sm text-blue-50">For growing firms</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl border-2 border-amber-300 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-amber-900 mb-2 text-lg">Early Adopter</h3>
              <div className="text-4xl font-bold text-amber-900 mb-2">$39<span className="text-lg font-normal text-amber-700">/mo</span></div>
              <p className="text-sm text-amber-800">Limited time offer</p>
            </div>
          </div>
          <Link to={createPageUrl('Pricing')}>
            <Button variant="outline" className="border-2 border-blue-300 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-lg">
              View Full Pricing Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-900 to-cyan-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-400/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-400/30 shadow-xl">
            <Shield className="w-8 h-8 text-blue-300" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Your Data. Your Clients. Your Control.</h2>
          <p className="text-blue-200 max-w-2xl mx-auto mb-10 text-lg">
            We take privacy seriously. Your client data is never sold or shared. AI is used only to help you—never to provide legal advice.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <span className="flex items-center gap-2 bg-blue-400/10 px-4 py-2 rounded-lg border border-blue-400/20">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-blue-100 font-medium">HTTPS Encrypted</span>
            </span>
            <span className="flex items-center gap-2 bg-blue-400/10 px-4 py-2 rounded-lg border border-blue-400/20">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-blue-100 font-medium">Data Stays in Canada</span>
            </span>
            <span className="flex items-center gap-2 bg-blue-400/10 px-4 py-2 rounded-lg border border-blue-400/20">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-blue-100 font-medium">No Legal Advice Provided</span>
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Ready to Streamline Your Intake?</h2>
          <p className="text-xl text-blue-700/80 mb-10">
            Join Ontario law firms already saving time and capturing more clients.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 h-14 text-lg font-semibold shadow-xl shadow-blue-500/40">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="mailto:info@ontariointakeai.com">
              <Button size="lg" variant="outline" className="border-2 border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-400 px-10 h-14 text-lg font-semibold shadow-lg">
                Request a Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-blue-900">Ontario Intake AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-blue-700">
              <Link to={createPageUrl('Privacy')} className="hover:text-blue-900 font-medium">Privacy Policy</Link>
              <Link to={createPageUrl('Terms')} className="hover:text-blue-900 font-medium">Terms of Use</Link>
              <a href="mailto:info@ontariointakeai.com" className="hover:text-blue-900 font-medium">Contact</a>
            </div>
            <p className="text-sm text-blue-600/70">
              © {new Date().getFullYear()} Ontario Intake AI. All rights reserved.
            </p>
          </div>
          <p className="text-xs text-blue-600/60 text-center mt-8 max-w-2xl mx-auto">
            Disclaimer: Ontario Intake AI is an operational tool for law firm administration. It does not provide legal advice. All legal decisions remain the responsibility of the licensed professionals using this platform.
          </p>
        </div>
      </footer>
    </div>
  );
}