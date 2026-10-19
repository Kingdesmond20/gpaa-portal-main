
import { NavItem, NewsItem, PillarItem, Executive, HistoryEvent, MembershipCategory, Event, Program, Partner, PartnerCategory, RegionalExecutive, TrustSignal, WelfarePaymentMethod } from './types';

export const NAV_LINKS: NavItem[] = [
  { label: 'Home', href: '/' },
  { 
    label: 'About', 
    href: '/about',
    submenu: [
      { label: 'Mission & Vision', href: '/about#mission' },
      { label: 'History', href: '/about#history' },
      { label: 'National Leadership', href: '/about#leadership' },
      { label: 'Regional Executives', href: '/about#regional' },
      { label: 'Partners', href: '/about#partners' },
    ]
  },
  { 
    label: 'Membership', 
    href: '/membership',
    submenu: [
      { label: 'Benefits', href: '/membership#benefits' },
      { label: 'Categories', href: '/membership#categories' },
      { label: 'Member Login', href: '/login' },
      { label: 'Members Directory', href: '/members-directory' },
    ]
  },
  { 
    label: 'Events', 
    href: '/events',
    submenu: [
      { label: 'All Events', href: '/events' },
      { label: 'Programs', href: '/programs' },
      { label: 'Conference Archive', href: '/events/conference-archive' },
    ]
  },
  { label: 'Awards', href: '/awards' },
  { label: 'News', href: '/news' },
  { 
    label: 'Resources', 
    href: '/resources',
    submenu: [
      { label: 'All Resources', href: '/resources' },
      { label: 'Documents & Reports', href: '/documents' },
      { label: 'Forms & Policies', href: '/documents#forms' },
      { label: 'Welfare', href: '/welfare' },
    ]
  },
  { 
    label: 'Get Involved', 
    href: '/get-involved',
    submenu: [
      { label: 'Volunteer', href: '/get-involved/volunteer' },
      { label: 'Internship / Careers', href: '/get-involved/careers' },
      { label: 'Partnerships', href: '/get-involved/partnerships' },
      { label: 'Advocacy', href: '/advocacy' },
      { label: 'Donate', href: '/donate' },
    ]
  },
  { label: 'Contact', href: '/contact' },
];

export const PILLARS: PillarItem[] = [
  {
    title: 'Advocacy',
    description: "Representing Physician Assistants in policy-making, legislative reforms, and workplace rights across Ghana's health sectors.",
    icon: 'gavel',
  },
  {
    title: 'Professional Development',
    description: "Providing world-class CPD programs, training workshops, and resources to ensure our members stay at the clinical forefront.",
    icon: 'school',
  },
  {
    title: 'Community Engagement',
    description: "Fostering a strong network of professionals through regional branches and national outreach initiatives.",
    icon: 'groups',
  },
];

// Real, dated, and linked to their original source — see docs/news-sourcing.md
// for how each one was verified. Nothing here is invented; an item with no
// verifiable public source doesn't go in this list.
export const NEWS: NewsItem[] = [
  {
    category: 'Policy Update',
    title: 'Government and GPAA Sign Landmark Conditions of Service Agreement',
    description: "The Ministry of Health, Fair Wages and Salaries Commission, and GPAA finalized a Conditions of Service agreement after months of negotiation. FWSC CEO Ben Arthur praised \u201cthe critical role Physician Assistants played in Ghana's healthcare delivery system,\u201d and GPAA President Peter Akudugu Ayamba called it \u201ca significant milestone in improving working conditions and benefits.\u201d",
    image: '/images/stock/advocacy-fair-wages.jpg',
    date: 'Aug 6, 2024',
    link: 'https://fairwages.gov.gh/1592-2/',
    source: 'Fair Wages and Salaries Commission',
  },
  {
    category: 'Conference',
    title: '22nd Annual General Conference Held in Kasoa',
    description: 'GPAA\u2019s 22nd Annual General Conference ran under the theme \u201cRepositioning Physician Assistants for Leadership in Primary Health Care: A Call for Innovation, Collaboration and Professional Recognition\u201d at the Pentecost Convention Centre, Millennium City.',
    image: '/images/22nd-conference/PSX_20251025_112435.jpg',
    date: 'Oct 21\u201325, 2025',
    link: '/events/conference-archive/22nd',
  },
  {
    category: 'Advocacy',
    title: "Physician Assistants Champion Universal Health Coverage at 21st Annual Conference",
    description: 'At GPAA\u2019s 21st Annual Conference in Ho, President Peter Akudugu Ayamba said PAs \u201cserve as the backbone of healthcare delivery, often working in remote areas where other medical professionals may not be present,\u201d and called for faster financial clearance for over 4,000 qualified PAs awaiting recruitment.',
    image: '/images/21st-conference/21st Annual Confrence GPAA-138.jpg',
    date: 'Oct 25, 2024',
    link: 'https://www.myjoyonline.com/ghanas-physician-assistants-champion-for-universal-health-coverage-amidst-challenges/',
    source: 'MyJoyOnline',
  },
];

