import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CreditCard, 
  Check, 
  Zap,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function Billing() {
  const [user, setUser] = useState(null);
  const [firm, setFirm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const firms = await base44.entities.Firm.filter({ created_by: currentUser.email });
      if (firms.length > 0) {
        setFirm(firms[0]);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      description: 'Perfect for solo practitioners',
      features: [
        'Up to 50 intakes/month',
        'AI summaries & urgency flags',
        'Email notifications',
        'Custom intake form'
      ],
      current: firm?.subscription_plan === 'starter'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 59,
      description: 'For growing firms',
      features: [
        'Unlimited intakes',
        'AI summaries & urgency flags',
        'Priority email notifications',
        'Internal notes',
        'Multiple notification emails'
      ],
      popular: true,
      current: firm?.subscription_plan === 'professional'
    },
    {
      id: 'early_adopter',
      name: 'Early Adopter',
      price: 39,
      originalPrice: 59,
      description: 'Limited time offer',
      features: [
        'All Professional features',
        'Lock in this rate forever',
        'Priority feature requests',
        'Direct founder access'
      ],
      highlight: true,
      current: firm?.subscription_plan === 'early_adopter'
    }
  ];

  const currentPlan = plans.find(p => p.current) || { name: 'Free Trial', price: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 bg-clip-text text-transparent">Billing & Subscription</h1>
          <p className="text-blue-600/70 mt-2">Manage your plan and billing information</p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Current Plan
                </CardTitle>
                <CardDescription className="text-blue-600/70">Your active subscription</CardDescription>
              </div>
              {currentPlan.price > 0 && (
                <Button variant="outline" className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50 shadow-sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-2xl font-bold text-blue-700">
                  {currentPlan.name === 'Free Trial' ? '🎁' : '⚡'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900">{currentPlan.name}</h3>
                <p className="text-blue-700">
                  {currentPlan.price === 0 
                    ? '14-day free trial' 
                    : `$${currentPlan.price}/month`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative bg-white/80 backdrop-blur-sm shadow-lg ${
                plan.popular ? 'border-2 border-blue-500 shadow-blue-500/30' : 
                plan.highlight ? 'border-2 border-amber-400 bg-amber-50/80 shadow-amber-500/30' : 'border-blue-200 shadow-blue-500/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  Most Popular
                </div>
              )}
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-400 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                  <Zap className="w-3 h-3" />
                  Limited Offer
                </div>
              )}
              <CardHeader className="pt-6">
                <CardTitle className="text-lg text-blue-900">{plan.name}</CardTitle>
                <CardDescription className="text-blue-600/70">{plan.description}</CardDescription>
                <div className="pt-2">
                  {plan.originalPrice && (
                    <span className="text-lg line-through text-blue-400 mr-2">
                      ${plan.originalPrice}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-blue-900">
                    ${plan.price}
                  </span>
                  <span className="text-blue-600/70">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.highlight ? 'text-amber-600' : 'text-green-600'
                      }`} />
                      <span className="text-blue-800">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.current 
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-100 cursor-default' 
                      : plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/40' 
                        : plan.highlight
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white shadow-lg shadow-amber-500/40'
                          : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/40'
                  }`}
                  variant={plan.current ? 'outline' : 'default'}
                  disabled={plan.current}
                >
                  {plan.current ? (
                    'Current Plan'
                  ) : (
                    <>
                      Upgrade
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Billing FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How does the free trial work?',
                a: 'You get 14 days of full access to all features. No credit card required to start.'
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your subscription at any time. Your access continues until the end of your billing period.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards through Stripe, our secure payment processor.'
              },
              {
                q: 'Will I lose my data if I cancel?',
                a: 'Your data is retained for 30 days after cancellation, giving you time to export or reactivate.'
              }
            ].map((faq, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg shadow-blue-500/10">
                <CardContent className="pt-4">
                  <h3 className="font-medium text-blue-900 mb-1">{faq.q}</h3>
                  <p className="text-sm text-blue-700">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}