/**
 * Nurse Care - Seed Data & Default Settings
 * Provides realistic initial records for enquiries, nurses, reviews, and services.
 */

import { AdminUser, Enquiry, Nurse, Review, ServiceItem, ServiceLocation, SiteSettings, StaffRecord, CareBilling, Document } from '../types';

export const SAMPLE_DOC_PRESCRIPTION = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="100%" height="100%" fill="%23ffffff"/><rect x="20" y="20" width="560" height="710" fill="none" stroke="%230f8672" stroke-width="2"/><text x="40" y="70" font-family="Arial" font-size="22" font-weight="bold" fill="%230f8672">MAX SUPER SPECIALITY HOSPITAL</text><text x="40" y="95" font-family="Arial" font-size="12" fill="%23666666">Department of Orthopaedics &amp; Post-Surgical Rehabilitation</text><line x1="40" y1="110" x2="560" y2="110" stroke="%23cccccc" stroke-width="1"/><text x="40" y="140" font-family="Arial" font-size="14" font-weight="bold" fill="%23333333">Patient Name: Eleanor Vance (79 Y / F)</text><text x="40" y="165" font-family="Arial" font-size="13" fill="%23555555">Diagnosis: Post-Operative Total Knee Arthroplasty (TKA)</text><text x="40" y="190" font-family="Arial" font-size="13" fill="%23555555">Date of Discharge: October 12, 2026</text><line x1="40" y1="210" x2="560" y2="210" stroke="%230f8672" stroke-width="1.5"/><text x="40" y="245" font-family="Arial" font-size="16" font-weight="bold" fill="%230f8672">Rx - Home Nursing &amp; Clinical Orders:</text><text x="40" y="280" font-family="Arial" font-size="13" fill="%23333333">1. Sterile Surgical Wound Dressing every 48 hours with Betadine &amp; Opsite</text><text x="40" y="310" font-family="Arial" font-size="13" fill="%23333333">2. Vital signs charting: BP, Pulse, SpO2 twice daily</text><text x="40" y="340" font-family="Arial" font-size="13" fill="%23333333">3. Tab. Cefuroxime 500mg BD after food x 5 days</text><text x="40" y="370" font-family="Arial" font-size="13" fill="%23333333">4. Daily passive quadriceps exercises and assisted walker ambulation</text><text x="40" y="400" font-family="Arial" font-size="13" fill="%23333333">5. Strict barrier asepsis and fall prevention protocol</text><rect x="40" y="610" width="220" height="65" fill="%23f8fafc" stroke="%23cbd5e1"/><text x="50" y="635" font-family="Arial" font-size="12" font-weight="bold" fill="%23334155">Dr. K. N. Singhal, MS (Ortho)</text><text x="50" y="655" font-family="Arial" font-size="10" fill="%2364748b">Reg No: DNC/MCI/44120</text></svg>`;

export const SAMPLE_DOC_COUNCIL_CERT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="500" viewBox="0 0 700 500"><rect width="100%" height="100%" fill="%23fffdf7"/><rect x="25" y="25" width="650" height="450" fill="none" stroke="%23b45309" stroke-width="3"/><rect x="35" y="35" width="630" height="430" fill="none" stroke="%23d97706" stroke-width="1"/><text x="350" y="90" text-anchor="middle" font-family="Georgia" font-size="24" font-weight="bold" fill="%2378350f">DELHI NURSING COUNCIL</text><text x="350" y="115" text-anchor="middle" font-family="Arial" font-size="12" fill="%2392400e">Statutory Body Under Government of NCT of Delhi</text><line x1="150" y1="130" x2="550" y2="130" stroke="%23b45309" stroke-width="1"/><text x="350" y="180" text-anchor="middle" font-family="Georgia" font-size="20" font-style="italic" fill="%231e293b">Certificate of Registration</text><text x="350" y="220" text-anchor="middle" font-family="Arial" font-size="13" fill="%23475569">This is to certify that the undermentioned candidate is duly registered as a</text><text x="350" y="255" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="%230f8672">REGISTERED NURSE &amp; REGISTERED MIDWIFE (RN / RM)</text><text x="350" y="295" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="%230f172a">Registration No: DNC-RN-48921 / 2018</text><text x="350" y="330" text-anchor="middle" font-family="Arial" font-size="13" fill="%23475569">Having completed B.Sc (Hons) Nursing from accredited nursing council</text><text x="100" y="420" font-family="Arial" font-size="11" fill="%2364748b">Date of Issue: 18-07-2018</text><text x="500" y="420" font-family="Arial" font-size="11" font-weight="bold" fill="%230f172a">Registrar, Delhi Nursing Council</text></svg>`;