// A further real, dated, sourced story — kept separate from NEWS so the home
// page's 3-card grid doesn't grow; shown on /news and /news-resources.
export const MORE_NEWS: NewsItem[] = [
  {
    category: 'Advocacy',
    title: 'GPAA Appeals to Government to Deploy Newly Qualified Physician Assistants',
    description:
      'GPAA asked government to post roughly 1,000 qualified graduates who had gone unemployed for three to four years, saying PAs in rural health institutions are essential to healthcare delivery.',
    image: '/images/stock/advocacy-handshake.jpg',
    date: 'Oct 27, 2023',
    link: 'https://www.graphic.com.gh/news/general-news/ghananewspost-newly-qualified-physician-assistants-association-appeals-to-govt.html',
    source: 'Graphic Online',
  },
];

// Ordered by executive hierarchy: President leads, then the operational
// officers in rank order.
export const EXECUTIVES: Executive[] = [
  {
    name: 'Peter Akudugu Ayamba',
    role: 'President',
    image: '/images/president.jpg',
    bio: 'Mr. Peter Akudugu Ayamba is a highly accomplished Physician Assistant and Public Health professional with over two decades of experience in clinical practice, health systems management, and community health development. He currently serves as the Diocesan Health Director of the Navrongo–Bolgatanga Catholic Health Service and the National President of the Ghana Physician Assistants Association (GPAA), providing strategic leadership and policy direction to improve healthcare delivery and the welfare of Physician Assistants across Ghana. Mr. Ayamba holds a Master of Philosophy (MPhil) in Community Health Development (Participatory Planning, Monitoring, and Evaluation), a Bachelor of Science in Public Health and an Advanced Diploma in Community Medicine and Health (Physician Assistantship). Additionally, he has also completed a Certificate in Leadership and Management in Health from the University of Washington, USA. A passionate advocate for equitable and quality healthcare, Mr. Ayamba has led and implemented several high-impact health projects, including the Strengthening Alliance for Responsive and Integrated Health (STAR) Project, the COVID-19 Emergency Response Project (CERP), and the Promoting Child Health Programme in partnership with international and national development agencies.',
  },
  {
    name: 'Emmanuel Kofi Nti Brantuo',
    role: 'Vice President',
    image: '/images/vice-president.jpg',
    bio: 'Born on the 16/05/1975 and is married with children. He holds a Master of Public Health degree, a BSc in Public Health, Adv. Diploma in Community Medicine and Health, and Diploma in Registered General Nursing.',
  },
  {
    name: 'Peter Eyram Kuenyefu',
    role: 'General Secretary/CEO',
    image: '/images/gen-secretary.jpg',
    bio: 'Born in 1980. He is a District Director of Health Service who holds a Master of Public Health Degree, BSc Physician Assistantship, Adv. Diploma in Community Medicine and Health and a Diploma in Registered General Nursing. He also Certificates in Leadership and Management in Health, and Monitoring and Evaluation in Global Health, all from the University of Washington, USA.',
  },
  {
    name: 'Kofi Adjei Ntiri',
    role: 'Vice General Secretary',
    image: '/images/vice-secretary.jpg',
    bio: 'Born in 1984 and married with children. Has Master of Public Health Degree, BSc Physician Assistantship, Adv. Diploma in Community Medicine and Health, and Diploma (General Nursing).',
  },
  {
    name: 'John Mbeibo Lalibe',
    role: 'National Financial Secretary',
    image: '/images/fin-secretary.jpg',
    bio: 'He is a Principal Physician Assistant, married with children and with MPhil in Epidemiology and Disease Control, BSc Physician Assistantship and BSc Nursing.',
  },
  {
    name: 'Balchisu Abukari',
    role: 'National Treasurer',
    image: '/images/treasurer.jpg',
    bio: 'Born on the 05/09/1967 and married with a child. She holds a BSc in Physician Assistantship, an Adv. Diploma in Community Health and Medicine and a Diploma in Registered General Nursing.',
  },
  {
    name: 'Zenobia Tsibuah',
    role: 'National Public Relationship Officer',
    image: '/images/pro.jpg',
    bio: 'She holds an M.Phil. in Public Health, BSc Physician Assistantship and Adv. Diploma in Community Medicine and Health.',
  },
];

