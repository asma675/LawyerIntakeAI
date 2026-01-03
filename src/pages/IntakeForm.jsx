import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';

const DEFAULT_PRACTICE_AREAS = [
  "Family Law",
  "Employment Law",
  "Real Estate",
  "Personal Injury",
  "Criminal Defence",
  "Immigration",
  "Corporate/Commercial",
  "Wills & Estates",
  "Civil Litigation",
  "Other"
];

export default function IntakeForm() {
  const [firm, setFirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    practice_area: '',
    issue_description: '',
    timeline: '',
    deadline_date: '',
    deadline_description: '',
    file_urls: [],
    consent_given: false
  });

  const firmSlug = new URLSearchParams(window.location.search).get('firm');

  useEffect(() => {
    loadFirm();
  }, []);

  const loadFirm = async () => {
    try {
      if (!firmSlug) {
        setError('No firm specified. Please use a valid intake link.');
        setLoading(false);
        return;
      }
      
      const firms = await base44.entities.Firm.filter({ slug: firmSlug });
      if (firms.length === 0) {
        setError('Firm not found. Please check your intake link.');
        setLoading(false);
        return;
      }
      
      setFirm(firms[0]);
    } catch (err) {
      setError('Unable to load intake form. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingFiles(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push(file_url);
      }
      setFormData(prev => ({
        ...prev,
        file_urls: [...prev.file_urls, ...uploadedUrls]
      }));
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploadingFiles(false);
    }
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      file_urls: prev.file_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.consent_given) {
      alert('Please acknowledge the disclaimer to proceed.');
      return;
    }

    setSubmitting(true);
    try {
      const newIntake = await base44.entities.Intake.create({
        ...formData,
        firm_id: firm.id,
        status: 'new'
      });
      
      // Process with AI in background (don't wait)
      base44.functions.invoke('processIntake', { intake_id: newIntake.id }).catch(() => {});
      
      setSubmitted(true);
    } catch (err) {
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Unable to Load Form</h2>
            <p className="text-slate-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">Submission Received</h2>
            <p className="text-slate-600 mb-6">
              Thank you for contacting {firm.name}. Your information has been securely submitted and will be reviewed shortly.
            </p>
            <p className="text-sm text-slate-500">
              A member of our team will be in touch with you soon.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const practiceAreas = firm.practice_areas?.length > 0 ? firm.practice_areas : DEFAULT_PRACTICE_AREAS;
  const enabledFields = firm.enabled_fields || { phone: true, timeline: true, deadline: true, files: true };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {firm.logo_url ? (
            <img 
              src={firm.logo_url} 
              alt={firm.name} 
              className="h-16 mx-auto mb-4 object-contain"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{firm.name}</h1>
          <p className="text-slate-600">Client Intake Form</p>
        </div>

        {/* Intro Text */}
        {firm.intro_text && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-slate-600">{firm.intro_text}</p>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Contact Information</h3>
                
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="Your full name"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="mt-1"
                  />
                </div>

                {enabledFields.phone && (
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      placeholder="(xxx) xxx-xxxx"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              {/* Legal Matter */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-slate-900">About Your Matter</h3>

                <div>
                  <Label htmlFor="practice_area">Area of Law *</Label>
                  <Select 
                    value={formData.practice_area}
                    onValueChange={(value) => setFormData({ ...formData, practice_area: value })}
                    required
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select an area" />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceAreas.map((area) => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description of Your Issue *</Label>
                  <Textarea
                    id="description"
                    value={formData.issue_description}
                    onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
                    placeholder="Please describe your legal situation in as much detail as you're comfortable sharing..."
                    rows={5}
                    required
                    className="mt-1"
                  />
                </div>

                {enabledFields.timeline && (
                  <div>
                    <Label htmlFor="timeline">How urgent is this matter?</Label>
                    <Select 
                      value={formData.timeline}
                      onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate - Urgent, need help ASAP</SelectItem>
                        <SelectItem value="soon">Soon - Within the next few weeks</SelectItem>
                        <SelectItem value="no_rush">No Rush - Just exploring options</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {enabledFields.deadline && (
                  <>
                    <div>
                      <Label htmlFor="deadline_date">Do you have any upcoming deadlines or court dates?</Label>
                      <Input
                        id="deadline_date"
                        type="date"
                        value={formData.deadline_date}
                        onChange={(e) => setFormData({ ...formData, deadline_date: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline_description">Details about deadlines (optional)</Label>
                      <Textarea
                        id="deadline_description"
                        value={formData.deadline_description}
                        onChange={(e) => setFormData({ ...formData, deadline_description: e.target.value })}
                        placeholder="Any other information about dates or deadlines..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* File Uploads */}
              {enabledFields.files && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-slate-900">Documents (Optional)</h3>
                  <p className="text-sm text-slate-600">
                    Upload any relevant documents (contracts, court papers, correspondence, etc.)
                  </p>

                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {uploadingFiles ? (
                        <Loader2 className="w-8 h-8 mx-auto text-slate-400 animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 mx-auto text-slate-400" />
                      )}
                      <p className="mt-2 text-sm text-slate-600">
                        {uploadingFiles ? 'Uploading...' : 'Click to upload files'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PDF, DOC, JPG, PNG up to 10MB each
                      </p>
                    </label>
                  </div>

                  {formData.file_urls.length > 0 && (
                    <div className="space-y-2">
                      {formData.file_urls.map((url, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-100 rounded-lg px-4 py-2">
                          <span className="text-sm text-slate-600 truncate">
                            Document {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Consent */}
              <div className="pt-4 border-t">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-amber-800">
                    <strong>Important:</strong> Submitting this form does not create a lawyer-client relationship. 
                    This form does not provide legal advice. An intake team member will review your submission 
                    and contact you to discuss whether the firm can assist with your matter.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={formData.consent_given}
                    onCheckedChange={(checked) => setFormData({ ...formData, consent_given: checked })}
                    className="mt-1"
                  />
                  <Label htmlFor="consent" className="text-sm text-slate-600 cursor-pointer">
                    I understand that submitting this form does not establish a lawyer-client relationship 
                    and that I am not receiving legal advice through this form. *
                  </Label>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-slate-900 hover:bg-slate-800"
                disabled={submitting || !formData.consent_given}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Intake Form'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Powered by Ontario Intake AI • Your information is secure and confidential
        </p>
      </div>
    </div>
  );
}