export const INITIAL_LOCATIONS: ServiceLocation[] = [
  {
    id: 'loc-1',
    name: 'South Delhi',
    city: 'New Delhi',
    popularAreas: ['Vasant Vihar', 'Hauz Khas', 'Saket', 'Greater Kailash', 'Defense Colony', 'Green Park'],
    responseEta: 'Within 1 to 2 hours',
    isActive: true,
    notes: 'Full clinical dispatch center with dedicated geriatric & critical care nurses.'
  },
  {
    id: 'loc-2',
    name: 'Gurugram (Gurgaon)',
    city: 'Haryana',
    popularAreas: ['Golf Course Road', 'DLF Phase 1-5', 'Cyber City', 'Sohna Road', 'Sector 56', 'Nirvana Country'],
    responseEta: 'Within 2 hours',
    isActive: true,
    notes: 'Complete post-operative and 24/7 attendant care roster available.'
  },
  {
    id: 'loc-3',
    name: 'Noida & Greater Noida',
    city: 'Uttar Pradesh',
    popularAreas: ['Sector 18', 'Sector 50', 'Sector 62', 'Sector 128', 'Noida Expressway', 'Pari Chowk'],
    responseEta: 'Within 2 to 3 hours',
    isActive: true,
    notes: 'Registered nurses on standby for sterile wound dressing and IV drips.'
  },
  {
    id: 'loc-4',
    name: 'Central & New Delhi',
    city: 'New Delhi',
    popularAreas: ['Connaught Place', 'Chanakyapuri', 'Jor Bagh', 'Sundar Nagar', 'Civil Lines'],
    responseEta: 'Within 1 to 2 hours',
    isActive: true,
    notes: 'Rapid clinical visit response for emergency catheter & nebulization support.'
  },
  {
    id: 'loc-5',
    name: 'West Delhi & Dwarka',
    city: 'New Delhi',
    popularAreas: ['Dwarka Sector 6-22', 'Punjabi Bagh', 'Rajouri Garden', 'Janakpuri', 'Paschim Vihar'],
    responseEta: 'Within 2 to 3 hours',
    isActive: true,
    notes: 'Elderly companionship and routine vitals checkups.'
  },
  {
    id: 'loc-6',
    name: 'North Delhi',
    city: 'New Delhi',
    popularAreas: ['Model Town', 'Rohini', 'Pitampura', 'Ashok Vihar', 'Shalimar Bagh'],
    responseEta: 'Within 2 to 3 hours',
    isActive: true,
    notes: 'Home nursing and wound management coverage.'
  },
  {
    id: 'loc-7',
    name: 'Faridabad & Ghaziabad',
    city: 'NCR',
    popularAreas: ['Faridabad Sector 14-16', 'Indirapuram', 'Vaishali', 'Vasundhara', 'Crossings Republik'],
    responseEta: 'Within 3 to 4 hours',
    isActive: true,
    notes: 'Scheduled shift care and planned home nursing visits.'
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Elderly Care at Home',
    slug: 'elderly-care',
    shortDescription: 'Dedicated geriatric nursing support, medication management, mobility assistance, and daily health tracking.',
    fullDescription: 'Our elderly care nursing brings compassionate, skilled healthcare directly into your loved one’s living room. Trained nurses supervise daily vital statistics, administer prescribed medications, monitor chronic conditions like hypertension and diabetes, and assist with dignified mobility and hygiene routines.',
    iconName: 'HeartHandshake',
    locations: ['loc-1', 'loc-2', 'loc-3', 'loc-4', 'loc-5', 'loc-6', 'loc-7'],
    isActive: true,
    pricingNote: 'Flexible 8hr, 12hr & 24hr live-in shifts',
    bulletPoints: [
      'Comprehensive vital signs monitoring and blood glucose checks',
      'Prescription management and medication dispensing',
      'Assisted mobility, fall prevention, and gentle physiotherapy exercises',
      'Nutritional support, feeding assistance, and hydration tracking',
      'Dementia and Alzheimer’s compassionate daily routine guidance'
    ],
    faqs: [
      {
        question: 'What qualifications do nurses for elderly care have?',
        answer: 'All our elderly care nurses hold certified nursing diplomas (GNM or B.Sc Nursing) with at least 3 years of clinical bedside experience and specialized geriatric sensitivity training.'
      },
      {
        question: 'Can we book 12-hour or 24-hour shifts?',
        answer: 'Yes, we provide flexible arrangements including 4-hour visits, 8-hour day shifts, 12-hour shifts, and round-the-clock 24-hour rotational nursing care.'
      },
      {
        question: 'Do you assist with bedridden patients?',
        answer: 'Absolutely. Our nurses are trained in preventing bedsores through scheduled turns, catheter hygiene, tube feeding (Ryle’s tube), and gentle sponging.'
      }
    ]
  },
  {
    id: 'srv-2',
    title: 'Post-Surgery and Wound Care',
    slug: 'post-surgery-wound-care',
    shortDescription: 'Sterile surgical dressing, drain monitoring, pain management, and complication prevention after hospital discharge.',
    fullDescription: 'Recovering at home after major surgery requires hospital-grade asepsis. Our wound care nurses follow strict sterile techniques to change surgical dressings, monitor drain outputs, remove surgical sutures or staples under prescription, and detect early signs of infection before complications arise.',
    iconName: 'ShieldAlert',
    locations: ['loc-1', 'loc-2', 'loc-3', 'loc-4', 'loc-5', 'loc-6', 'loc-7'],
    isActive: true,
    pricingNote: 'Per-dressing or weekly healing package',
    bulletPoints: [
      'Sterile dressing changes for open incisions, grafts, and bedsores',
      'Stoma, colostomy, and surgical drain management',
      'Pain monitoring and physician-directed analgesic tracking',
      'Suture and surgical staple removal under physician orders',
      'Detailed clinical progress reports shared with your surgeon'
    ],
    faqs: [
      {
        question: 'Do I need a doctor’s prescription for wound dressings?',
        answer: 'Yes, clinical dressings and stitch removals require a physician discharge summary or prescription to ensure adherence to your surgical protocol.'
      },
      {
        question: 'How do you maintain sterility at home?',
        answer: 'Our nurses arrive with sealed, single-use sterile dressing trays, surgical gloves, antiseptic solutions, and biohazard disposal bags.'
      }
    ]
  },
  {
    id: 'srv-3',
    title: 'Injections and IV Care',
    slug: 'injections-iv-care',
    shortDescription: 'Safe intravenous infusions, intramuscular injections, saline setup, and catheter management by registered nurses.',
    fullDescription: 'Avoid exhausting hospital commutes for standard clinical injections and infusions. Our certified nurses provide safe, painless administration of IV antibiotics, vitamin infusions, subcutaneous insulin, and intramuscular injections in the calm comfort of home.',
    iconName: 'Syringe',
    locations: ['loc-1', 'loc-2', 'loc-3', 'loc-4', 'loc-5', 'loc-6', 'loc-7'],
    isActive: true,
    pricingNote: 'Per-dose or course package',
    bulletPoints: [
      'Intravenous (IV) cannulation and fluid drip monitoring',
      'Intramuscular (IM) and subcutaneous (SC) therapeutic injections',
      'Chemotherapy port flushes and central line maintenance',
      'Foley catheter insertion, irrigation, and hygiene management',
      'Immediate allergy observation and vital signs tracking'
    ],
    faqs: [
      {
        question: 'What is required prior to an IV infusion visit?',
        answer: 'A valid physician prescription stating the drug name, dosage, frequency, and diluent must be uploaded or presented before administration.'
      },
      {
        question: 'Does the nurse stay during the entire infusion?',
        answer: 'Yes, our nurse stays by the bedside for the entire duration of the drip to monitor flow rate and watch for any adverse reactions.'
      }
    ]
  },
  {
    id: 'srv-4',
    title: 'Patient Attendant Care',
    slug: 'patient-attendant-care',
    shortDescription: 'Supportive healthcare attendants assisting with personal hygiene, transfer, meal assistance, and companion care.',
    fullDescription: 'Trained medical attendants assist semi-ambulatory and bedridden patients with daily personal routines. They maintain safe ambulation, assist with restroom needs, provide dignified sponge baths, and ensure a safe, supportive recovery environment under supervisory guidance.',
    iconName: 'UserCheck',
    locations: ['loc-1', 'loc-2', 'loc-3', 'loc-4', 'loc-5', 'loc-6', 'loc-7'],
    isActive: true,
    pricingNote: '12-hour or 24-hour monthly assistance',
    bulletPoints: [
      'Bathing, sponging, oral hygiene, and dignified grooming',
      'Safe wheelchair transfers, posture positioning, and walking escort',
      'Timely meals assistance and medicine reminders',
      'Linen changing and patient bedroom hygiene maintenance',
      'Continuous companionship and emotional reassurance'
    ],
    faqs: [
      {
        question: 'How does an attendant differ from a registered nurse?',
        answer: 'Attendants assist with personal care, hygiene, mobility, and companionship. For clinical procedures like IV drips, wound dressings, and catheterization, a certified nurse is assigned.'
      },
      {
        question: 'Can the attendant prepare light patient meals?',
        answer: 'Yes, attendants assist with serving patient meals, heating soups, preparing light porridge, and encouraging proper hydration.'
      }
    ]
  },
  {
    id: 'srv-5',
    title: 'Short-Term Nursing Visits',
    slug: 'short-term-nursing-visits',
    shortDescription: 'Scheduled 30 to 60-minute clinical visits for blood tests, vitals evaluation, nebulization, or nebulizer setup.',
    fullDescription: 'Ideal for patients needing single or routine clinical procedures without an all-day shift. A registered nurse visits your home at a pre-booked time to conduct nebulization, blood pressure and ECG checks, catheter flush, or specimen collection.',
    iconName: 'Clock',
    locations: ['loc-1', 'loc-2', 'loc-3', 'loc-4', 'loc-5', 'loc-6', 'loc-7'],
    isActive: true,
    pricingNote: 'Per-visit 30 to 60 minutes',
    bulletPoints: [
      '30 to 60-minute home clinical appointment',
      'Vitals checkup: BP, pulse oximetry, blood sugar, and temperature',
      'Nebulization treatment and respiratory monitoring',
      'Foley catheter bag emptying and sterile flushing',
      'Digital vital records recorded directly to family caregivers'
    ],
    faqs: [
      {
        question: 'How quickly can a short-term visit be arranged?',
        answer: 'We typically schedule short-term visits within 2 to 4 hours of enquiry confirmation across our active service zones.'
      },
      {
        question: 'Can I book repeating daily short visits?',
        answer: 'Yes, you can schedule recurring daily morning or evening visits for vital monitoring or ongoing medication administration.'
      }
    ]
  }
];