export const HISTORY: HistoryEvent[] = [
  {
    year: '1969',
    title: 'Birth of the Profession',
    description: 'The first cohort of Medical Assistants graduated from Ghana\'s pioneer Medical Assistant Training School, establishing the foundation for mid-level healthcare professionals in the country.',
  },
  {
    year: '1980',
    title: 'Professional Association Established',
    description: 'The Ghana Medical Assistants Association (GMAA) was formally constituted to advocate for practitioners\' rights, welfare, and professional development across the nation.',
  },
  {
    year: '1999',
    title: 'Curriculum Modernization',
    description: 'Introduction of the enhanced 3-year Diploma program, expanding clinical competencies and aligning training with international standards for physician assistants.',
  },
  {
    year: '2010',
    title: 'Transition to Physician Assistants',
    description: 'Official rebranding from Medical Assistants to Physician Assistants (PA), reflecting expanded scope of practice and global alignment with the PA profession.',
  },
  {
    year: '2016',
    title: 'Degree Program Launch',
    description: 'First Bachelor of Science in Physician Assistantship Studies programs accredited, elevating the profession to degree-level training and enhanced clinical autonomy.',
  },
  {
    year: 'Today',
    title: 'Leading Primary Healthcare',
    description: 'GPAA represents over 6,000 practicing PAs nationwide, championing universal health coverage through CHPS zones, district hospitals, and specialized clinical services.',
  },
];

export const MEMBERSHIP_CATEGORIES: MembershipCategory[] = [
  {
    title: 'Professional Member',
    description: 'For licensed Physician Assistants working in public/government health facilities',
    fees: 'GH₵ 200/year',
    benefits: [
      'CPD credits and training programs',
      'Legal and professional support',
      'Advocacy representation',
      'Access to job opportunities',
      'Annual conference access',
      'Professional indemnity insurance support',
      'Welfare benefits'
    ],
    icon: 'badge'
  },
  {
    title: 'Private Member',
    description: 'For licensed Physician Assistants in private practice or privately employed',
    fees: 'GH₵ 250/year',
    benefits: [
      'CPD credits and training programs',
      'Legal and professional support',
      'Access to job opportunities',
      'Annual conference access',
      'Professional indemnity insurance support',
      'Networking opportunities'
    ],
    icon: 'business_center'
  },
  {
    title: 'Junior Physician Assistant',
    description: 'For newly graduated PAs within their first 3 years of practice',
    fees: 'GH₵ 100/year',
    benefits: [
      'Mentorship program access',
      'Discounted CPD programs',
      'Career development support',
      'Job placement assistance',
      'Reduced conference fees',
      'Networking events'
    ],
    icon: 'school'
  },
  {
    title: 'Retired',
    description: 'For retired Physician Assistants who wish to remain connected',
    fees: 'GH₵ 50/year',
    benefits: [
      'Stay connected with PA community',
      'Honorary member privileges',
      'Newsletter and updates',
      'Conference attendance (discounted)',
      'Advisory roles opportunities'
    ],
    icon: 'elderly'
  }
];

