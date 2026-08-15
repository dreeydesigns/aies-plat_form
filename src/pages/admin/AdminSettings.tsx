import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Building2, 
  CheckCircle2, 
  ClipboardCheck, 
  Loader2, 
  LockKeyhole, 
  Save, 
  ShieldCheck, 
  SlidersHorizontal,
  KeyRound,
  Plus,
  Copy,
  Check,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import { doc, onSnapshot, setDoc, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { SchoolCode } from '../../types';

type Settings = { 
  institutionName: string; 
  supportEmail: string; 
  timezone: string; 
  academicYear: string; 
  allowSelfRegistration: boolean; 
  requireAccountApproval: boolean; 
  guardianReportsEnabled: boolean; 
  requireTeacherRemarks: boolean; 
  emailNotifications: boolean; 
  guardianProgressEmails: boolean; 
  wearableConsentRequired: boolean; 
  deviceDataRetentionDays: number;
  monthlySubscriptionPrice: number;
  quarterlySubscriptionPrice: number;
};

const defaults: Settings = { 
  institutionName: 'AIES SAT Platform', 
  supportEmail: 'support@aies.app', 
  timezone: 'Africa/Nairobi', 
  academicYear: '2026', 
  allowSelfRegistration: true, 
  requireAccountApproval: false, 
  guardianReportsEnabled: true, 
  requireTeacherRemarks: false, 
  emailNotifications: true, 
  guardianProgressEmails: true, 
  wearableConsentRequired: true, 
  deviceDataRetentionDays: 90,
  monthlySubscriptionPrice: 29,
  quarterlySubscriptionPrice: 79
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState('');

  // School Code Generation State
  const [schoolCodes, setSchoolCodes] = useState<SchoolCode[]>([
    {
      code: 'AIES-KILIMA-882',
      institutionId: 'inst_kilima',
      institutionName: 'Kilima Academy',
      createdByUid: 'admin',
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      usesCount: 14,
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      code: 'AIES-GREEN-101',
      institutionId: 'inst_greensprings',
      institutionName: 'Green Springs School',
      createdByUid: 'admin',
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      usesCount: 8,
      active: true,
      createdAt: new Date().toISOString()
    }
  ]);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newCodeSuffix, setNewCodeSuffix] = useState('');
  const [generatingCode, setGeneratingCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'systemSettings', 'platform'),
      (snapshot) => {
        setSettings({ ...defaults, ...(snapshot.exists() ? snapshot.data() : {}) } as Settings);
        setLoading(false);
      },
      () => {
        setError('Settings loaded with local defaults.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setSettings(current => ({ ...current, [key]: value }));

  const save = async () => {
    setError('');
    setSaving(true);
    try {
      await setDoc(doc(db, 'systemSettings', 'platform'), { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
      setSavedAt(new Date().toLocaleTimeString());
    } catch {
      setError('Settings were not saved to server. Please check administrator credentials.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateSchoolCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim()) return;

    setGeneratingCode(true);
    try {
      const prefix = newSchoolName.trim().substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'SCH');
      const randomSuffix = newCodeSuffix.trim() ? newCodeSuffix.trim().toUpperCase() : Math.floor(100 + Math.random() * 900).toString();
      const code = `AIES-${prefix}-${randomSuffix}`;
      const expiresAt = new Date(Date.now() + 48 * 3600 * 1000).toISOString(); // 2 days expiry

      const newEntry: SchoolCode = {
        code,
        institutionId: `inst_${prefix.toLowerCase()}`,
        institutionName: newSchoolName.trim(),
        createdByUid: 'admin',
        expiresAt,
        usesCount: 0,
        active: true,
        createdAt: new Date().toISOString()
      };

      setSchoolCodes(prev => [newEntry, ...prev]);
      setNewSchoolName('');
      setNewCodeSuffix('');
    } finally {
      setGeneratingCode(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) return <div className="min-h-[40vh] flex items-center justify-center text-neutral-500"><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading system settings...</div>;

  return (
    <div className="max-w-5xl space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-purple-700 uppercase tracking-wider">Administration</p>
          <h1 className="text-3xl font-black text-neutral-900 mt-1 tracking-tight">System Settings & Multi-Tenancy</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage school code generation, 2-day access windows, and platform-wide defaults.</p>
        </div>
        <button onClick={save} disabled={saving} className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2">
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm font-semibold">{error}</div>}
      {savedAt && <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="w-4 h-4" />Saved at {savedAt}.</div>}

      {/* School Access Code Generator */}
      <SettingsCard icon={<KeyRound className="w-5 h-5 text-purple-600" />} title="School Code Generator & 2-Day Access" description="Generate unique, 48-hour access codes for enrolling partner schools and academies.">
        <form onSubmit={handleGenerateSchoolCode} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-purple-50/60 border border-purple-100 rounded-2xl">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">School / Academy Name</label>
            <input 
              type="text" 
              value={newSchoolName} 
              onChange={e => setNewSchoolName(e.target.value)} 
              placeholder="e.g. Kilima Academy" 
              className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Code Suffix (Optional)</label>
            <input 
              type="text" 
              value={newCodeSuffix} 
              onChange={e => setNewCodeSuffix(e.target.value.toUpperCase())} 
              placeholder="e.g. 882" 
              className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-mono focus:outline-none focus:border-purple-500 uppercase"
            />
          </div>
          <div className="flex items-end">
            <button 
              type="submit" 
              disabled={generatingCode || !newSchoolName.trim()}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              <span>Generate 48h Code</span>
            </button>
          </div>
        </form>

        {/* Active Codes List */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Active 2-Day School Codes</p>
          <div className="space-y-2">
            {schoolCodes.map((sc) => {
              const isExpired = new Date(sc.expiresAt) < new Date();
              return (
                <div key={sc.code} className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-neutral-900">{sc.code}</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded uppercase">
                        {sc.institutionName}
                      </span>
                      {isExpired ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded uppercase">Expired</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Valid for 2 Days
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Enrolled: {sc.usesCount} students · Expires: {new Date(sc.expiresAt).toLocaleDateString()} at {new Date(sc.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(sc.code)}
                    className="px-3 py-1.5 bg-white border border-neutral-300 hover:border-purple-400 text-neutral-700 text-xs font-bold rounded-lg flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                  >
                    {copiedCode === sc.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === sc.code ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </SettingsCard>

      {/* Subscription Pricing Tiers */}
      <SettingsCard icon={<Zap className="w-5 h-5 text-amber-500" />} title="Guest Paywall & Subscription Tiers" description="Configure the pricing and features shown to guest users when they attempt to access textbooks or advanced drills.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Monthly Student Pass ($)">
            <input 
              type="number" 
              value={settings.monthlySubscriptionPrice} 
              onChange={e => set('monthlySubscriptionPrice', Number(e.target.value))} 
              className="w-full px-3.5 py-2.5 border rounded-xl font-bold font-mono"
            />
          </Field>
          <Field label="Quarterly 3-Month Pass ($)">
            <input 
              type="number" 
              value={settings.quarterlySubscriptionPrice} 
              onChange={e => set('quarterlySubscriptionPrice', Number(e.target.value))} 
              className="w-full px-3.5 py-2.5 border rounded-xl font-bold font-mono"
            />
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard icon={<Building2 className="w-5 h-5" />} title="Institution Profile" description="Displayed in administrative and guardian-facing reports.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Platform Branding Title">
            <input value={settings.institutionName} onChange={event => set('institutionName', event.target.value)} className="w-full px-3.5 py-2.5 border rounded-xl" />
          </Field>
          <Field label="Support Email">
            <input type="email" value={settings.supportEmail} onChange={event => set('supportEmail', event.target.value)} placeholder="support@example.edu" className="w-full px-3.5 py-2.5 border rounded-xl" />
          </Field>
          <Field label="Academic Year">
            <input value={settings.academicYear} onChange={event => set('academicYear', event.target.value)} className="w-full px-3.5 py-2.5 border rounded-xl" />
          </Field>
          <Field label="Timezone">
            <select value={settings.timezone} onChange={event => set('timezone', event.target.value)} className="w-full px-3.5 py-2.5 border rounded-xl">
              <option>Africa/Nairobi</option>
              <option>UTC</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
            </select>
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard icon={<SlidersHorizontal className="w-5 h-5" />} title="Accounts and Access" description="Choose how new learners and guardians enter the platform.">
        <Toggle label="Allow self-registration" description="Let users create their own student, teacher, or guardian account." checked={settings.allowSelfRegistration} onChange={value => set('allowSelfRegistration', value)} />
        <Toggle label="Require account approval" description="Mark new accounts for administrator review before institutional access is granted." checked={settings.requireAccountApproval} onChange={value => set('requireAccountApproval', value)} />
      </SettingsCard>

      <SettingsCard icon={<ClipboardCheck className="w-5 h-5" />} title="Guardian Reports & Notifications" description="Controls for the evidence-based report shared with parents and guardians.">
        <Toggle label="Enable guardian reports" description="Allow linked guardians to open and generate student reports." checked={settings.guardianReportsEnabled} onChange={value => set('guardianReportsEnabled', value)} />
        <Toggle label="Enable email notifications" description="Allow platform email notifications where email delivery is configured." checked={settings.emailNotifications} onChange={value => set('emailNotifications', value)} />
        <Toggle label="Guardian progress emails" description="Permit scheduled progress-update emails to linked guardians." checked={settings.guardianProgressEmails} onChange={value => set('guardianProgressEmails', value)} />
      </SettingsCard>
    </div>
  );
}

function SettingsCard({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) { 
  return (
    <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex gap-3">
        <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center">{icon}</div>
        <div>
          <h2 className="font-bold text-neutral-900">{title}</h2>
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </section>
  ); 
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { 
  return (
    <label className="block text-sm font-semibold text-neutral-700">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  ); 
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) { 
  return (
    <div className="flex items-start justify-between gap-5">
      <div>
        <p className="font-semibold text-neutral-800">{label}</p>
        <p className="text-sm text-neutral-500 mt-1">{description}</p>
      </div>
      <button 
        type="button" 
        onClick={() => onChange(!checked)} 
        className={`relative flex-none w-12 h-7 rounded-full transition-colors ${checked ? 'bg-purple-600' : 'bg-neutral-300'}`} 
        aria-pressed={checked}
      >
        <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  ); 
}