export const INITIAL_NURSES: Nurse[] = [
  {
    id: 'nurse-1',
    fullName: 'Sister Sunita Roy',
    phone: '9871234560',
    email: 'sunita.roy@nursecare.org',
    city: 'New Delhi',
    qualification: 'B.Sc Nursing (Gold Medalist), Critical Care Certified',
    yearsOfExperience: 9,
    idType: 'Aadhaar',
    idNumber: '894523107842',
    status: 'ACTIVE',
    createdAt: '2025-01-15T09:30:00Z',
    bio: 'Specialist in geriatric patient management, ventilator-weaning support, and post-operative home rehabilitation.',
    documents: [
      {
        id: 'doc-n1',
        name: 'State Nursing Council Registration Certificate',
        fileType: 'image/svg+xml',
        fileSize: 45200,
        fileUrl: SAMPLE_DOC_COUNCIL_CERT,
        uploadedAt: '2025-01-15T09:30:00Z',
        uploadedBy: 'Dr. Priya Sharma'
      }
    ]
  },
  {
    id: 'nurse-2',
    fullName: 'Nurse Rajesh Kumar',
    phone: '9810987654',
    email: 'rajesh.kumar@nursecare.org',
    city: 'Gurugram',
    qualification: 'GNM, Advanced Wound & Stoma Care Practitioner',
    yearsOfExperience: 7,
    idType: 'Aadhaar',
    idNumber: '672314569012',
    status: 'ACTIVE',
    createdAt: '2025-02-01T11:00:00Z',
    bio: 'Expert in surgical wound dressing, diabetic foot ulcer care, and aseptic IV cannulation.',
    documents: [
      {
        id: 'doc-n2',
        name: 'Delhi Council Diploma Certificate',
        fileType: 'image/svg+xml',
        fileSize: 42100,
        fileUrl: SAMPLE_DOC_COUNCIL_CERT,
        uploadedAt: '2025-02-01T11:00:00Z',
        uploadedBy: 'Rajesh Malhotra'
      }
    ]
  },
  {
    id: 'nurse-3',
    fullName: 'Sister Priya Nair',
    phone: '9845112233',
    email: 'priya.nair@nursecare.org',
    city: 'Noida',
    qualification: 'M.Sc Nursing, Pediatric & Palliative Care Specialist',
    yearsOfExperience: 11,
    idType: 'Passport',
    idNumber: 'Z5891402',
    status: 'ACTIVE',
    createdAt: '2025-02-14T14:15:00Z',
    bio: 'Dedicated to compassionate palliative comfort care, pain management protocols, and patient family counseling.'
  },
  {
    id: 'nurse-4',
    fullName: 'Nurse Ananya Sen',
    phone: '9920334455',
    email: 'ananya.sen@nursecare.org',
    city: 'South Delhi',
    qualification: 'B.Sc Nursing, Cardiac Care Specialist',
    yearsOfExperience: 4,
    idType: 'PAN',
    idNumber: 'ABCPS8912K',
    status: 'PENDING',
    createdAt: '2026-03-01T10:00:00Z',
    bio: 'Experienced in cardiac step-down units, Holter monitoring, and emergency BLS certifications.',
    notes: 'Awaiting police verification certificate verification from regional precinct.'
  },
  {
    id: 'nurse-5',
    fullName: 'Sister Kavita Mehra',
    phone: '9867001122',
    email: 'kavita.mehra@nursecare.org',
    city: 'Faridabad',
    qualification: 'GNM, General Nursing and Midwifery',
    yearsOfExperience: 3,
    idType: 'Voter ID',
    idNumber: 'DEL1983021',
    status: 'PENDING',
    createdAt: '2026-03-05T16:20:00Z',
    bio: 'Patient companion and short-term visits practitioner with warm interpersonal rapport.',
    notes: 'Interview completed. Clinical demonstration scheduled for upcoming Friday.'
  },
  {
    id: 'nurse-6',
    fullName: 'Nurse Deepak Joshi',
    phone: '9833445566',
    email: 'deepak.joshi@nursecare.org',
    city: 'Ghaziabad',
    qualification: 'GNM, Orthopedic Rehabilitation Support',
    yearsOfExperience: 6,
    idType: 'Aadhaar',
    idNumber: '451290348712',
    status: 'INACTIVE',
    createdAt: '2024-11-20T08:00:00Z',
    bio: 'Currently on extended educational sabbatical for advanced oncology nursing certification.',
    notes: 'Temporarily inactive until Q4 2026 due to clinical diploma fellowship.'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    reviewerName: 'Meenakshi Sundaram',
    rating: 5,
    message: 'Sister Sunita provided extraordinary care for my 84-year-old mother recovering from hip surgery. Her gentle bedside manners, punctual vitals logging, and calm guidance gave our whole family immense peace of mind.',
    serviceName: 'Elderly Care at Home',
    mediaType: 'text',
    status: 'APPROVED',
    createdAt: '2026-02-18T14:30:00Z'
  },
  {
    id: 'rev-2',
    reviewerName: 'Dr. Arjun Kapoor',
    rating: 5,
    message: 'Nurse Rajesh handled my father’s surgical wound dressings with hospital-grade sterility. The surgical scar healed cleanly without any inflammation. Nurse Care coordinates care with genuine professionalism.',
    serviceName: 'Post-Surgery and Wound Care',
    mediaType: 'photo',
    photoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    createdAt: '2026-02-25T11:20:00Z'
  },
  {
    id: 'rev-3',
    reviewerName: 'Rohit & Shalini Verma',
    rating: 5,
    message: 'We booked short-term nursing visits for continuous IV antibiotic therapy. Sister Priya was always 10 minutes early, verified the prescription thoroughly, and monitored the infusion seamlessly. Exceptional service.',
    serviceName: 'Injections and IV Care',
    mediaType: 'video',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    status: 'APPROVED',
    createdAt: '2026-03-02T09:15:00Z'
  },
  {
    id: 'rev-4',
    reviewerName: 'Pooja Bhatnagar',
    rating: 4,
    message: 'The attendant care was reliable and very respectful. Took care of daily meals and mobility assistance for our grandfather. Very satisfied with the timely responses from their support desk.',
    serviceName: 'Patient Attendant Care',
    mediaType: 'text',
    status: 'PENDING',
    createdAt: '2026-03-05T13:45:00Z',
    adminNote: 'Pending quality check call before public showcase.'
  },
  {
    id: 'rev-5',
    reviewerName: 'Anand Khurana',
    rating: 5,
    message: 'Booked home blood draws and vital checks for my grandmother. Clean single-use needles and instant digital vitals sheet delivered to WhatsApp. Excellent service!',
    serviceName: 'Short-Term Nursing Visits',
    mediaType: 'photo',
    photoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80',
    status: 'PENDING',
    createdAt: '2026-03-06T10:00:00Z',
    adminNote: 'Needs approval review.'
  },
  {
    id: 'rev-6',
    reviewerName: 'Anonymous Marketing Agent',
    rating: 1,
    message: 'We offer medical supplies at cheap wholesale rates. Visit our telegram channel @medpromo for bulk discounts on syringes and monitors.',
    serviceName: 'Injections and IV Care',
    mediaType: 'text',
    status: 'REJECTED',
    createdAt: '2026-02-10T08:00:00Z',
    adminNote: 'Spam promotion attempt rejected automatically.'
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-101',
    fullName: 'Eleanor Vance',
    phone: '9811223344',
    email: 'eleanor.vance@example.com',
    serviceId: 'srv-1',
    cityArea: 'Vasant Vihar, New Delhi',
    preferredDate: '2026-10-15',
    message: 'Seeking a certified nurse for my 79-year-old mother. Requires daily blood pressure and diabetes monitoring, assistance with morning medicines and safe walking support.',
    stage: 'NEW',
    stageHistory: [
      {
        stage: 'NEW',
        timestamp: '2026-10-06T14:22:00Z',
        note: 'Submitted via public enquiry form.'
      }
    ],
    documents: [
      {
        id: 'doc-p1',
        name: 'Hospital Discharge Summary & Prescription',
        fileType: 'image/svg+xml',
        fileSize: 58400,
        fileUrl: SAMPLE_DOC_PRESCRIPTION,
        uploadedAt: '2026-10-06T14:22:00Z',
        uploadedBy: 'Eleanor Vance'
      }
    ],
    createdAt: '2026-10-06T14:22:00Z'
  },
  {
    id: 'enq-102',
    fullName: 'Rahul Sharma',
    phone: '9876541230',
    email: 'rahul.sharma88@example.com',
    serviceId: 'srv-2',
    cityArea: 'DLF Phase 2, Gurugram',
    preferredDate: '2026-10-12',
    message: 'Underwent knee replacement surgery 4 days ago. Discharged yesterday with sterile dressing prescription. Need a nurse for alternate day dressing change and mobility checks.',
    stage: 'NEW',
    stageHistory: [
      {
        stage: 'NEW',
        timestamp: '2026-10-07T08:15:00Z',
        note: 'Submitted via public enquiry form.'
      }
    ],
    documents: [],
    createdAt: '2026-10-07T08:15:00Z'
  },
  {
    id: 'enq-103',
    fullName: 'Maria Gonzalez',
    phone: '9988776655',
    email: 'mgonzalez@example.com',
    serviceId: 'srv-4',
    cityArea: 'Sector 50, Noida',
    preferredDate: '2026-10-14',
    message: 'Need a patient attendant for 12 hours daytime to assist elderly uncle with meals, hygiene routines, and wheelchair transfers.',
    stage: 'CONTACTED',
    notes: 'Spoke with Maria. Explained difference between attendant and nurse. She requested confirmation of attendant language preference (Hindi & English).',
    stageHistory: [
      {
        stage: 'NEW',
        timestamp: '2026-10-05T09:10:00Z',
        note: 'Form submitted.'
      },
      {
        stage: 'CONTACTED',
        timestamp: '2026-10-05T11:45:00Z',
        note: 'Admin called family to assess clinical requirements.'
      }
    ],
    documents: [],
    createdAt: '2026-10-05T09:10:00Z'
  },
  {
    id: 'enq-104',
    fullName: 'David Chen',
    phone: '9810123456',
    email: 'dchen.delhi@example.com',
    serviceId: 'srv-3',
    cityArea: 'Greater Kailash II, New Delhi',
    preferredDate: '2026-10-11',
    message: 'Need 5-day course of IV antibiotic infusions prescribed by attending pulmonologist for chest congestion recovery.',
    stage: 'CONTACTED',
    notes: 'Awaiting copy of current prescription to verify cannula size and infusion schedule.',
    stageHistory: [
      {
        stage: 'NEW',
        timestamp: '2026-10-04T15:30:00Z',
        note: 'Form submitted.'
      },
      {
        stage: 'CONTACTED',
        timestamp: '2026-10-04T17:00:00Z',
        note: 'Shared prescription upload link and discussed timings.'
      }
    ],
    documents: [],
    createdAt: '2026-10-04T15:30:00Z'
  },
  {
    id: 'enq-105',
    fullName: 'Beatrice Taylor',
    phone: '9845012345',
    email: 'beatrice.t@example.com',
    serviceId: 'srv-1',
    cityArea: 'Def Colony, New Delhi',
    preferredDate: '2026-10-09',
    message: 'Confirmed 8-hour daily elderly care for father. Bedside support, medication administration, and vital recording.',
    stage: 'CONFIRMED',
    assignedNurseId: 'nurse-1',
    notes: 'Assigned Sister Sunita Roy. Care begins Oct 9 at 08:30 AM. Family briefed on daily care log.',
    stageHistory: [
      {
        stage: 'NEW',
        timestamp: '2026-10-02T10:00:00Z'
      },
      {
        stage: 'CONTACTED',
        timestamp: '2026-10-02T11:30:00Z',
        note: 'Clinical assessment completed.'
      },
      {
        stage: 'CONFIRMED',
        timestamp: '2026-10-03T14:00:00Z',
        note: 'Assigned nurse Sister Sunita Roy.'
      }
    ],
    documents: [
      {
        id: 'doc-1',
        enquiryId: 'enq-105',
        name: 'Physician_Care_Plan_Taylor.pdf',
        fileType: 'pdf',
        fileSize: 1245000,
        fileUrl: '#mock-pdf-taylor',
        uploadedAt: '2026-10-03T14:15:00Z',
        uploadedBy: 'Admin'
      }
    ],
    createdAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'enq-106',
    fullName: 'Amit Patel',
    phone: '9899001122',
    email: 'amit.patel@example.com',
    serviceId: 'srv-2',
    cityArea: 'Golf Course Road, Gurugram',
    preferredDate: '2026-10-08',
    message: 'Abdominal surgery post-operative wound care and drain tube surveillance. 4 visits scheduled.',
    stage: 'CONFIRMED',
    assignedNurseId: 'nurse-2',
    notes: 'Assigned Nurse Rajesh Kumar. Hospital discharge protocol verified.',
    stageHistory: [
      {
        stage: 'NEW',
        timestamp: '2026-10-01T12:00:00Z'
      },
      {
        stage: 'CONTACTED',
        timestamp: '2026-10-01T13:40:00Z'
      },
      {
        stage: 'CONFIRMED',
        timestamp: '2026-10-02T09:00:00Z',
        note: 'Nurse Rajesh Kumar scheduled for alternate days.'
      }
    ],
    documents: [
      {
        id: 'doc-2',
        enquiryId: 'enq-106',
        name: 'Discharge_Summary_Patel.pdf',
        fileType: 'pdf',
        fileSize: 840000,
        fileUrl: '#mock-pdf-patel',
        uploadedAt: '2026-10-02T09:10:00Z',
        uploadedBy: 'Admin'
      }
    ],
    createdAt: '2026-10-01T12:00:00Z'
  },
  {
    id: 'enq-107',
    fullName: 'Robert Wilson',
    phone: '9822334455',
    email: 'rwilson@example.com',
    serviceId: 'srv-5',
    cityArea: 'Sector 62, Noida',
    preferredDate: '2026-09-28',
    message: 'Short-term morning visits for nebulizer therapy and blood glucose checks following viral bronchial infection.',
    stage: 'COMPLETED',
    assignedNurseId: 'nurse-3',
    notes: '7-day nebulization visits completed successfully by Sister Priya Nair. Patient recovered well with normal vitals.',
    stageHistory: [
      {
        stage: 'NEW',
        timestamp: '2026-09-25T11:00:00Z'
      },
      {
        stage: 'CONTACTED',
        timestamp: '2026-09-25T12:15:00Z'
      },
      {
        stage: 'CONFIRMED',
        timestamp: '2026-09-25T15:30:00Z',
        note: 'Assigned Sister Priya Nair.'
      },
      {
        stage: 'COMPLETED',
        timestamp: '2026-10-04T11:00:00Z',
        note: 'Course finished, patient discharged.'
      }
    ],
    documents: [
      {
        id: 'doc-3',
        enquiryId: 'enq-107',
        name: 'Pulmonologist_Rx_Wilson.jpg',
        fileType: 'jpg',
        fileSize: 520000,
        fileUrl: '#mock-jpg-rx',
        uploadedAt: '2026-09-25T15:45:00Z',
        uploadedBy: 'Admin'
      }
    ],
    createdAt: '2026-09-25T11:00:00Z'
  },
  {
    id: 'enq-108',
    fullName: 'Sunita Agarwal',
    phone: '9818889900',
    email: 'sagarwal@example.com',
    serviceId: 'srv-1',
    cityArea: 'Sonipat Outskirts, Haryana',
    preferredDate: '2026-09-20',
    message: 'Enquired for 24-hour live-in nurse at rural farmhouse outside standard coverage area.',
    stage: 'CANCELLED',
    notes: 'Location falls outside active geographical cluster. Respectfully referred to local district healthcare clinic.',
    stageHistory: [
      {
        stage: 'NEW',
        timestamp: '2026-09-18T16:00:00Z'
      },
      {
        stage: 'CONTACTED',
        timestamp: '2026-09-19T09:30:00Z'
      },
      {
        stage: 'CANCELLED',
        timestamp: '2026-09-19T10:15:00Z',
        note: 'Address outside current clinical service radius.'
      }
    ],
    documents: [],
    createdAt: '2026-09-18T16:00:00Z'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'Nurse Care',
  logoUrl: '',
  phone: '+91 98765 43210',
  email: 'care@nursecare.org',
  address: 'Suite 402, Green Avenue, Medical District, New Delhi, 110016',
  whatsappNumber: '919876543210',
  socialLinks: {
    facebook: 'https://facebook.com/nursecarehome',
    twitter: 'https://x.com/nursecarehome',
    instagram: 'https://instagram.com/nursecarehome',
    linkedin: 'https://linkedin.com/company/nursecarehome'
  },
  defaultSeoTitle: 'Nurse Care - Trained Nurses for Care at Home',
  defaultSeoDescription: 'Compassionate and certified home nursing services: elderly care, post-surgery recovery, wound dressing, IV injections, and patient attendant care.'
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-1',
    fullName: 'Dr. Priya Sharma',
    email: 'admin@nursecare.org',
    password: 'admin123',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    phone: '+91 98112 34567',
    designation: 'Chief Clinical Director & Super Admin',
    avatarUrl: '',
    lastLogin: '2026-10-15T18:30:00Z',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'admin-2',
    fullName: 'Rajesh Malhotra',
    email: 'coordinator@nursecare.org',
    password: 'admin123',
    role: 'CLINICAL_ADMIN',
    status: 'ACTIVE',
    phone: '+91 98223 45678',
    designation: 'Head of Care Operations & Nursing Dispatch',
    avatarUrl: '',
    lastLogin: '2026-10-14T14:20:00Z',
    createdAt: '2026-02-01T10:00:00Z'
  }
];