export const PROGRAMS: Program[] = [
  {
    title: 'Continuous Professional Development (CPD)',
    description: 'Regular training workshops, seminars, and online courses to keep members updated with latest medical practices and guidelines.',
    image: '/images/stock/cpd-training-center-2.jpg',
    icon: 'school',
    category: 'Education'
  },
  {
    title: 'Rural Health Initiative',
    description: 'Supporting PAs in underserved communities through resource allocation, incentive advocacy, and regular health outreaches.',
    image: '/images/stock/rural-labor-ward.jpg',
    icon: 'villa',
    category: 'Community'
  },
  {
    title: 'Research & Publication Support',
    description: 'Mentorship and funding opportunities for members to conduct and publish medical research in peer-reviewed journals.',
    image: '/images/stock/research-lab-sample.jpg',
    icon: 'science',
    category: 'Research'
  },
  {
    title: 'Mental Health & Wellness Program',
    description: 'Providing psychological support and wellness resources for PAs dealing with occupational stress and burnout.',
    image: '/images/stock/community-outreach-mothers.jpg',
    icon: 'psychology',
    category: 'Wellness'
  },
  {
    title: 'Legislative Advocacy',
    description: 'Active engagement with policymakers to improve PA working conditions, scope of practice, and professional recognition.',
    image: '/images/stock/advocacy-handshake.jpg',
    icon: 'gavel',
    category: 'Advocacy'
  },
  {
    title: 'Youth Mentorship Program',
    description: 'Connecting practicing PAs with students and recent graduates for career guidance and professional development.',
    image: '/images/stock/conference-panel.jpg',
    icon: 'diversity_3',
    category: 'Mentorship'
  }
];

export const EVENTS: Event[] = [
  {
    title: 'Annual General Conference 2026 - Kumasi',
    date: 'August 15-17, 2026',
    location: 'Golden Tulip Hotel, Kumasi',
    description: 'Our flagship event bringing together PAs from across Ghana for networking, CPD, and celebrating excellence in healthcare delivery.',
    image: '/images/stock/conference-panel.jpg',
    type: 'upcoming'
  },
  {
    title: 'Regional CPD Workshop - Northern Zone',
    date: 'June 5-7, 2026',
    location: 'Tamale Teaching Hospital',
    description: 'Specialized training on emergency care protocols and tropical disease management for Northern region members.',
    image: '/images/stock/cpd-training-center-1.jpg',
    type: 'upcoming'
  },
  {
    title: 'National Health Screening Outreach',
    date: 'May 20, 2026',
    location: 'Multiple locations nationwide',
    description: 'Free health screening initiative across 10 regions providing diabetes, hypertension, and general health checks to underserved communities.',
    image: '/images/stock/health-screening-outreach.jpg',
    type: 'upcoming'
  },
  {
    title: 'Leadership & Governance Summit',
    date: 'March 12-13, 2026',
    location: 'Accra International Conference Centre',
    description: 'Training for regional executives and aspiring leaders in healthcare administration and association governance.',
    image: '/images/stock/conference-delegate.jpg',
    type: 'upcoming'
  },
  {
    title: '2025 Annual General Meeting',
    date: 'November 20-22, 2025',
    location: 'Labadi Beach Hotel, Accra',
    description: 'Successful completion of our 2025 AGM with record attendance, featuring elections, policy reviews, and strategic planning sessions.',
    image: '/images/stock/community-cultural.jpg',
    type: 'past'
  },
  {
    title: 'National CPD Training Series 2025',
    date: 'September 10-12, 2025',
    location: 'Multiple regional centers',
    description: 'Comprehensive continuing professional development workshops conducted across all regions, enhancing clinical skills and evidence-based practice.',
    image: '/images/stock/cpd-training-center-2.jpg',
    type: 'past'
  }
];

