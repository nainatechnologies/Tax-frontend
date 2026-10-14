export type UserRole = 'USER' | 'CA' | 'ADMIN';

export type EmploymentType =
  | 'individual'
  | 'private'
  | 'government'
  | 'business'
  | 'freelancer'
  | 'Salaried'
  | 'Business / Profession'
  | 'Freelancer / Consultant'
  | 'Active Investor / Trader'
  | 'NRI Taxpayer';

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  isPrimary?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  panNumber: string;
  aadhaarNumber: string;
  maskedPan?: string;
  maskedAadhaar?: string;
  employmentType: EmploymentType | string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  bankAccounts?: BankAccount[];
  role: UserRole;
  createdAt: string;
  createdDate?: string;
}

export interface CharteredAccountant {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  phone?: string;
  employeeId: string; // ICAI Membership/Reg ID e.g. "FCA-48201"
  specialization: string;
  experience: string;
  status: 'active' | 'busy' | 'inactive';
  activeCases: number;
  rating: number;
  completedCasesCount: number;
}

export type CaseStatus =
  | 'NEW'
  | 'DOCUMENTS_PENDING'
  | 'DOCUMENTS_SUBMITTED'
  | 'CA_ASSIGNMENT_PENDING'
  | 'CA_ASSIGNED'
  | 'UNDER_REVIEW'
  | 'ADDITIONAL_DOCUMENT_REQUIRED'
  | 'ADDITIONAL_DOCUMENT_SUBMITTED'
  | 'PROCESSING'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'COMPLETED';

export type DocumentStatus =
  | 'Uploaded'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Additional Document Required';

export interface TaxDocument {
  id: string;
  caseId: string;
  userId: string;
  financialYear: string; // e.g. "FY 2023-2024"
  folderName: string; // e.g. "ITR_2023_2024"
  documentType: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'jpeg' | 'png';
  uploadDate: string;
  status: DocumentStatus;
  rejectionReason?: string;
  isAdditionalDoc?: boolean;
  fileDataUrl?: string;
}

export interface AdditionalDocRequest {
  id: string;
  caseId: string;
  documentName: string;
  reason: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  requestedBy: string; // CA Name
  requestedAt: string;
  status: 'Pending' | 'Uploaded' | 'Approved';
  uploadedDocId?: string;
}

export interface TaxCase {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  serviceId: string;
  serviceTitle: string;
  financialYear: string; // e.g. "FY 2023-2024"
  assessmentYear: string; // e.g. "AY 2024-2025"
  folderName: string; // "ITR_2023_2024"
  status: CaseStatus;
  caId?: string;
  caName?: string;
  caRegNumber?: string;
  caSpecialization?: string;
  fee: number;
  gst: number;
  totalAmount: number;
  paymentStatus: 'Unpaid' | 'Pending' | 'Paid';
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  invoiceId?: string;
  acknowledgementNumber?: string;
  documentsCount?: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface TaxInvoice {
  id: string;
  caseId: string;
  invoiceNumber: string;
  invoiceDate: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  userPan: string;
  userAddress?: string;
  serviceTitle: string;
  financialYear: string;
  assessmentYear: string;
  caName: string;
  caRegNumber: string;
  fee: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  paymentStatus: 'PAID';
  transactionId: string;
  paymentDate: string;
  paymentMethod: string;
  acknowledgementNumber?: string;
}

export interface TaxNotification {
  id: string;
  targetRole: UserRole | 'ALL';
  targetUserId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface TaxService {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  image: string;
  startingPrice: number;
  turnaroundTime: string;
  requiredDocuments: string[];
  features: string[];
  popular?: boolean;
  badge?: string;
}

export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  stats?: {
    value: string;
    label: string;
  }[];
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  iconName: string;
  category?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  content: string;
  metric?: string;
  refundAmount?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