export const INITIAL_STAFF_RECORDS: StaffRecord[] = [
  {
    id: 'stf-1',
    employeeCode: 'STF-101',
    fullName: 'Sister Ananya Verma',
    department: 'Clinical Triage',
    designation: 'Senior Nurse Field Supervisor',
    phone: '+91 98334 56789',
    email: 'ananya.verma@nursecare.org',
    shift: 'Day Shift (8 AM - 8 PM)',
    status: 'ACTIVE',
    qualification: 'B.Sc Nursing, Critical Care Cert.',
    councilRegistrationNo: 'DNC-RN-48921',
    emergencyContact: '+91 98334 50001 (Spouse)',
    joinDate: '2024-03-15',
    canLogin: true,
    password: 'staff123',
    notes: 'Handles field quality audits and aseptic protocol inspections. Authorized staff coordinator.',
    documents: [
      {
        id: 'doc-s1',
        name: 'Nursing Council Registration Certificate',
        fileType: 'image/svg+xml',
        fileSize: 45200,
        fileUrl: SAMPLE_DOC_COUNCIL_CERT,
        uploadedAt: '2024-03-15T09:00:00Z',
        uploadedBy: 'Dr. Priya Sharma'
      }
    ],
    createdAt: '2024-03-15T09:00:00Z'
  },
  {
    id: 'stf-2',
    employeeCode: 'STF-102',
    fullName: 'Vikram Joshi',
    department: 'Field Operations',
    designation: 'Care Coordinator & Dispatch Officer',
    phone: '+91 98445 67890',
    email: 'vikram.joshi@nursecare.org',
    shift: 'Rotational',
    status: 'ACTIVE',
    qualification: 'BBA Healthcare Operations',
    councilRegistrationNo: 'N/A',
    emergencyContact: '+91 98445 60002 (Brother)',
    joinDate: '2024-06-01',
    canLogin: true,
    password: 'staff123',
    notes: 'Manages patient routing and rapid nurse assignments in South Delhi & Gurgaon.',
    documents: [],
    createdAt: '2024-06-01T10:00:00Z'
  },
  {
    id: 'stf-3',
    employeeCode: 'STF-103',
    fullName: 'Suman Lata',
    department: 'Elderly Attendant',
    designation: 'Certified Senior Care Attendant',
    phone: '+91 98556 78901',
    email: 'suman.lata@nursecare.org',
    shift: '24h Live-in',
    status: 'ACTIVE',
    qualification: 'Geriatric Attendant Diploma, Red Cross First Aid',
    councilRegistrationNo: 'GCA-2022-771',
    emergencyContact: '+91 98556 70003 (Son)',
    joinDate: '2024-08-20',
    canLogin: false,
    notes: 'Specialist in dementia patient handling, mobility support, and feeding assistance.',
    documents: [],
    createdAt: '2024-08-20T11:00:00Z'
  },
  {
    id: 'stf-4',
    employeeCode: 'STF-104',
    fullName: 'Mohd. Tariq',
    department: 'Nursing Care',
    designation: 'ICU & Post-Operative Registered Nurse',
    phone: '+91 98667 89012',
    email: 'tariq.mohd@nursecare.org',
    shift: 'Night Shift (8 PM - 8 AM)',
    status: 'ACTIVE',
    qualification: 'GNM, Post-Surgical Wound Care Cert.',
    councilRegistrationNo: 'UPNC-RN-99214',
    emergencyContact: '+91 98667 80004 (Father)',
    joinDate: '2024-11-10',
    canLogin: false,
    notes: 'Expert in ventilator monitoring, tracheostomy suctioning, and central line management.',
    documents: [],
    createdAt: '2024-11-10T08:30:00Z'
  },
  {
    id: 'stf-5',
    employeeCode: 'STF-105',
    fullName: 'Pooja Nair',
    department: 'Administrative Desk',
    designation: 'Patient Intake & Records Officer',
    phone: '+91 98778 90123',
    email: 'pooja.nair@nursecare.org',
    shift: 'Day Shift (8 AM - 8 PM)',
    status: 'ON_LEAVE',
    qualification: 'M.Sc Hospital Administration',
    councilRegistrationNo: 'N/A',
    emergencyContact: '+91 98778 90005 (Mother)',
    joinDate: '2025-01-05',
    canLogin: true,
    loginRole: 'STAFF',
    password: 'staff123',
    notes: 'Oversees documentation archival, KYC verification, and hospital discharge sheets.',
    documents: [],
    createdAt: '2025-01-05T09:15:00Z'
  },
  {
    id: 'stf-6',
    employeeCode: 'STF-106',
    fullName: 'Amit Saxena',
    department: 'Administrative Desk',
    designation: 'Patient Billing & Finance Officer',
    phone: '+91 98889 01234',
    email: 'finance@nursecare.org',
    shift: 'Day Shift (8 AM - 8 PM)',
    status: 'ACTIVE',
    qualification: 'M.Com, Certified Healthcare Financial & Billing Specialist',
    councilRegistrationNo: 'N/A',
    emergencyContact: '+91 98889 00006 (Spouse)',
    joinDate: '2025-02-01',
    canLogin: true,
    loginRole: 'FINANCE',
    password: 'finance123',
    notes: 'Dedicated finance staff officer managing care duration billing, collections, duration extensions, and refunds.',
    documents: [],
    createdAt: '2025-02-01T09:00:00Z'
  }
];