export const PARTNER_CATEGORIES: PartnerCategory[] = [
  'Government & Regulatory',
  'Healthcare Institutions',
  'Professional Associations',
  'Labour Unions',
  'International',
];

export const PARTNERS: Partner[] = [
  {
    name: 'Ministry of Health',
    logo: '/images/partners/ministry-of-health.png',
    description: 'Collaborative partner in health policy and workforce development',
    category: 'Government & Regulatory'
  },
  {
    name: 'Ghana Health Service',
    logo: '/images/partners/ghana-health-service.jpg',
    description: 'Primary employer and implementation partner',
    category: 'Government & Regulatory'
  },
  {
    name: 'Christian Health Associations of Ghana',
    logo: '/images/partners/chag.png',
    description: 'Faith-based health service delivery partnership',
    category: 'Healthcare Institutions'
  },
  {
    name: 'Medical and Dental Council',
    logo: '/images/partners/medical-dental-council.png',
    description: 'Professional regulatory and licensing authority',
    category: 'Government & Regulatory'
  },
  {
    name: 'Ghana Labour Commission',
    logo: '/images/partners/national-labour-commission.jpg',
    description: 'Labour relations and workplace standards partner',
    category: 'Government & Regulatory'
  },
  {
    name: 'Global Association of Physician Associates and Clinical Officers',
    logo: '/images/partners/gacopa.png',
    description: 'International professional networking and advocacy',
    category: 'International'
  },
  {
    name: 'Ghana Medical Association',
    logo: '/images/partners/ghana-medical-association.jpg',
    description: 'Multi-professional healthcare collaboration',
    category: 'Professional Associations'
  },
  {
    name: 'Ghana Association of Certified Registered Anaesthetists',
    logo: '/images/partners/gacra.png',
    description: 'Allied health professional partnership',
    category: 'Professional Associations'
  },
  {
    name: 'Ghana Registered Nurses and Midwives Association',
    logo: '/images/partners/grnma.png',
    description: 'Nursing and midwifery collaboration',
    category: 'Professional Associations'
  },
  {
    name: 'Medical Laboratory Professional Workers Union',
    logo: '/images/partners/mlpwu.jpg',
    description: 'Laboratory services professional partnership',
    category: 'Labour Unions'
  },
  {
    name: 'Ghana Association of Medical Herbalists',
    logo: '/images/partners/gamh.jpg',
    description: 'Traditional and complementary medicine collaboration',
    category: 'Professional Associations'
  },
  {
    name: 'Government and Hospital Pharmacists Association',
    logo: '/images/partners/ghospa.jpg',
    description: 'Pharmaceutical services partnership',
    category: 'Professional Associations'
  },
  {
    name: 'Health Accounting Staff Association of Ghana',
    logo: '/images/partners/hasag.png',
    description: 'Healthcare financial management collaboration',
    category: 'Labour Unions'
  },
  {
    name: 'FORUM Federation',
    description: 'Health sector federation partnership',
    category: 'Labour Unions'
  },
  {
    name: 'Joint Health Sector Unions',
    logo: '/images/partners/jhsu.jpg',
    description: 'Unified health sector advocacy',
    category: 'Labour Unions'
  },
  {
    name: 'Trade Union Congress',
    logo: '/images/partners/trade-union-congress.jpg',
    description: 'National labour movement affiliation',
    category: 'Labour Unions'
  },
  {
    name: 'Organised Labour',
    description: 'Broader labour movement collaboration',
    category: 'Labour Unions'
  }
];

// The final card in the Regional Executives section (after all the regions).
export const REGIONAL_EXECUTIVE_JPAAG_GROUP = 'JPAAG Representative';

