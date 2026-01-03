import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { Check, FileText, ArrowLeft, Zap } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: 29,
      description: "Perfect for solo practitioners",
      features: [
        "Up to 50 intakes/month",
        "AI summaries & urgency flags",
        "Email notifications",
        "Custom intake form",
        "File uploads",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false,
      highlight: false
    },
    {
      name: "Professional",
      price: 59,
      description: "For growing firms",
      features: [
        "Unlimited intakes",
        "AI summaries & urgency flags",
        "Priority email notifications",
        "Custom intake form",
        "File uploads",
        "Internal notes",
        "Priority support",
        "Multiple notification emails"
      ],
      cta: "Start Free Trial",
      popular: true,
      highlight: false
    },
    {
      name: "Early Adopter",
      price: 39,
      originalPrice: 59,
      description: "Limited time offer",
      features: [
        "All Professional features",
        "Lock in this rate forever",
        "Priority feature requests",
        "Direct founder access",
        "Only 50 spots available"
      ],
      cta: "Claim Your Spot",
      popular: false,
      highlight: true
    }
  ];

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

      {/* Header */}
      <section className="py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Start with a 14-day free trial. No credit card required. Cancel anytime.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-slate-900 text-white shadow-xl scale-105' 
                  : plan.highlight 
                    ? 'bg-amber-50 border-2 border-amber-300' 
                    : 'bg-white border border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-4 py-1 rounded-full text-sm font-medium shadow-md">
                  Most Popular
                </div>
              )}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Limited Offer
                </div>
              )}
              
              <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                {plan.description}
              </p>
              
              <div className="mb-6">
                {plan.originalPrice && (
                  <span className="text-lg line-through text-slate-400 mr-2">${plan.originalPrice}</span>
                )}
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  ${plan.price}
                </span>
                <span className={`text-base ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 ${
                      plan.popular ? 'text-green-400' : plan.highlight ? 'text-amber-600' : 'text-green-500'
                    }`} />
                    <span className={`text-sm ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to={createPageUrl('Dashboard')}>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-white text-slate-900 hover:bg-slate-100' 
                      : plan.highlight
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "What happens after my free trial?",
                a: "After 14 days, you'll be prompted to choose a plan. Your data is preserved, and you can continue right where you left off."
              },
              {
                q: "Can I change plans later?",
                a: "Yes, you can upgrade or downgrade at any time. Changes take effect on your next billing cycle."
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use industry-standard encryption, and your client data is never sold or shared with third parties."
              },
              {
                q: "Do you offer annual billing?",
                a: "Not yet, but we're working on it. Early Adopters will get priority access to annual discounts."
              },
              {
                q: "What if I need to cancel?",
                a: "You can cancel anytime from your billing settings. No questions asked."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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