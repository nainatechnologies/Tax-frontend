import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  UserCheck,
  Search,
  UploadCloud,
  CheckCircle,
  CreditCard,
  FileText,
  Award,
} from 'lucide-react';
import { CaseStatus } from '../types';
import './WorkflowTracker.css';

interface WorkflowTrackerProps {
  currentStatus: CaseStatus;
  hasAdditionalDocRequest?: boolean;
}

interface StepInfo {
  key: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const STEPS: StepInfo[] = [
  { key: 'SERVICE_SELECTED', label: 'Service Selected', sublabel: 'Plan Chosen', icon: FileCheck },
  { key: 'DOCS_UPLOADED', label: 'Docs Uploaded', sublabel: 'Files in Vault', icon: UploadCloud },
  { key: 'CA_ASSIGNED', label: 'CA Assigned', sublabel: 'Chartered Acc.', icon: UserCheck },
  { key: 'CA_REVIEWING', label: 'CA Reviewing', sublabel: 'Calculations', icon: Search },
  { key: 'ADDL_DOCS', label: 'Addl Documents', sublabel: 'If Requested', icon: AlertCircle },
  { key: 'WORK_COMPLETED', label: 'Work Ready', sublabel: 'Filing Prepared', icon: CheckCircle },
  { key: 'PAYMENT', label: 'Fee Payment', sublabel: 'Invoice Ready', icon: CreditCard },
  { key: 'INVOICE', label: 'Tax Invoice', sublabel: 'Receipt & Ack', icon: FileText },
  { key: 'COMPLETED', label: 'ITR E-Filed', sublabel: 'Filing Done', icon: Award },
];

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({
  currentStatus,
  hasAdditionalDocRequest = false,
}) => {
  // Map CaseStatus to a 0-8 step index
  const getStepIndex = (status: CaseStatus): number => {
    switch (status) {
      case 'NEW':
        return 0;
      case 'DOCUMENTS_PENDING':
        return 1;
      case 'DOCUMENTS_SUBMITTED':
        return 1;
      case 'CA_ASSIGNMENT_PENDING':
        return 2;
      case 'CA_ASSIGNED':
        return 3;
      case 'UNDER_REVIEW':
        return 3;
      case 'ADDITIONAL_DOCUMENT_REQUIRED':
      case 'ADDITIONAL_DOCUMENT_SUBMITTED':
        return 4;
      case 'PROCESSING':
        return 5;
      case 'PAYMENT_PENDING':
        return 6;
      case 'PAID':
        return 7;
      case 'COMPLETED':
        return 8;
      default:
        return 1;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="workflow-tracker-card">
      <div className="workflow-tracker-header flex-between">
        <div>
          <span className="workflow-tracker-eyebrow">Real-Time CA Process Engine</span>
          <h4 className="workflow-tracker-title">Tax Return Lifecycle &amp; Direct CA Tracking</h4>
        </div>
        <div className="workflow-live-badge">
          <span className="live-pulse"></span>
          <span>Status: <strong>{currentStatus.replace(/_/g, ' ')}</strong></span>
        </div>
      </div>

      <div className="workflow-progress-wrapper">
        <div className="workflow-progress-list">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeIndex || currentStatus === 'COMPLETED';
            const isCurrent = idx === activeIndex && currentStatus !== 'COMPLETED';
            const isPending = idx > activeIndex;

            let stepClass = 'step-pending';
            if (isCompleted) stepClass = 'step-completed';
            else if (isCurrent) stepClass = 'step-active';

            // Special badge for additional doc if needed
            const isAddlStep = idx === 4 && hasAdditionalDocRequest && isCurrent;

            return (
              <div key={step.key} className={`workflow-step-node ${stepClass}`}>
                {idx > 0 && (
                  <div
                    className={`workflow-connector ${idx <= activeIndex ? 'connector-filled' : ''}`}
                  />
                )}

                <div className="step-node-icon-wrapper">
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="step-icon-completed" />
                  ) : (
                    <Icon size={18} className="step-icon-inner" />
                  )}
                </div>

                <div className="step-node-details">
                  <span className="step-node-title">{step.label}</span>
                  <span className="step-node-sublabel">
                    {isAddlStep ? 'Action Required' : step.sublabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