export const REGIONAL_EXECUTIVES: RegionalExecutive[] = [
  { name: 'Bernice Dery-Kuuzume', role: 'Chairman', region: 'Greater Accra', phone: '0207438264', image: '/images/regional/greater-accra-chairman.jpg' },
  { name: 'Prince Owusu Mensah', role: 'Secretary', region: 'Greater Accra', phone: '0246042998', image: '/images/regional/greater-accra-secretary.jpg' },
  { name: 'Michael Kofi Agyei', role: 'Chairman', region: 'Ashanti', phone: '0244248501' },
  { name: 'Kwaku Saah Adu', role: 'Secretary', region: 'Ashanti', phone: '0243786693', image: '/images/regional/ashanti-secretary.jpg' },
  { name: 'Nominaba G. Dauda', role: 'Chairman', region: 'Northern', phone: '0249210602' },
  { name: 'Yakubu Seidu', role: 'Secretary', region: 'Northern', phone: '0244965502', image: '/images/regional/northern-secretary.jpg' },
  { name: 'Buabeng Appiagyei', role: 'Chairman', region: 'Eastern', phone: '0547261965' },
  { name: 'Seth Kwame Glefoti', role: 'Secretary', region: 'Eastern', phone: '0244955490', image: '/images/regional/eastern-secretary.jpg' },
  { name: 'Obed Etornam Agbokpey', role: 'Chairman', region: 'Central', phone: '0202453779' },
  { name: 'Nana Abronoma Nyarko-Addo', role: 'Secretary', region: 'Central', phone: '0242810452', image: '/images/regional/central-secretary.jpg' },
  { name: 'Stephen Addo Kwapong', role: 'Chairman', region: 'Western', phone: '0249814665', image: '/images/regional/western-chairman.png' },
  { name: 'Rabi Abdulai', role: 'Secretary', region: 'Western', phone: '0244534521', image: '/images/regional/western-secretary.png' },
  { name: 'Emmanuel Egu', role: 'Chairman', region: 'Volta', phone: '0246470608' },
  { name: 'Samlafo Agbesi Anthony', role: 'Secretary', region: 'Volta', phone: '0245406648', image: '/images/regional/volta-secretary.jpg' },
  { name: 'Lord Adolph Sika', role: 'Chairman', region: 'Oti', phone: '0246633520' },
  { name: 'Rev Patrick Lotsu', role: 'Secretary', region: 'Oti', phone: '0244187304', image: '/images/regional/oti-secretary.jpg' },
  { name: 'Atsu James Adababu', role: 'Chairman', region: 'Western North', phone: '0244852498' },
  { name: 'Ron Sutherland', role: 'Secretary', region: 'Western North', phone: '0249994871' },
  { name: 'Raymond A Adoganga', role: 'Chairman', region: 'Upper East', phone: '0208987105 / 0242919206', image: '/images/regional/upper-east-chairman.jpg' },
  { name: 'Bolsong Janet Bapeeri', role: 'Secretary', region: 'Upper East', phone: '0555828512' },
  { name: 'Adama Sina', role: 'Chairman', region: 'Upper West', phone: '0201167468' },
  { name: 'Bansi Ibrahim Haruna', role: 'Secretary', region: 'Upper West', phone: '0201171909' },
  { name: 'Benjamin Fosu', role: 'Chairman', region: 'Bono & Ahafo', phone: '0244848059', image: '/images/regional/bono-ahafo-chairman.jpg' },
  { name: 'Adu Adjei Joshua', role: 'Secretary', region: 'Bono & Ahafo', phone: '0241843484', image: '/images/regional/bono-ahafo-secretary.jpg' },
  { name: 'Salifu Jonah Panwum', role: 'Chairman', region: 'Bono East', phone: '0244468913', image: '/images/regional/bono-east-chairman.jpg' },
  { name: 'Philip Yaw Bomfeh', role: 'Secretary', region: 'Bono East', phone: '0242643581', image: '/images/regional/bono-east-secretary.jpg' },
  { name: 'Mumuni Iddrisu', role: 'Chairman', region: 'North East', phone: '0249822050', image: '/images/regional/north-east-chairman.jpg' },
  { name: 'Amina Issahaku', role: 'Secretary', region: 'North East', email: 'northeast.sec@gpaa.org.gh', phone: '+233 24 XXX XXXX' },
  { name: 'Sebuabe Peter Mawumenyo', role: 'Chairman', region: 'Savannah', email: 'savannah.chair@gpaa.org.gh', phone: '+233 24 XXX XXXX', image: '/images/regional/savannah-chairman.jpg' },
  { name: 'Salima Musah', role: 'Secretary', region: 'Savannah', email: 'savannah.sec@gpaa.org.gh', phone: '+233 24 XXX XXXX' },
  // Listed last, after all the regions — not a geographic region: GPAA's
  // representative to JPAAG (the Joint Physician Assistants Association Ghana).
  { name: 'Emmanuel Frimpong Sarpong', role: 'Chairman', region: REGIONAL_EXECUTIVE_JPAAG_GROUP, phone: '0548800764', image: '/images/regional/emmanuel-frimpong-sarpong.jpg' },
];

