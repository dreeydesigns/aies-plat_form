/**
 * Official AIES SAT Notification & Email Templates
 */

export interface SchoolCodeEmailParams {
  recipientName: string;
  schoolName: string;
  schoolCode: string;
  expiresInDays?: number;
  platformUrl?: string;
}

export function generateSchoolCodeEmail({
  recipientName,
  schoolName,
  schoolCode,
  expiresInDays = 2,
  platformUrl = 'https://aies-plat-form.vercel.app'
}: SchoolCodeEmailParams) {
  return {
    subject: `Your ${schoolName} AIES SAT Access Code (Expires in ${expiresInDays} Days)`,
    text: `Dear ${recipientName},

Your school administrator has invited you to access AIES SAT for ${schoolName}.

🔑 SCHOOL CODE: ${schoolCode}

This code will expire in ${expiresInDays} days.

Steps to complete your registration:
1. Go to ${platformUrl}
2. Create your account or sign in
3. Enter the school code above
4. Complete the parent linking process
5. Take your trial exam to get started

If you have any questions, please contact your school administrator.

— The AIES SAT Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 16px;">
        <h2 style="color: #38bdf8;">Welcome to AIES SAT</h2>
        <p>Dear ${recipientName},</p>
        <p>Your school administrator has invited you to access AIES SAT for <strong>${schoolName}</strong>.</p>
        
        <div style="background: #1e293b; border: 1px solid #334155; padding: 18px; border-radius: 12px; text-align: center; margin: 20px 0;">
          <span style="font-size: 12px; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px;">Your School Code</span>
          <div style="font-size: 28px; font-weight: bold; color: #38bdf8; font-family: monospace; margin: 8px 0;">${schoolCode}</div>
          <span style="color: #f59e0b; font-size: 12px;">⚠️ This code will expire in ${expiresInDays} days</span>
        </div>

        <h3>Steps to complete your registration:</h3>
        <ol style="line-height: 1.6;">
          <li>Go to <a href="${platformUrl}" style="color: #38bdf8;">${platformUrl}</a></li>
          <li>Create your account or sign in</li>
          <li>Enter the school code above</li>
          <li>Complete the parent linking process</li>
          <li>Take your trial exam to get started</li>
        </ol>

        <p style="margin-top: 24px; color: #94a3b8; font-size: 13px;">If you have any questions, please contact your school administrator.</p>
        <p style="color: #64748b; font-size: 12px; border-top: 1px solid #334155; padding-top: 12px;">— The AIES SAT Team</p>
      </div>
    `
  };
}

export interface ParentLinkEmailParams {
  studentName: string;
  studentEmail: string;
  parentEmail: string;
  linkCode?: string;
  platformUrl?: string;
}

export function generateParentLinkRequestEmail({
  studentName,
  studentEmail,
  parentEmail,
  linkCode,
  platformUrl = 'https://aies-plat-form.vercel.app'
}: ParentLinkEmailParams) {
  return {
    subject: `${studentName} has requested to link their AIES SAT account`,
    text: `Subject: ${studentName} has requested to link their AIES SAT account

Dear Parent,

Your child, ${studentName}, has requested to link their AIES SAT account to yours. This will allow you to:

- View your child's progress and performance
- Receive notifications about their learning journey
- Access their score reports and analytics

To approve this request:

1. Sign in to your AIES SAT parent account (${platformUrl})
2. Go to "Linked Accounts" in your settings
3. Approve the pending request from ${studentName}${linkCode ? ` using Link Code: ${linkCode}` : ''}

If you don't have an AIES SAT parent account yet, you can create one at ${platformUrl}.

— The AIES SAT Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 16px;">
        <h2 style="color: #f59e0b;">Parent Connection Request</h2>
        <p>Dear Parent,</p>
        <p>Your child, <strong>${studentName}</strong> (${studentEmail}), has requested to link their AIES SAT account to yours.</p>
        
        <div style="background: #1e293b; border: 1px solid #334155; padding: 16px; border-radius: 12px; margin: 18px 0;">
          <h4 style="margin: 0 0 8px 0; color: #f8fafc;">This connection allows you to:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
            <li>View your child's real-time practice growth and mastery</li>
            <li>Receive automated weekly digest reports</li>
            <li>Inspect scaled score concordance breakdowns</li>
          </ul>
        </div>

        ${linkCode ? `
          <div style="text-align: center; margin: 16px 0;">
            <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8;">Child Link Code</span>
            <div style="font-size: 22px; font-weight: bold; color: #f59e0b; font-family: monospace;">${linkCode}</div>
          </div>
        ` : ''}

        <p><a href="${platformUrl}/parent" style="display: inline-block; background: #d97706; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Approve Request in Parent Portal</a></p>
        <p style="color: #64748b; font-size: 12px; border-top: 1px solid #334155; padding-top: 12px; margin-top: 24px;">— The AIES SAT Team</p>
      </div>
    `
  };
}

export interface TrialExamResultsEmailParams {
  studentName: string;
  level: 'beginner' | 'intermediate' | 'expert';
  mathScore?: number;
  rwScore?: number;
  totalScore?: number;
  platformUrl?: string;
}

