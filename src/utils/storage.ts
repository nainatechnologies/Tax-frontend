import {
  User,
  CharteredAccountant,
  TaxCase,
  TaxDocument,
  AdditionalDocRequest,
  TaxInvoice,
  TaxNotification,
  CaseStatus,
  DocumentStatus,
} from '../types';
import {
  SEED_USERS,
  SEED_CAS,
  SEED_CASES,
  SEED_DOCUMENTS,
  SEED_ADDITIONAL_REQUESTS,
  SEED_INVOICES,
  SEED_NOTIFICATIONS,
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'tax-users',
  CAS: 'tax-cas',
  CASES: 'tax-cases',
  DOCUMENTS: 'tax-documents',
  ADDITIONAL_REQUESTS: 'tax-additional-requests',
  INVOICES: 'tax-invoices',
  NOTIFICATIONS: 'tax-notifications',
  SESSION: 'tax-auth-session',
};

export const STORAGE_EVENT = 'tax_storage_update_event';

export const emitStorageChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }
};

// In-memory cache for high-res preview data URLs to avoid blowing localStorage 5MB limit
const docMediaCache = new Map<string, string>();

// Safe JSON parser
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      setStored(key, fallback);
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage, using fallback:`, err);
    return fallback;
  }
}

// Quota-safe storage serializer
function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    // If saving documents, sanitize large fileDataUrl to ensure it fits within browser storage quota
    if (key === STORAGE_KEYS.DOCUMENTS && Array.isArray(value)) {
      const sanitized = (value as TaxDocument[]).map((doc) => {
        if (doc.fileDataUrl) {
          // Cache in memory for interactive preview
          docMediaCache.set(doc.id, doc.fileDataUrl);
          // Omit huge base64 data url from localStorage
          const { fileDataUrl, ...rest } = doc;
          return rest;
        }
        return doc;
      });
      localStorage.setItem(key, JSON.stringify(sanitized));
      emitStorageChange();
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
    emitStorageChange();
  } catch (err: any) {
    console.warn(`Storage quota issue when writing ${key}, attempting graceful recovery:`, err);
    try {
      if (key === STORAGE_KEYS.DOCUMENTS && Array.isArray(value)) {
        // Strip all non-essential binary payloads
        const minimalDocs = (value as TaxDocument[]).map(({ fileDataUrl, ...rest }) => rest);
        localStorage.setItem(key, JSON.stringify(minimalDocs));
        emitStorageChange();
      } else {
        // As emergency fallback, attempt setting directly
        localStorage.setItem(key, JSON.stringify(value));
        emitStorageChange();
      }
    } catch (innerErr) {
      console.warn(`Could not persist ${key} due to browser storage limitations; keeping state active in memory.`, innerErr);
      emitStorageChange();
    }
  }
}

// Initialize seed data if not present, and sanitize any legacy oversized documents
export const initStorage = () => {
  if (typeof window === 'undefined') return;

  try {
    // Clean up any legacy bloated tax-documents that might have caused quota errors
    const existingDocsStr = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (existingDocsStr) {
      try {
        const parsed = JSON.parse(existingDocsStr);
        if (Array.isArray(parsed)) {
          let hasBloat = false;
          const cleaned = parsed.map((doc: any) => {
            if (doc.fileDataUrl && doc.fileDataUrl.length > 500) {
              hasBloat = true;
              docMediaCache.set(doc.id, doc.fileDataUrl);
              const { fileDataUrl, ...rest } = doc;
              return rest;
            }
            return doc;
          });
          if (hasBloat) {
            localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(cleaned));
          }
        }
      } catch (parseErr) {
        console.warn('Resetting corrupt documents key in storage:', parseErr);
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(SEED_DOCUMENTS));
      }
    } else {
      setStored(STORAGE_KEYS.DOCUMENTS, SEED_DOCUMENTS);
    }
  } catch (e) {
    console.warn('Initial storage cleanup error:', e);
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setStored(STORAGE_KEYS.USERS, SEED_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CAS)) {
    setStored(STORAGE_KEYS.CAS, SEED_CAS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CASES)) {
    setStored(STORAGE_KEYS.CASES, SEED_CASES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADDITIONAL_REQUESTS)) {
    setStored(STORAGE_KEYS.ADDITIONAL_REQUESTS, SEED_ADDITIONAL_REQUESTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
    setStored(STORAGE_KEYS.INVOICES, SEED_INVOICES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setStored(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  }

};

// ================= USER & AUTH STORAGE =================

export const getUsers = (): User[] => {
  return getStored<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  setStored(STORAGE_KEYS.USERS, users);
};

export const getCurrentUser = (): User | null => {
  return getStored<User | null>(STORAGE_KEYS.SESSION, null);
};

export const setCurrentUser = (user: User | null): void => {
  setStored(STORAGE_KEYS.SESSION, user);
};

export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    emitStorageChange();
  }
};

// ================= CA STORAGE =================

export const getCAs = (): CharteredAccountant[] => {
  return getStored<CharteredAccountant[]>(STORAGE_KEYS.CAS, SEED_CAS);
};

export const saveCA = (ca: CharteredAccountant): void => {
  const cas = getCAs();
  const index = cas.findIndex((c) => c.id === ca.id);
  if (index >= 0) {
    cas[index] = ca;
  } else {
    cas.push(ca);
  }
  setStored(STORAGE_KEYS.CAS, cas);
};

// ================= TAX CASES STORAGE =================

export const getCases = (): TaxCase[] => {
  return getStored<TaxCase[]>(STORAGE_KEYS.CASES, SEED_CASES);
};

export const getCaseById = (caseId: string): TaxCase | undefined => {
  const cases = getCases();
  return cases.find((c) => c.id === caseId);
};

export const getCasesByUser = (userId: string): TaxCase[] => {
  return getCases().filter((c) => c.userId === userId);
};

export const getCasesByCA = (caId: string): TaxCase[] => {
  return getCases().filter((c) => c.caId === caId);
};

export const saveCase = (taxCase: TaxCase): void => {
  const cases = getCases();
  const index = cases.findIndex((c) => c.id === taxCase.id);
  if (index >= 0) {
    cases[index] = { ...taxCase, updatedAt: new Date().toISOString() };
  } else {
    cases.unshift(taxCase);
  }
  setStored(STORAGE_KEYS.CASES, cases);
};

export const updateCaseStatus = (caseId: string, status: CaseStatus, extraData?: Partial<TaxCase>): void => {
  const cases = getCases();
  const index = cases.findIndex((c) => c.id === caseId);
  if (index >= 0) {
    cases[index] = {
      ...cases[index],
      status,
      ...extraData,
      updatedAt: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.CASES, cases);
  }
};

export const assignCAToCase = (caseId: string, ca: CharteredAccountant): void => {
  const cases = getCases();
  const index = cases.findIndex((c) => c.id === caseId);
  if (index >= 0) {
    cases[index].caId = ca.id;
    cases[index].caName = ca.fullName;
    cases[index].caRegNumber = ca.employeeId;
    cases[index].caSpecialization = ca.specialization;
    cases[index].status = 'CA_ASSIGNED';
    cases[index].updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.CASES, cases);

    // Update CA active cases count
    const cas = getCAs();
    const caIndex = cas.findIndex((c) => c.id === ca.id);
    if (caIndex >= 0) {
      cas[caIndex].activeCases = (cas[caIndex].activeCases || 0) + 1;
      setStored(STORAGE_KEYS.CAS, cas);
    }

    // Add Notification to User
    addNotification({
      targetRole: 'USER',
      targetUserId: cases[index].userId,
      title: 'Chartered Accountant Assigned',
      message: `${ca.fullName} (${ca.employeeId}) has been assigned to your ${cases[index].serviceTitle}.`,
      type: 'success',
      read: false,
      link: '/dashboard',
    });

    // Add Notification to CA
    addNotification({
      targetRole: 'CA',
      title: `New Client Case Assigned: ${cases[index].userName}`,
      message: `You are assigned to Case #${caseId} (${cases[index].serviceTitle}).`,
      type: 'info',
      read: false,
      link: '/ca/dashboard',
    });
  }
};