// Regions as shown in the Regional Executives section of the About page. Bono
// and Ahafo share one regional executive, giving the association's 15 regional
// branches. (GHANA_REGIONS below stays the full list of 16 administrative
// regions: it drives the membership form and members directory.)
export const REGIONAL_EXECUTIVE_REGIONS = [
  'Greater Accra', 'Ashanti', 'Northern', 'Eastern', 'Central', 'Western',
  'Volta', 'Oti', 'Western North', 'Upper East', 'Upper West', 'Bono & Ahafo',
  'Bono East', 'North East', 'Savannah'
];

// What the About page renders, in order: one card per regional branch, then the
// Regional Executive Chairman card last.
export const REGIONAL_EXECUTIVE_GROUPS: { key: string; title: string }[] = [
  ...REGIONAL_EXECUTIVE_REGIONS.map((region) => ({ key: region, title: `${region} Region` })),
  { key: REGIONAL_EXECUTIVE_JPAAG_GROUP, title: REGIONAL_EXECUTIVE_JPAAG_GROUP },
];

export const GHANA_REGIONS = [
  'Greater Accra', 'Ashanti', 'Northern', 'Eastern', 'Central', 'Western',
  'Volta', 'Oti', 'Western North', 'Upper East', 'Upper West', 'Bono',
  'Bono East', 'Ahafo', 'North East', 'Savannah'
];

export const EMPLOYER_CATEGORIES = [
  'Ghana Health Service',
  'Teaching Hospital',
  'Regional Hospital',
  'District Hospital', 
  'CHAG (Christian Health Association of Ghana)',
  'Ahmadiyya Mission',
  'Police Hospital',
  'Military Hospital',
  'Prison Service Hospital',
  'Private Hospital',
  'Private Clinic',
  'NGO Health Facility',
  'Self-Employed',
  'Other'
];

export const TRUST_SIGNALS: TrustSignal[] = [
  { icon: 'groups', stat: '6,000+', label: 'Active Members Nationwide' },
  { icon: 'event_available', stat: '40+', label: 'Years Serving Ghana' },
  { icon: 'location_city', stat: '15', label: 'Regional Branches' },
  { icon: 'verified', stat: '100%', label: 'MDC Accredited' },
  { icon: 'health_and_safety', stat: '500+', label: 'Annual CPD Programs' },
  { icon: 'volunteer_activism', stat: '10,000+', label: 'Lives Impacted Yearly' }
];

export const WELFARE_PAYMENT_METHODS: WelfarePaymentMethod[] = [
  {
    type: 'Mobile Money',
    name: 'MTN Mobile Money',
    number: '0XX XXX XXXX',
    details: 'GPAA Welfare Account'
  },
  {
    type: 'Mobile Money',
    name: 'Vodafone Cash',
    number: '0XX XXX XXXX',
    details: 'GPAA Welfare Account'
  },
  {
    type: 'Bank',
    name: 'GCB Bank',
    number: '1234567890',
    details: 'Account Name: GPAA Welfare Fund | Branch: Accra Main'
  },
  {
    type: 'Shortcode',
    name: 'Bank Network Shortcode',
    number: '*713*XXXX#',
    details: 'Quick payment via USSD'
  }
];
