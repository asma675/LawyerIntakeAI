import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { FileText, ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl('Landing')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-lg">Ontario Intake AI</span>
          </Link>
          <Link to={createPageUrl('Landing')}>
            <Button variant="ghost" className="text-slate-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Use</h1>
        <p className="text-slate-600 mb-12">Last updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing or using Ontario Intake AI ("the Service"), you agree to be bound by these Terms of Use. If you do not agree to these terms, you may not use the Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
            <p className="text-slate-600 leading-relaxed">
              Ontario Intake AI is an operational tool designed to help law firms manage client intake processes. The Service includes intake form hosting, AI-powered summarization and classification, notification delivery, and related administrative features.
            </p>
          </section>

          <section className="mb-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. No Legal Advice Disclaimer</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>IMPORTANT:</strong> Ontario Intake AI is NOT a legal service and does NOT provide legal advice. The Service is an administrative tool only.
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>AI-generated summaries are for administrative convenience only and should not be relied upon as legal analysis</li>
              <li>Urgency classifications are based on stated information only and do not constitute legal assessment of deadlines</li>
              <li>Practice area classifications are suggestions only and may not be accurate</li>
              <li>All legal decisions, advice, and professional judgments remain solely the responsibility of licensed legal professionals</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. User Responsibilities</h2>
            <p className="text-slate-600 leading-relaxed mb-4">As a user of the Service, you agree to:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the Service only for lawful purposes</li>
              <li>Ensure compliance with applicable professional conduct rules and privacy laws</li>
              <li>Verify all AI-generated summaries and classifications before relying on them</li>
              <li>Maintain appropriate client confidentiality practices</li>
              <li>Not use the Service to provide unauthorized legal services</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Data and Privacy</h2>
            <p className="text-slate-600 leading-relaxed">
              Your use of the Service is also governed by our Privacy Policy. You acknowledge that client data submitted through intake forms is processed by our systems, including AI analysis, for the purposes described in our Privacy Policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Subscription and Payment</h2>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Paid subscriptions are billed monthly in advance</li>
              <li>You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period</li>
              <li>Refunds are provided at our sole discretion</li>
              <li>We reserve the right to modify pricing with 30 days notice</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed">
              The Service, including its design, features, and content (excluding user-submitted data), is owned by Ontario Intake AI. You retain ownership of all data you submit to the Service.
            </p>
          </section>

          <section className="mb-12 bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>The Service is provided "as is" without warranties of any kind</li>
              <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages</li>
              <li>We are not liable for any missed deadlines, lost clients, or professional liability arising from use of or reliance on the Service</li>
              <li>Our total liability is limited to the amount you paid for the Service in the 12 months preceding the claim</li>
              <li>You are solely responsible for all legal and professional decisions made using information from the Service</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Indemnification</h2>
            <p className="text-slate-600 leading-relaxed">
              You agree to indemnify and hold harmless Ontario Intake AI from any claims, damages, or expenses arising from your use of the Service, violation of these Terms, or infringement of any rights of third parties.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Termination</h2>
            <p className="text-slate-600 leading-relaxed">
              We may suspend or terminate your access to the Service at any time for violation of these Terms or for any other reason. Upon termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Changes to Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the modified Terms. We will provide notice of material changes via email or through the Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms are governed by the laws of the Province of Ontario, Canada. Any disputes arising from these Terms or the Service shall be resolved in the courts of Ontario.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              For questions about these Terms, please contact us at:
              <br /><br />
              <strong>Email:</strong> legal@ontariointakeai.com
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">Ontario Intake AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link to={createPageUrl('Privacy')} className="hover:text-slate-900">Privacy Policy</Link>
            <Link to={createPageUrl('Terms')} className="hover:text-slate-900 font-medium">Terms of Use</Link>
            <a href="mailto:info@ontariointakeai.com" className="hover:text-slate-900">Contact</a>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Ontario Intake AI
          </p>
        </div>
      </footer>
    </div>
  );
}