// ================= TAX DOCUMENTS STORAGE =================

export const getDocuments = (): TaxDocument[] => {
  const docs = getStored<TaxDocument[]>(STORAGE_KEYS.DOCUMENTS, SEED_DOCUMENTS);
  return docs.map((doc) => {
    if (!doc.fileDataUrl && docMediaCache.has(doc.id)) {
      return { ...doc, fileDataUrl: docMediaCache.get(doc.id) };
    }
    return doc;
  });
};

export const getDocumentsByCase = (caseId: string): TaxDocument[] => {
  return getDocuments().filter((d) => d.caseId === caseId);
};

export const getDocumentsByUser = (userId: string): TaxDocument[] => {
  return getDocuments().filter((d) => d.userId === userId);
};

export const saveDocument = (doc: TaxDocument): void => {
  if (doc.fileDataUrl) {
    docMediaCache.set(doc.id, doc.fileDataUrl);
  }
  const docs = getDocuments();
  const index = docs.findIndex((d) => d.id === doc.id);
  if (index >= 0) {
    docs[index] = doc;
  } else {
    docs.unshift(doc);
  }
  setStored(STORAGE_KEYS.DOCUMENTS, docs);
};

export const updateDocumentStatus = (docId: string, status: DocumentStatus, rejectionReason?: string): void => {
  const docs = getDocuments();
  const index = docs.findIndex((d) => d.id === docId);
  if (index >= 0) {
    docs[index].status = status;
    if (rejectionReason) docs[index].rejectionReason = rejectionReason;
    setStored(STORAGE_KEYS.DOCUMENTS, docs);
  }
};