export const INITIAL_BILLINGS: CareBilling[] = [
  {
    id: 'bill-101',
    enquiryId: 'enq-101',
    patientName: 'Eleanor Vance',
    phone: '9811223344',
    serviceName: 'Elderly Care at Home',
    startDate: '2026-10-15',
    endDate: '2026-10-29',
    totalDays: 14,
    shiftType: '12h Day Shift (8 AM - 8 PM)',
    dailyRate: 1800,
    baseCareCharges: 25200,
    consumablesCharges: 1500,
    taxes: 0,
    totalCharges: 26700,
    amountPaid: 20000,
    balanceDue: 6700,
    payments: [
      {
        id: 'pay-1',
        amount: 20000,
        paymentMode: 'UPI',
        transactionRef: 'UPI-7819230182',
        paidAt: '2026-10-15T10:30:00Z',
        receivedBy: 'Admin Desk',
        receiptNumber: 'REC-2026-001',
        notes: 'Advance 14-day shift deposit'
      }
    ],
    refunds: [],
    totalRefunded: 0,
    extensions: [],
    status: 'ACTIVE',
    notes: 'Patient family requested weekend physiotherapy review.',
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-10-15T10:30:00Z'
  },
  {
    id: 'bill-102',
    enquiryId: 'enq-102',
    patientName: 'Rahul Sharma',
    phone: '9876541230',
    serviceName: 'Post-Surgical Care & Dressing',
    startDate: '2026-10-12',
    endDate: '2026-10-22',
    totalDays: 10,
    shiftType: 'Short Visit (1-2 Hours)',
    dailyRate: 850,
    baseCareCharges: 8500,
    consumablesCharges: 1200,
    taxes: 0,
    totalCharges: 9700,
    amountPaid: 9700,
    balanceDue: 0,
    payments: [
      {
        id: 'pay-2',
        amount: 9700,
        paymentMode: 'Credit/Debit Card',
        transactionRef: 'TXN-CC-99412',
        paidAt: '2026-10-12T11:00:00Z',
        receivedBy: 'Rajesh Malhotra',
        receiptNumber: 'REC-2026-002',
        notes: 'Full payment for 10 alternate day visits'
      }
    ],
    refunds: [],
    totalRefunded: 0,
    extensions: [],
    status: 'ACTIVE',
    notes: 'Knee dressing pack provided by patient.',
    createdAt: '2026-10-12T09:00:00Z',
    updatedAt: '2026-10-12T11:00:00Z'
  }
];



