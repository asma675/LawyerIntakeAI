import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { FileText, ArrowLeft } from 'lucide-react';

export default function Privacy() {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-600 mb-12">Last updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Introduction</h2>
            <p className="text-slate-600 leading-relaxed">
              Ontario Intake AI ("we", "our", or "us") is committed to protecting the privacy of law firms and their clients who use our platform. This Privacy Policy explains how we collect, use, and safeguard information when you use our client intake management service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Information We Collect</h2>
            <h3 className="text-lg font-medium text-slate-800 mb-3">From Law Firms (Our Users)</h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Account information (name, email, firm name)</li>
              <li>Billing information (processed securely through Stripe)</li>
              <li>Firm configuration preferences</li>
            </ul>
            
            <h3 className="text-lg font-medium text-slate-800 mb-3">From Intake Form Submissions (Your Clients)</h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Contact information provided in intake forms</li>
              <li>Legal matter descriptions</li>
              <li>Uploaded documents</li>
              <li>Any other information voluntarily submitted</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">How We Use Information</h2>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>To provide and maintain our intake management service</li>
              <li>To generate AI-powered summaries and urgency classifications</li>
              <li>To send notifications to law firms about new intakes</li>
              <li>To process payments and manage subscriptions</li>
              <li>To improve our services and user experience</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">AI Processing</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We use artificial intelligence to analyze intake submissions for the following purposes only:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
              <li>Creating plain-language summaries of submitted information</li>
              <li>Classifying the likely practice area</li>
              <li>Assessing urgency level based on stated deadlines and circumstances</li>
              <li>Suggesting generic administrative next steps</li>
            </ul>
            <p className="text-slate-600 leading-relaxed font-medium">
              Our AI does NOT provide legal advice, interpret law, or make legal recommendations.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Ownership</h2>
            <p className="text-slate-600 leading-relaxed">
              <strong>Your data belongs to you.</strong> All client intake data submitted through your firm's intake form remains the property of your law firm. We act as a data processor on your behalf.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Sharing</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We do NOT sell, rent, or share your data with third parties for marketing purposes. We may share data only:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>With service providers necessary to operate our platform (hosting, payment processing)</li>
              <li>When required by law or valid legal process</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Security</h2>
            <p className="text-slate-600 leading-relaxed">
              We implement industry-standard security measures including encryption in transit (HTTPS) and at rest, access controls, and regular security reviews. However, no system is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Retention</h2>
            <p className="text-slate-600 leading-relaxed">
              We retain intake data for as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Your Rights</h2>
            <p className="text-slate-600 leading-relaxed">
              You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at privacy@ontariointakeai.com.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Changes to This Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              For questions about this Privacy Policy or our data practices, please contact us at:
              <br /><br />
              <strong>Email:</strong> privacy@ontariointakeai.com
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
            <Link to={createPageUrl('Privacy')} className="hover:text-slate-900 font-medium">Privacy Policy</Link>
            <Link to={createPageUrl('Terms')} className="hover:text-slate-900">Terms of Use</Link>
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