export const deleteDocument = (docId: string): void => {
  docMediaCache.delete(docId);
  const docs = getDocuments().filter((d) => d.id !== docId);
  setStored(STORAGE_KEYS.DOCUMENTS, docs);
};

// ================= ADDITIONAL DOC REQUESTS STORAGE =================

export const getAdditionalRequests = (): AdditionalDocRequest[] => {
  return getStored<AdditionalDocRequest[]>(STORAGE_KEYS.ADDITIONAL_REQUESTS, SEED_ADDITIONAL_REQUESTS);
};

export const getRequestsByCase = (caseId: string): AdditionalDocRequest[] => {
  return getAdditionalRequests().filter((r) => r.caseId === caseId);
};

export const saveAdditionalRequest = (request: AdditionalDocRequest): void => {
  const requests = getAdditionalRequests();
  requests.unshift(request);
  setStored(STORAGE_KEYS.ADDITIONAL_REQUESTS, requests);

  // Update case status to ADDITIONAL_DOCUMENT_REQUIRED
  updateCaseStatus(request.caseId, 'ADDITIONAL_DOCUMENT_REQUIRED');

  // Add Notification to user
  const taxCase = getCaseById(request.caseId);
  if (taxCase) {
    addNotification({
      targetRole: 'USER',
      targetUserId: taxCase.userId,
      title: 'Action Required: Additional Document Requested',
      message: `${request.requestedBy} requested "${request.documentName}" for ${taxCase.serviceTitle}.`,
      type: 'warning',
      read: false,
      link: '/dashboard',
    });
  }
};

export const fulfillAdditionalRequest = (requestId: string, uploadedDocId: string): void => {
  const requests = getAdditionalRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index >= 0) {
    requests[index].status = 'Uploaded';
    requests[index].uploadedDocId = uploadedDocId;
    setStored(STORAGE_KEYS.ADDITIONAL_REQUESTS, requests);

    // Update case status to ADDITIONAL_DOCUMENT_SUBMITTED
    const caseId = requests[index].caseId;
    updateCaseStatus(caseId, 'ADDITIONAL_DOCUMENT_SUBMITTED');

    // Notify CA
    const taxCase = getCaseById(caseId);
    if (taxCase) {
      addNotification({
        targetRole: 'CA',
        title: `Requested Document Uploaded by ${taxCase.userName}`,
        message: `${taxCase.userName} has submitted the requested "${requests[index].documentName}".`,
        type: 'info',
        read: false,
        link: '/ca/dashboard',
      });
    }
  }
};

// ================= INVOICE & PAYMENT STORAGE =================

export const getInvoices = (): TaxInvoice[] => {
  return getStored<TaxInvoice[]>(STORAGE_KEYS.INVOICES, SEED_INVOICES);
};

