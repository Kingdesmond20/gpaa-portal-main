
export interface NavItem {
  label: string;
  href: string;
  submenu?: NavItem[];
}

export interface NewsItem {
  category: string;
  title: string;
  description: string;
  image: string;
  date?: string;
  /** Where to read the full story: an external URL, or an internal path (starts with '/'). */
  link: string;
  /** Publication name for external links (e.g. "MyJoyOnline"); omit for internal GPAA pages. */
  source?: string;
}

export interface PillarItem {
  title: string;
  description: string;
  icon: string;
}

export interface Executive {
  name: string;
  role: string;
  image: string;
  bio?: string;
}

export interface HistoryEvent {
  year: string;
  title: string;
  description: string;
}

export interface MembershipCategory {
  title: string;
  description: string;
  fees: string;
  benefits: string[];
  icon: string;
}

export interface Event {
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  type: 'upcoming' | 'past';
}

export interface Program {
  title: string;
  description: string;
  image: string;
  icon: string;
  category: string;
}

export type PartnerCategory =
  | 'Government & Regulatory'
  | 'Healthcare Institutions'
  | 'Professional Associations'
  | 'Labour Unions'
  | 'International';

export interface Partner {
  name: string;
  logo?: string;
  description?: string;
  category: PartnerCategory;
}

export interface RegionalExecutive {
  name: string;
  role: 'Chairman' | 'Secretary';
  region: string;
  image?: string;
  phone?: string;
  email?: string;
}

export interface WelfarePaymentMethod {
  type: 'Mobile Money' | 'Bank' | 'Shortcode';
  name: string;
  number: string;
  details?: string;
}

export type DocumentCategory = 'Financial' | 'Reports' | 'Calendar' | 'Policies' | 'Forms';
export type DocumentVisibility = 'public' | 'members';

export interface Document {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  storagePath: string;
  fileSizeBytes: number | null;
  visibility: DocumentVisibility;
  uploadedBy: string | null;
  createdAt: string;
}

export interface MemberProfile {
  id: string;
  firstName: string;
  lastName: string;
  category: string;
  region: string;
  district: string;
  facility: string;
  email?: string;
  phone?: string;
  showContact: boolean;
}

export interface TrustSignal {
  icon: string;
  stat: string;
  label: string;
}

export type UserRole = 'member' | 'admin';

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  createdAt: string;
  membershipExpiryDate: string | null;
}

export type InvitationStatus = 'pending' | 'accepted' | 'revoked';

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  invitedBy: string | null;
  createdAt: string;
  acceptedAt: string | null;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'needs_correction';

export interface MembershipApplication {
  id: string;
  userId: string | null;
  category: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  mdcLicenseNumber: string;
  staffId: string;
  employer: string;
  region: string;
  district: string;
  facility: string;
  address: string;
  status: ApplicationStatus;
  adminNotes: string | null;
  correctionMessage: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  submittedAt: string;
  updatedAt: string;
}

export interface MembershipApplicationInput {
  category: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  mdcLicenseNumber: string;
  staffId: string;
  employer: string;
  region: string;
  district: string;
  facility: string;
  address: string;
}

export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface Payment {
  id: string;
  userId: string;
  applicationId: string | null;
  category: string;
  amountPesewas: number;
  currency: string;
  paystackReference: string;
  status: PaymentStatus;
  periodStart: string | null;
  periodEnd: string | null;
  createdAt: string;
  paidAt: string | null;
}

export interface MembershipCertificate {
  id: string;
  userId: string;
  paymentId: string | null;
  certificateNumber: string;
  category: string;
  issuedAt: string;
  validFrom: string;
  validUntil: string;
  storagePath: string;
}
