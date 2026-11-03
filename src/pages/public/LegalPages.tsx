/**
 * Nurse Care - Legal & Governance Documentation
 * Implements Terms & Conditions (derived from Seva At Home standards),
 * Privacy Policy (derived from HCAH privacy policies), and
 * Patient Charter (derived from HCAH patient rights and caregiver responsibilities charter).
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { PageSeo } from '../../components/common/PageSeo';
import { TestContentBanner } from '../../components/common/TestContentBanner';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  FileText,
  Map,
  ExternalLink,
  HeartHandshake,
  HeartPulse,
  UserCheck,
  AlertTriangle,
  Lock,
  Eye,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Sparkles
} from 'lucide-react';

// =========================================================================
// 1. SITEMAP PAGE
// =========================================================================
export const SitemapPage: React.FC = () => {
  const { services } = useApp();

  return (
    <div className="min-h-screen bg-white">
      <PageSeo
        title="Sitemap - Web Directory"
        description="Comprehensive website map and link index for Nurse Care home nursing service."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <TestContentBanner pageName="Sitemap" />

        <div className="flex items-center gap-2.5 mb-2">
          <Map className="w-6 h-6 text-[#0f8672]" />
          <h1 className="text-3xl font-bold text-slate-900">Website Sitemap</h1>
        </div>
        <p className="text-sm text-slate-600 mb-8">
          Overview of all public web pages, clinical service portfolios, patient rights charters, and legal policies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 border border-slate-200 rounded-2xl p-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-200">
              Primary Public Navigation
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-[#0f8672] hover:underline font-medium">
                  / — Home Page
                </Link>
                <p className="text-xs text-slate-500">Value proposition, hero, quick enquiry form, approved reviews, FAQs</p>
              </li>
              <li>
                <Link to="/about-us" className="text-[#0f8672] hover:underline font-medium">
                  /about-us — About Us
                </Link>
                <p className="text-xs text-slate-500">Mission, 4-tier nurse selection, geographical coverage</p>
              </li>
              <li>
                <Link to="/services" className="text-[#0f8672] hover:underline font-medium">
                  /services — Clinical Services
                </Link>
                <p className="text-xs text-slate-500">Detailed procedures, inclusions, clinical FAQs, location maps</p>
              </li>
              <li>
                <Link to="/feedbacks" className="text-[#0f8672] hover:underline font-medium">
                  /feedbacks — Customer Feedbacks & Reviews
                </Link>
                <p className="text-xs text-slate-500">Feedback form, photo/video preview, moderated reviews</p>
              </li>
              <li>
                <Link to="/contact-us" className="text-[#0f8672] hover:underline font-medium">
                  /contact-us — Contact Us
                </Link>
                <p className="text-xs text-slate-500">Helpline phone, WhatsApp link, physical address, direct messaging</p>
              </li>
              <li>
                <Link to="/enquiry" className="text-[#0f8672] hover:underline font-medium">
                  /enquiry — Book a Nurse (Patient Intake Form)
                </Link>
                <p className="text-xs text-slate-500">Structured form with service & locality match</p>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-200">
              Clinical Charters, Policies & Services
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/patient-charter" className="text-[#0f8672] hover:underline font-bold">
                  /patient-charter — Patient & Family Charter
                </Link>
                <p className="text-xs text-slate-500">Patient rights to dignity, chaperone, safety & caregiver respect</p>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-[#0f8672] hover:underline font-medium">
                  /terms-and-conditions — Terms & Conditions
                </Link>
                <p className="text-xs text-slate-500">Terms of service, fees, cancellations, and refund policy</p>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-[#0f8672] hover:underline font-medium">
                  /privacy-policy — Privacy Policy
                </Link>
                <p className="text-xs text-slate-500">Medical confidentiality, encryption, and data rights</p>
              </li>

              <li className="pt-3 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-1">Clinical Specialties:</span>
                {services.map((s) => (
                  <div key={s.id} className="py-0.5">
                    <Link to={`/services#${s.slug}`} className="text-slate-700 hover:text-[#0f8672] text-xs">
                      • {s.title}
                    </Link>
                  </div>
                ))}
              </li>

              <li className="pt-2">
                <span className="text-xs text-slate-400">
                  Hidden Nurse Onboarding: Accessible to vetted applicants via direct recruiter link only.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. TERMS AND CONDITIONS PAGE (SEVA AT HOME STANDARDS)
// =========================================================================
export const TermsConditionsPage: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="min-h-screen bg-white">
      <PageSeo
        title="Terms & Conditions of Service - Nurse Care"
        description="Comprehensive terms of service, care package fees, cancellations, and 7-day refund policies for Nurse Care home nursing."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <TestContentBanner pageName="Terms and Conditions (Seva At Home Standards)" />

        <div className="flex items-center gap-2.5 mb-2">
          <FileText className="w-6 h-6 text-[#0f8672]" />
          <h1 className="text-3xl font-bold text-slate-900">Terms & Conditions of Service</h1>
        </div>
        <p className="text-xs text-slate-500 mb-8">
          Governs clinical home care engagements, service fees, cancellations, and user obligations.
        </p>

        <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-6 leading-relaxed">
          <section className="space-y-2 p-5 bg-teal-50/50 border border-teal-100 rounded-2xl">
            <h2 className="text-base font-bold text-[#0e6b5c]">1. Agreement to Terms & Eligibility</h2>
            <p>
              These Terms of Service govern your access to and use of {settings.siteName}&apos;s websites, mobile interfaces, home nursing dispatches, and care services. By submitting an enquiry, requesting clinical assistance, or scheduling caregiver visits, you agree to be bound by these Terms in full.
            </p>
            <p className="text-xs text-slate-600">
              If you are engaging services on behalf of an elderly relative, ward, or an organization/hospital, you represent and warrant that you possess the necessary authority to bind the family or organization to these Terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Nature of Home Care & Clinical Scope</h2>
            <p>
              {settings.siteName} coordinates skilled registered nurses (GNM / B.Sc Nursing) and certified attendants to deliver doctor-prescribed interventions, palliative support, geriatric care, and postoperative wound rehabilitation directly at the patient’s home.
            </p>
            <div className="p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-900 text-xs">
              <strong>Emergency Medical Disclaimer:</strong> {settings.siteName} is <em>not</em> an emergency ambulance or emergency trauma response service. In the event of acute emergencies (such as sudden cardiac arrest, acute chest pain, uncontrolled hemorrhaging, or severe respiratory failure), dial 112 immediately.
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Mandatory Physician Prescriptions & Clinical Direction</h2>
            <p>
              To ensure patient clinical safety and regulatory adherence, visiting nurses will only administer injectable medications (IV, IM, Sub-Q), initiate IV infusions, change surgical dressings, insert catheters, or adjust oxygen flow based on an authenticated written prescription or hospital discharge summary from a registered medical practitioner.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Service Fees, Shifts & Billing</h2>
            <p>
              Users agree to pay the applicable care charges based on agreed shift formats (per-visit, 12-hour day/night shift, or 24-hour rotational live-in care). Daily rates and consumables charges will be clearly itemized on your care estimate. Applicable statutory taxes (GST) are included as per Indian law.
            </p>
            <p>
              {settings.siteName} reserves the right to modify fee tariffs periodically; however, active confirmed patient care periods will remain locked at the originally agreed tariff until the conclusion of the booked duration.
            </p>
          </section>

          <section className="space-y-2 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
            <h2 className="text-base font-bold text-slate-900">5. Cancellations, Rescheduling & 7-Day Refund Policy</h2>
            <p>
              We recognize that medical circumstances may change abruptly. Our cancellation and refund guidelines are structured as follows:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>Single Procedure Visits:</strong> Cancellations must be communicated at least 4 hours before the nurse&apos;s departure. Cancellations after staff dispatch may incur a nominal transit fee.
              </li>
              <li>
                <strong>Shift & Long-Term Care:</strong> Cancellations or requests to pause care should be submitted at least 24 hours in advance to allow reallocation of duty rosters.
              </li>
              <li>
                <strong>Written Refund Requests:</strong> If {settings.siteName} cancels or is unable to provide a replacement nurse, or if care is concluded early due to medical discharge, users may submit a written refund request within <strong>7 days</strong> of service stoppage. Approved refunds will be credited back via UPI or original payment channel within 5-7 business days, subject to adjustment of actual days delivered.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">6. Safe, Respectful Working Environment</h2>
            <p>
              Caregivers, nurses, and patient attendants are medical professionals dedicated to the patient&apos;s recovery. Families agree to maintain a secure, dignified, non-threatening, and clean home environment.
            </p>
            <p className="text-xs text-slate-600">
              Any harassment, abuse, threats, discrimination, or assignment of domestic cleaning/household duties outside clinical care is strictly prohibited and constitutes grounds for immediate service termination without refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">7. Disclaimers & Limitation of Liability</h2>
            <p>
              The platform and home services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. While {settings.siteName} enforces strict verification and aseptic quality standards, clinical outcomes remain dependent on patient biology and doctor-prescribed treatments.
            </p>
            <p className="text-xs text-slate-600">
              To the fullest extent permitted by law, {settings.siteName} and its affiliates shall not be liable for indirect, incidental, punitive, or consequential damages resulting from pre-existing medical ailments or unauthorized administration of unprescribed medication by family members.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">8. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in New Delhi, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. PRIVACY POLICY PAGE (HCAH STANDARDS)
// =========================================================================
export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="min-h-screen bg-white">
      <PageSeo
        title="Privacy Policy - Medical Confidentiality & Data Security"
        description="Comprehensive privacy policy reflecting Health Care At Home (HCAH) standards: Data controller roles, 256-bit encryption, prescription security, and patient data rights."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <TestContentBanner pageName="Privacy Policy (HCAH Standards)" />

        <div className="flex items-center gap-2.5 mb-2">
          <ShieldCheck className="w-6 h-6 text-[#0f8672]" />
          <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        </div>
        <p className="text-xs text-slate-500 mb-8">
          Detailed data protection framework governing patient health records, prescriptions, and identity credentials.
        </p>

        <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-6 leading-relaxed">
          <section className="space-y-2 p-5 bg-teal-50/50 border border-teal-100 rounded-2xl">
            <h2 className="text-base font-bold text-[#0e6b5c]">1. Data Controller & Processor Commitment</h2>
            <p>
              {settings.siteName} acts as a responsible Data Controller and Processor. We recognize that medical records, diagnostic summaries, vital trends, and home addresses are sensitive personal data. We are committed to safeguarding this information through rigorous security controls aligned with Indian healthcare data governance standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Categories of Information We Collect</h2>
            <p>To deliver safe, personalized clinical care at home, we collect:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>Contact Information:</strong> Patient name, primary caregiver/family contact, telephone number, email, and residential service address.
              </li>
              <li>
                <strong>Clinical & Health Records:</strong> Doctor prescriptions, discharge summaries, current medications, allergy notes, vital sign logs, and specific care goals.
              </li>
              <li>
                <strong>Government Identity Proofs:</strong> For nurses, full credentials (Aadhaar, Nursing Council registration, degree certificates) are verified and stored securely. In standard operational views, identity credentials are electronically masked.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Lawful Purpose & Clinical Usage</h2>
            <p>Your data is utilized solely for legitimate healthcare coordination purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Matching and deploying clinically qualified nurses suited to the patient&apos;s condition.</li>
              <li>Verifying prescription dosage and checking for medication contraindications.</li>
              <li>Facilitating family communication, updates on duty shifts, and invoicing.</li>
              <li>Providing duty coordinators and emergency supervisors with real-time vitals monitoring.</li>
            </ul>
          </section>

          <section className="space-y-2 p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
            <h2 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>4. Data Security Infrastructure & Encryption</span>
            </h2>
            <p className="text-xs text-emerald-900 leading-relaxed">
              We employ bank-grade security protocols to prevent unauthorized access, alteration, or disclosure. Personal information is transmitted using <strong>256-bit SSL encryption</strong> and protected behind enterprise firewall architecture. Access to patient clinical records is restricted on a strict need-to-know basis to the assigned registered nurse and on-duty medical triage coordinators.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. Strict Prohibition on Commercial Sale</h2>
            <p>
              We do <strong>not</strong> sell, barter, lease, or monetize your personal or medical data to third-party advertisers, insurance marketers, or pharmaceutical sales agents. Any data disclosures are limited strictly to authorized diagnostic labs or emergency hospital teams when explicitly sanctioned by the patient or family.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">6. User Rights: Access, Rectification & Deletion</h2>
            <p>
              In accordance with data protection regulations, patients and authorized family representatives possess the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Right to Access:</strong> You may request a digital copy of your past home care vitals charts and invoices.</li>
              <li><strong>Right to Rectify:</strong> You may correct outdated phone numbers, addresses, or medical history.</li>
              <li><strong>Right to Erasure:</strong> You may request account closure and deletion of non-statutory personal data by contacting our Privacy Desk. Certain clinical records may be retained as mandated by Indian medical archiving laws.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">7. Data Retention Policy</h2>
            <p>
              {settings.siteName} retains personal and clinical information only as long as necessary to provide uninterrupted healthcare services, maintain legal continuity, and comply with clinical audit regulations.
            </p>
          </section>

          <section className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <h3 className="font-bold text-slate-900">8. Privacy Grievance Officer</h3>
            <p className="text-slate-600">
              For inquiries regarding data protection or to exercise privacy rights, write to our Data Protection Officer at:
            </p>
            <div className="mt-2 text-slate-700 space-y-0.5 font-medium">
              <div>Email: <a href={`mailto:${settings.email}`} className="text-[#0f8672] underline">{settings.email}</a></div>
              <div>Helpline: <a href={`tel:${settings.phone}`} className="text-[#0f8672] underline">{settings.phone}</a></div>
              <div>Address: {settings.address}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. PATIENT CHARTER PAGE (HCAH PATIENT CHARTER STANDARDS)
// =========================================================================
export const PatientCharterPage: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="min-h-screen bg-white">
      <PageSeo
        title="Patient & Family Charter - Clinical Rights & Caregiver Responsibilities"
        description="Official Patient Charter based on HCAH standards: Outlining comprehensive patient rights to respectful, non-discriminatory care, same-gender chaperones, safety, and mutual caregiver responsibilities."
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#effaf8]/70 via-[#effaf8]/30 to-white pt-16 pb-12 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TestContentBanner pageName="Patient Charter (HCAH Standards)" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-[#0e6b5c] text-xs font-semibold mb-4">
            <HeartPulse className="w-3.5 h-3.5 text-[#0f8672]" />
            <span>Clinical Excellence & Compassionate Ethics</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Patient & Family Charter
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Our commitment to quality, patient dignity, clinical safety, and mutual respect between care recipients and visiting home healthcare professionals.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Core Philosophy Banner */}
        <div className="p-6 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 border border-teal-200 rounded-3xl flex flex-col sm:flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0f8672] text-white flex items-center justify-center shrink-0 shadow-sm">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Partnership in Home Healing
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              At {settings.siteName}, we believe optimal clinical recovery flourishes in a supportive atmosphere grounded in mutual dignity. This Charter establishes the clear rights you are guaranteed as a patient, alongside the responsibilities that ensure our nurses can deliver safe, professional care.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: PATIENT RIGHTS (HCAH COMPLIANT) */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <ShieldCheck className="w-6 h-6 text-[#0f8672]" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Part A: Your Rights as a Patient</h2>
              <p className="text-xs text-slate-500">Every individual in our care is entitled to these foundational clinical rights:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Right 1 */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-[#0f8672]" />
                <span>1. Non-Discriminatory Access to Care</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have the right to receive compassionate home healthcare without denial or prejudice based on race, color, religion, sexual orientation, disability, nationality, or socio-economic background.
              </p>
            </div>

            {/* Right 2 */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-[#0f8672]" />
                <span>2. Respect, Personal Dignity & Worth</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have the right to considerate and courteous bedside attention acknowledging your cultural beliefs, personal dignity, emotional comfort, and individual worth at all times.
              </p>
            </div>

            {/* Right 3 */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-[#0f8672]" />
                <span>3. Privacy & Same-Gender Chaperone</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have the right to complete physical and informational confidentiality. You have the right to decline conversations with non-clinical personnel, and the right to have a <strong>same-gender chaperone or family member present</strong> during physical examinations and intimate nursing interventions.
              </p>
            </div>

            {/* Right 4 */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-[#0f8672]" />
                <span>4. Informed Consent & Care Participation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have the right to receive clear explanations of your prescribed care regimen, medications, and clinical rationale. No procedure shall be performed without your voluntary, informed understanding.
              </p>
            </div>

            {/* Right 5 */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-[#0f8672]" />
                <span>5. Right to Refuse Treatment / Next-of-Kin (NOK)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You or your authorized Next of Kin (NOK) have the explicit right to refuse or discontinue any medication or clinical procedure, with full explanation of any medical consequences, within the boundaries of applicable law.
              </p>
            </div>

            {/* Right 6 */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-[#0f8672]" />
                <span>6. Patient Safety & Aseptic Standards</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have the right to expect sterile single-use disposable kits, strict hand hygiene, protection from abuse, and freedom from clinical neglect during all nursing interactions.
              </p>
            </div>

            {/* Right 7 */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-[#0f8672]" />
                <span>7. Caregiver Identity & Credentials</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have the right to know the identity, clinical qualifications, and Nursing Council verification of every nurse entering your home. All personnel wear official company identity badges.
              </p>
            </div>

            {/* Right 8 */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-[#0f8672]" />
                <span>8. Prompt Grievance Redressal</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have the right to voice concerns, report grievances, or request a change of nurse without fear of retaliation, with direct oversight from our Head of Nursing.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: PATIENT & FAMILY RESPONSIBILITIES (HCAH COMPLIANT) */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Part B: Patient & Family Responsibilities</h2>
              <p className="text-xs text-slate-500">To maintain safety and quality of clinical care, families agree to observe these standards:</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0f8672] flex items-center justify-center text-[11px] font-bold">1</span>
                <span>Treat Healthcare Workers with Dignity and Respect</span>
              </div>
              <p className="text-slate-600 pl-7">
                Patients and household members must treat visiting nurses and care attendants with mutual courtesy, dignity, and professional respect. Verbal abuse, intimidation, or inappropriate conduct will result in immediate service withdrawal.
              </p>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-amber-950 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[11px] font-bold">2</span>
                <span>Strict Prohibition on Non-Clinical Household Chores</span>
              </div>
              <p className="text-amber-900 pl-7">
                Registered nurses and patient care attendants are specialized medical professionals assigned solely for the healthcare needs of the registered patient. <strong>Do not instruct or pressure nursing staff to perform household domestic work</strong> (e.g., cooking for family members, laundry, washing utensils, or sweeping).
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0f8672] flex items-center justify-center text-[11px] font-bold">3</span>
                <span>No Intoxication or Controlled Substances</span>
              </div>
              <p className="text-slate-600 pl-7">
                Do not allow intoxicated personnel, alcohol consumption, or illicit substances within the patient care area while healthcare procedures are underway.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0f8672] flex items-center justify-center text-[11px] font-bold">4</span>
                <span>Enforce a Strict &quot;No Smoking Zone&quot;</span>
              </div>
              <p className="text-slate-600 pl-7">
                Strictly respect and maintain a &quot;No Smoking Zone&quot; in the home care setting, especially around oxygen concentrators, nebulizers, and respiratory recovery zones.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0f8672] flex items-center justify-center text-[11px] font-bold">5</span>
                <span>Control Noise Levels & Restrict Unnecessary Visitors</span>
              </div>
              <p className="text-slate-600 pl-7">
                Control ambient household noise and restrict visitor foot traffic in the patient room during recovery shifts to support restful healing and infection control.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0f8672] flex items-center justify-center text-[11px] font-bold">6</span>
                <span>Provide a Safe, Secure Physical Environment</span>
              </div>
              <p className="text-slate-600 pl-7">
                Ensure the personal safety, physical security, and access to basic clean washroom facilities for on-duty nurses throughout their shift duration.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-[#0f8672] flex items-center justify-center text-[11px] font-bold">7</span>
                <span>Accurate Medical History & Medication Transparency</span>
              </div>
              <p className="text-slate-600 pl-7">
                Provide comprehensive, truthful disclosure of past illnesses, drug allergies, infectious conditions, and active physician prescriptions to prevent adverse reactions.
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Quality Seal Banner */}
        <div className="p-6 bg-[#effaf8] border border-teal-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-teal-200 flex items-center justify-center text-[#0f8672]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Have Questions Regarding Patient Rights?</h3>
              <p className="text-xs text-slate-500">Our Supervisory Head Nurse is available 24/7 to resolve care coordination queries.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact-us"
              className="px-4 py-2 bg-[#0f8672] hover:bg-[#0e6b5c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Contact Care Desk
            </Link>
            <Link
              to="/enquiry"
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Request a Nurse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