export function generateTrialExamResultsEmail({
  studentName,
  level,
  mathScore,
  rwScore,
  totalScore,
  platformUrl = 'https://aies-plat-form.vercel.app'
}: TrialExamResultsEmailParams) {
  const levelTitle = level === 'expert' ? 'Advanced Master' : level === 'intermediate' ? 'Skill Consolidator' : 'Foundation Builder';
  const levelDescription = level === 'expert'
    ? "You have demonstrated high conceptual mastery. We'll challenge you with advanced multi-step problems and hard module pacing."
    : level === 'intermediate'
    ? "You have a solid foundational grasp. We'll focus on refining key high-yield theorems, sentence structures, and pacing."
    : "You're building strong foundational skills. We'll guide you step-by-step through core conceptual methods and worked examples.";

  return {
    subject: `Your AIES SAT Trial Exam Results — Level: ${levelTitle}`,
    text: `Subject: Your AIES SAT Trial Exam Results

Dear ${studentName},

Congratulations on completing your AIES SAT trial exam! Based on your performance, we've determined your current learning level:

📊 Your Level: ${levelTitle} (${level.toUpperCase()})
${totalScore ? `Estimated Composite Score: ${totalScore} (Math: ${mathScore || '—'}, Reading & Writing: ${rwScore || '—'})` : ''}

This means:
${levelDescription}

Your detailed report is available in your AIES SAT dashboard.

Next steps:
1. Explore the Textbook Library for your recommended topics
2. Start practicing in your areas of focus
3. Check your parent dashboard for additional insights

Keep learning and growing!

— The AIES SAT Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 16px;">
        <h2 style="color: #38bdf8;">Your Diagnostic Assessment Results</h2>
        <p>Dear ${studentName},</p>
        <p>Congratulations on completing your initial AIES SAT trial exam!</p>

        <div style="background: #1e293b; border: 1px solid #334155; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
          <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px;">Initial Calibration Level</span>
          <div style="font-size: 26px; font-weight: bold; color: #38bdf8; margin: 6px 0;">${levelTitle}</div>
          ${totalScore ? `<div style="font-size: 18px; color: #f8fafc; font-family: monospace; margin-top: 4px;">Score Baseline: ${totalScore}</div>` : ''}
        </div>

        <p style="line-height: 1.6; color: #cbd5e1;">${levelDescription}</p>

        <h3>Next Steps:</h3>
        <ol style="line-height: 1.6; color: #cbd5e1;">
          <li>Explore the <strong>Textbook Library</strong> for your targeted topics</li>
          <li>Practice adaptive drills in your focused skills</li>
          <li>Review your domain breakdown in your score dashboard</li>
        </ol>

        <p><a href="${platformUrl}/student/sat/scores" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Full Score Report</a></p>
        <p style="color: #64748b; font-size: 12px; border-top: 1px solid #334155; padding-top: 12px; margin-top: 24px;">— The AIES SAT Team</p>
      </div>
    `
  };
}


export interface EmailVerificationParams {
  recipientName: string;
  verificationCode: string;
  expiresInMinutes?: number;
}

export function generateEmailVerificationEmail({
  recipientName,
  verificationCode,
  expiresInMinutes = 15
}: EmailVerificationParams) {
  return {
    subject: `Your AIES SAT Verification Code: ${verificationCode}`,
    text: `Dear ${recipientName},

Your verification code for AIES SAT is: ${verificationCode}

This code will expire in ${expiresInMinutes} minutes. Please enter it in the application to complete your email verification.

If you did not sign up for AIES SAT, please disregard this email.

— The AIES SAT Security Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 16px;">
        <h2 style="color: #38bdf8;">Verify Your AIES SAT Account</h2>
        <p>Dear ${recipientName},</p>
        <p>Thank you for signing up for AIES SAT. Please verify your email address to activate your account:</p>
        
        <div style="background: #1e293b; border: 1px solid #334155; padding: 18px; border-radius: 12px; text-align: center; margin: 20px 0;">
          <span style="font-size: 12px; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px;">Your 6-Digit Verification Code</span>
          <div style="font-size: 32px; font-weight: bold; color: #38bdf8; font-family: monospace; letter-spacing: 4px; margin: 8px 0;">${verificationCode}</div>
          <span style="color: #f59e0b; font-size: 12px;">⚠️ Code expires in ${expiresInMinutes} minutes</span>
        </div>

        <p style="color: #94a3b8; font-size: 12px;">If you did not request this code, no further action is required.</p>
      </div>
    `
  };
}

export function generateEmailVerificationSuccessEmail({
  recipientName,
  platformUrl = 'https://aies-plat-form.vercel.app'
}: { recipientName: string; platformUrl?: string }) {
  return {
    subject: `You've successfully verified your AIES SAT account`,
    text: `Dear ${recipientName},

Your AIES SAT account email has been successfully verified and activated!

You can now sign in anytime at: ${platformUrl}

— The AIES SAT Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 16px;">
        <h2 style="color: #10b981;">✓ Email Verified Successfully</h2>
        <p>Dear ${recipientName},</p>
        <p>Your AIES SAT account has been verified and is active. You can now access your diagnostic assessments, interactive textbooks, and adaptive SAT preparation.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${platformUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold;">Go to AIES SAT</a>
        </div>
      </div>
    `
  };
}
