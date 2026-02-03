'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

type ConfirmVariant = 'danger' | 'success' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
}

const variantConfig: Record<ConfirmVariant, { icon: React.ReactNode; confirmClass: string }> = {
  danger: {
    icon: <AlertTriangle className="w-6 h-6 text-[var(--danger)]" />,
    confirmClass: 'bg-[var(--danger)] hover:bg-[var(--danger)]/90',
  },
  success: {
    icon: <CheckCircle className="w-6 h-6 text-[var(--success)]" />,
    confirmClass: '',
  },
  info: {
    icon: <Info className="w-6 h-6 text-[var(--primary)]" />,
    confirmClass: '',
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false,
}: ConfirmModalProps) {
  const config = variantConfig[variant];

  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {config.icon}
        </div>
        <h3 className="text-base font-medium text-[var(--foreground)] mb-2">
          {title}
        </h3>
        <p className="text-sm text-[var(--muted)] mb-6">
          {message}
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            loading={loading}
            className={config.confirmClass}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