export const getInvoiceById = (invoiceId: string): TaxInvoice | undefined => {
  return getInvoices().find((i) => i.id === invoiceId || i.invoiceNumber === invoiceId);
};

export const getInvoicesByUser = (userId: string): TaxInvoice[] => {
  return getInvoices().filter((i) => i.userId === userId);
};

export const createInvoice = (invoice: TaxInvoice): void => {
  const invoices = getInvoices();
  invoices.unshift(invoice);
  setStored(STORAGE_KEYS.INVOICES, invoices);

  // Update case status to PAID and COMPLETED
  updateCaseStatus(invoice.caseId, 'COMPLETED', {
    paymentStatus: 'Paid',
    paymentDate: invoice.paymentDate,
    paymentMethod: invoice.paymentMethod,
    transactionId: invoice.transactionId,
    invoiceId: invoice.id,
    acknowledgementNumber: invoice.acknowledgementNumber || `ITR-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
  });

  // Notify User
  addNotification({
    targetRole: 'USER',
    targetUserId: invoice.userId,
    title: 'Payment Successful & Tax Invoice Generated',
    message: `Tax Invoice #${invoice.invoiceNumber} for ₹${invoice.totalAmount.toLocaleString('en-IN')} has been generated. Your ITR filing is completed.`,
    type: 'success',
    read: false,
    link: `/invoice/${invoice.id}`,
  });

  // Notify CA & Admin
  addNotification({
    targetRole: 'CA',
    title: `Payment Received for Case #${invoice.caseId}`,
    message: `${invoice.userName} completed payment for ${invoice.serviceTitle}.`,
    type: 'success',
    read: false,
    link: '/ca/dashboard',
  });

  addNotification({
    targetRole: 'ADMIN',
    title: `Revenue Received: ₹${invoice.totalAmount.toLocaleString('en-IN')}`,
    message: `Invoice #${invoice.invoiceNumber} paid by ${invoice.userName}.`,
    type: 'success',
    read: false,
    link: '/admin/dashboard',
  });
};

export const saveInvoice = createInvoice;

// ================= NOTIFICATIONS STORAGE =================

export const getNotifications = (): TaxNotification[] => {
  return getStored<TaxNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
};

export const addNotification = (notif: Omit<TaxNotification, 'id' | 'createdAt'>): void => {
  const notifs = getNotifications();
  const newNotif: TaxNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  };
  notifs.unshift(newNotif);
  setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
};

export const markNotificationRead = (notifId: string): void => {
  const notifs = getNotifications();
  const index = notifs.findIndex((n) => n.id === notifId);
  if (index >= 0) {
    notifs[index].read = true;
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
};

export const markAllNotificationsRead = (role: string, userId?: string): void => {
  const notifs = getNotifications();
  notifs.forEach((n) => {
    if (n.targetRole === role || n.targetRole === 'ALL' || (userId && n.targetUserId === userId)) {
      n.read = true;
    }
  });
  setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
};

// ================= DATA FORMATTERS & MASKS =================

export const maskPan = (pan?: string): string => {
  if (!pan || pan.length < 5) return 'XXXXX0000X';
  const clean = pan.trim().toUpperCase();
  if (clean.length === 10) {
    return `XXXXX${clean.slice(5, 9)}${clean.slice(9)}`;
  }
  return clean.replace(/.(?=.{4})/g, 'X');
};

export const maskAadhaar = (aadhaar?: string): string => {
  if (!aadhaar) return 'XXXX XXXX 0000';
  const clean = aadhaar.replace(/\s+/g, '');
  if (clean.length === 12) {
    return `XXXX XXXX ${clean.slice(8)}`;
  }
  return clean.replace(/.(?=.{4})/g, 'X');
};

export const formatCurrency = (num: number): string => {
  return `₹ ${num.toLocaleString('en-IN')}`;
};

export const formatDate = (isoOrDateStr: string): string => {
  try {
    const d = new Date(isoOrDateStr);
    if (isNaN(d.getTime())) return isoOrDateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoOrDateStr;
  }
};

export const formatDateTime = (isoStr: string): string => {
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoStr;
  }
};
