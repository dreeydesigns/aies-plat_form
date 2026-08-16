import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Mail, 
  Send, 
  Phone, 
  MapPin, 
  Users, 
  CreditCard, 
  ChevronRight, 
  X, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { doc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Institution, SchoolCode } from '../../types';

export type PipelineStage = 'prospect' | 'trial' | 'active' | 'past_due' | 'churned';
export type BillingCycle = 'termly' | 'annual';
export type PaymentMethod = 'invoice' | 'bank_transfer' | 'mpesa' | 'card';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type SubscriptionTierType = 'foundation' | 'standard' | 'premium';

export interface SchoolPipelineRecord {
  id: string;
  name: string;
  location: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  estimatedStudentCount: number;
  stage: PipelineStage;
  tier: SubscriptionTierType;
  has30DayTrial: boolean;
  trialExpiresAt?: string;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  schoolCode: string;
  principalInviteSent: boolean;
  principalInviteUrl?: string;
  lastActivity: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [pipeline, setPipeline] = useState<SchoolPipelineRecord[]>([]);
  const [loadingPipeline, setLoadingPipeline] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [inviteSentFor, setInviteSentFor] = useState<string | null>(null);

  // Subscribe to live Firestore institutions
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'institutions'), (snapshot) => {
      const records: SchoolPipelineRecord[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || 'Unnamed Institution',
          location: data.location || 'Not Specified',
          primaryContactName: data.primaryContactName || '',
          primaryContactEmail: data.primaryContactEmail || '',
          primaryContactPhone: data.primaryContactPhone || '',
          estimatedStudentCount: data.estimatedStudentCount || 0,
          stage: data.stage || 'active',
          tier: data.tier || 'standard',
          has30DayTrial: !!data.has30DayTrial,
          trialExpiresAt: data.trialExpiresAt,
          billingCycle: data.billingCycle || 'termly',
          paymentMethod: data.paymentMethod || 'invoice',
          paymentStatus: data.paymentStatus || 'pending',
          schoolCode: data.schoolCode || docSnap.id.replace('inst_', '').toUpperCase(),
          principalInviteSent: !!data.principalInviteSent,
          principalInviteUrl: data.principalInviteUrl,
          lastActivity: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : 'Recently',
          createdAt: data.createdAt || new Date().toISOString()
        };
      });
      setPipeline(records);
      setLoadingPipeline(false);
    }, (err) => {
      console.warn('Error fetching institutions:', err);
      setPipeline([]);
      setLoadingPipeline(false);
    });

    return () => unsub();
  }, []);

  // Add Institution Wizard State (Steps 1 to 5)
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: '',
    location: 'Nairobi, Kenya',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    estimatedStudentCount: 150,
    stage: 'prospect' as PipelineStage,
    tier: 'standard' as SubscriptionTierType,
    has30DayTrial: true,
    billingCycle: 'termly' as BillingCycle,
    paymentMethod: 'invoice' as PaymentMethod,
    paymentStatus: 'pending' as PaymentStatus,
    codeSuffix: ''
  });

  // Calculate Metrics
  const metrics = useMemo(() => {
    const totalSchools = pipeline.length;
    const activeSchools = pipeline.filter(s => s.stage === 'active').length;
    const trialSchools = pipeline.filter(s => s.stage === 'trial').length;
    const prospectSchools = pipeline.filter(s => s.stage === 'prospect').length;
    const totalStudents = pipeline.reduce((acc, s) => acc + s.estimatedStudentCount, 0);

    return {
      totalSchools,
      activeSchools,
      trialSchools,
      prospectSchools,
      totalStudents
    };
  }, [pipeline]);

  // Filtered Pipeline
  const filteredPipeline = useMemo(() => {
    return pipeline.filter(school => {
      const matchesStage = selectedStage === 'all' || school.stage === selectedStage;
      const matchesSearch = 
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.primaryContactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.schoolCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStage && matchesSearch;
    });
  }, [pipeline, selectedStage, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSendInvite = (school: SchoolPipelineRecord) => {
    setInviteSentFor(school.id);
    setPipeline(prev => prev.map(s => s.id === school.id ? { ...s, principalInviteSent: true } : s));
    setTimeout(() => setInviteSentFor(null), 3000);
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = formData.name.trim().substring(0, 5).toUpperCase().replace(/[^A-Z]/g, 'SCH');
    const suffix = formData.codeSuffix.trim() ? formData.codeSuffix.trim().toUpperCase() : Math.floor(100 + Math.random() * 900).toString();
    const schoolCode = 'AIES-' + prefix + '-' + suffix;
    const instId = 'inst_' + prefix.toLowerCase();
    const inviteUrl = 'https://aies-plat-form.vercel.app/?role=principal&school=' + schoolCode;

    const newRecord: SchoolPipelineRecord = {
      id: instId,
      name: formData.name,
      location: formData.location,
      primaryContactName: formData.primaryContactName,
      primaryContactEmail: formData.primaryContactEmail,
      primaryContactPhone: formData.primaryContactPhone,
      estimatedStudentCount: Number(formData.estimatedStudentCount) || 100,
      stage: formData.stage,
      tier: formData.tier,
      has30DayTrial: formData.has30DayTrial,
      trialExpiresAt: formData.has30DayTrial ? new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0] : undefined,
      billingCycle: formData.billingCycle,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      schoolCode,
      principalInviteSent: true,
      principalInviteUrl: inviteUrl,
      lastActivity: 'Just now',
      createdAt: new Date().toISOString()
    };

    setPipeline([newRecord, ...pipeline]);
    setIsAddModalOpen(false);
    setWizardStep(1);
    setFormData({
      name: '',
      location: 'Nairobi, Kenya',
      primaryContactName: '',
      primaryContactEmail: '',
      primaryContactPhone: '',
      estimatedStudentCount: 150,
      stage: 'prospect',
      tier: 'standard',
      has30DayTrial: true,
      billingCycle: 'termly',
      paymentMethod: 'invoice',
      paymentStatus: 'pending',
      codeSuffix: ''
    });
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 border border-purple-200">
            <TrendingUp className="w-3.5 h-3.5" />
            B2B Institutional CRM & Sales Engine
          </div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            School Onboarding & Sales Pipeline
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Manage institutional partner acquisition, termly billing cycles, 30-day trials, and Principal onboarding.
          </p>
        </div>

        <button
          onClick={() => { setIsAddModalOpen(true); setWizardStep(1); }}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all text-sm uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New School</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-neutral-400">Total Pipeline</p>
            <h3 className="text-3xl font-black text-neutral-900 mt-1">{metrics.totalSchools} Schools</h3>
          </div>
          <p className="text-[11px] text-purple-600 font-bold mt-3 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" /> {metrics.totalStudents} Est. Students Reached
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-neutral-400">Active Partners</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">{metrics.activeSchools}</h3>
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">Licensed termly subscriptions</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-neutral-400">Active 30-Day Trials</p>
            <h3 className="text-3xl font-black text-amber-600 mt-1">{metrics.trialSchools}</h3>
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-3">Full feature evaluation</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-neutral-400">Prospects in Discussion</p>
            <h3 className="text-3xl font-black text-blue-600 mt-1">{metrics.prospectSchools}</h3>
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">Board & admin evaluations</p>
        </div>
      </div>

      {/* Pipeline CRM Table Section */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-neutral-900">Institution Pipeline Matrix</h3>
            <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-xs font-bold">
              {filteredPipeline.length} total
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search school, code, contact..."
                className="pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500 w-56"
              />
            </div>

            {/* Stage Filter */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-bold">
              {(['all', 'prospect', 'trial', 'active', 'past_due'] as const).map(stage => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={'px-3 py-1.5 rounded-lg capitalize transition-all ' + (
                    selectedStage === stage ? 'bg-white text-purple-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                  )}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-200">
              <tr>
                <th className="p-4 pl-6">School & Location</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Est. Students</th>
                <th className="p-4">Tier</th>
                <th className="p-4">Billing & Status</th>
                <th className="p-4">School Code</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredPipeline.map((school) => {
                const stageColors: Record<PipelineStage, string> = {
                  prospect: 'bg-blue-100 text-blue-800',
                  trial: 'bg-amber-100 text-amber-800',
                  active: 'bg-emerald-100 text-emerald-800',
                  past_due: 'bg-rose-100 text-rose-800',
                  churned: 'bg-neutral-100 text-neutral-600'
                };

                const tierColors: Record<SubscriptionTierType, string> = {
                  foundation: 'bg-neutral-100 text-neutral-800',
                  standard: 'bg-blue-100 text-blue-800',
                  premium: 'bg-purple-100 text-purple-800'
                };

                return (
                  <tr key={school.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-neutral-900 text-sm">{school.name}</div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span>{school.location}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1">
                        Contact: {school.primaryContactName} ({school.primaryContactEmail})
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={'px-2.5 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider ' + stageColors[school.stage]}>
                        {school.stage}
                      </span>
                      {school.has30DayTrial && school.stage === 'trial' && (
                        <div className="text-[10px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Expires {school.trialExpiresAt}
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-mono font-bold text-neutral-800 text-sm">
                      {school.estimatedStudentCount}
                    </td>

                    <td className="p-4">
                      <span className={'px-2 py-0.5 rounded font-extrabold uppercase text-[10px] ' + tierColors[school.tier]}>
                        {school.tier}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-neutral-800 capitalize">
                        {school.billingCycle} ({school.paymentMethod.replace('_', ' ')})
                      </div>
                      <span className={'inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ' + (
                        school.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                        school.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      )}>
                        {school.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-neutral-900 text-xs bg-neutral-100 px-2 py-1 rounded-lg">
                          {school.schoolCode}
                        </span>
                        <button
                          onClick={() => handleCopy(school.schoolCode, school.id)}
                          className="p-1 hover:bg-neutral-200 rounded text-neutral-500 transition-colors"
                          title="Copy School Code"
                        >
                          {copiedCode === school.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="p-4 pr-6 text-right space-y-1">
                      <button
                        onClick={() => handleSendInvite(school)}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white font-bold rounded-xl text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        {inviteSentFor === school.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5" />}
                        <span>{inviteSentFor === school.id ? 'Invite Sent' : 'Send Principal Invite'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5-Step Add Institution Wizard Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-8 space-y-6 border border-neutral-200">
            {/* Header & Steps Indicator */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider">
                  Step {wizardStep} of 5 · Sales Pipeline Onboarding
                </span>
                <h3 className="text-xl font-black text-neutral-900 mt-0.5">
                  {wizardStep === 1 && '1. School Details & Primary Contact'}
                  {wizardStep === 2 && '2. Pipeline Stage Assignment'}
                  {wizardStep === 3 && '3. Subscription Tier & Feature Grant'}
                  {wizardStep === 4 && '4. Billing Cycle & Payment Protocol'}
                  {wizardStep === 5 && '5. Principal Invitation & Code Issuance'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Basics */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">School / Academy Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Hillcrest International"
                    className="w-full p-3 border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Nairobi, Kenya"
                      className="w-full p-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Est. Student Enrollment</label>
                    <input
                      type="number"
                      value={formData.estimatedStudentCount}
                      onChange={e => setFormData({ ...formData, estimatedStudentCount: Number(e.target.value) })}
                      className="w-full p-3 border border-neutral-300 rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Principal / Contact Name</label>
                    <input
                      type="text"
                      value={formData.primaryContactName}
                      onChange={e => setFormData({ ...formData, primaryContactName: e.target.value })}
                      placeholder="e.g. Dr. Jane Doe"
                      className="w-full p-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Contact Email Address</label>
                    <input
                      type="email"
                      value={formData.primaryContactEmail}
                      onChange={e => setFormData({ ...formData, primaryContactEmail: e.target.value })}
                      placeholder="jane.doe@school.ac.ke"
                      className="w-full p-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pipeline Stage */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-500">
                  Select the current relationship status with this school in your sales cycle:
                </p>

                <div className="space-y-2.5">
                  {[
                    { key: 'prospect', title: 'Prospect', desc: 'Initial contact made, proposal under review by administration or board.' },
                    { key: 'trial', title: '30-Day Evaluation Trial', desc: 'School actively evaluating full SAT features before commercial sign-off.' },
                    { key: 'active', title: 'Active Partner', desc: 'Agreement finalized, termly or annual subscription confirmed.' },
                    { key: 'past_due', title: 'Past Due / Renewal', desc: 'Termly invoice pending or renewal conversation required.' }
                  ].map(item => (
                    <label
                      key={item.key}
                      onClick={() => setFormData({ ...formData, stage: item.key as PipelineStage })}
                      className={'p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ' + (
                        formData.stage === item.key ? 'bg-purple-50/80 border-purple-500 text-purple-900' : 'bg-neutral-50 border-neutral-200'
                      )}
                    >
                      <input
                        type="radio"
                        name="stage"
                        checked={formData.stage === item.key}
                        onChange={() => {}}
                        className="mt-1 accent-purple-600"
                      />
                      <div>
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Tier & Features */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'foundation', title: 'Foundation', desc: 'Practice & Trial Exams, Read-Only Textbooks' },
                    { key: 'standard', title: 'Standard', desc: '+ Full Tests, Assignments, Parent Portal' },
                    { key: 'premium', title: 'Premium', desc: '+ AI Content Studio, HOD approvals, Analytics' }
                  ].map(t => (
                    <div
                      key={t.key}
                      onClick={() => setFormData({ ...formData, tier: t.key as SubscriptionTierType })}
                      className={'p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ' + (
                        formData.tier === t.key ? 'bg-purple-50 border-purple-500 text-purple-900' : 'bg-neutral-50 border-neutral-200'
                      )}
                    >
                      <div>
                        <h4 className="font-black text-sm">{t.title}</h4>
                        <p className="text-[11px] text-neutral-500 mt-1">{t.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-900">Grant 30-Day Full-Feature Trial</p>
                    <p className="text-[11px] text-amber-700">Enables all Premium capabilities without immediate upfront billing.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.has30DayTrial}
                    onChange={e => setFormData({ ...formData, has30DayTrial: e.target.checked })}
                    className="w-4 h-4 accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Billing */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Billing Cycle</label>
                    <select
                      value={formData.billingCycle}
                      onChange={e => setFormData({ ...formData, billingCycle: e.target.value as BillingCycle })}
                      className="w-full p-3 border rounded-xl text-sm font-medium"
                    >
                      <option value="termly">Termly (3-Term School Year)</option>
                      <option value="annual">Annual (Full Academic Year)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                      className="w-full p-3 border rounded-xl text-sm font-medium"
                    >
                      <option value="invoice">School Invoice</option>
                      <option value="mpesa">M-Pesa Business / Paybill</option>
                      <option value="bank_transfer">Direct Bank Transfer</option>
                      <option value="card">Credit / Debit Card</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={e => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                    className="w-full p-3 border rounded-xl text-sm font-medium"
                  >
                    <option value="pending">Pending Admin Approval</option>
                    <option value="paid">Paid & Reconciled</option>
                    <option value="overdue">Overdue / Follow-up Required</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 5: Invite */}
            {wizardStep === 5 && (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-neutral-900">Ready to Generate School Shell</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Clicking Complete will generate the institution record, create a 48-hour School Code, and dispatch an invite link to <strong>{formData.primaryContactEmail || 'the principal'}</strong>.
                </p>

                <div className="p-4 bg-neutral-50 border rounded-2xl text-left space-y-1 text-xs">
                  <p><strong>School:</strong> {formData.name}</p>
                  <p><strong>Tier:</strong> {formData.tier.toUpperCase()} ({formData.has30DayTrial ? '30-Day Trial' : 'Standard'})</p>
                  <p><strong>Billing:</strong> {formData.billingCycle} via {formData.paymentMethod}</p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50"
                >
                  Back
                </button>
              ) : <div />}

              {wizardStep < 5 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (wizardStep === 1 && !formData.name.trim()) return;
                    setWizardStep(prev => prev + 1);
                  }}
                  disabled={wizardStep === 1 && !formData.name.trim()}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl disabled:opacity-40 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateSchool}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Complete Onboarding & Dispatch Invite</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
