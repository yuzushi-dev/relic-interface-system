'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@relic-ui/react';
import { IconShield, IconX, IconAlertTriangle } from './Icons';

export interface SystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOverride?: (action: string) => void;
}

export const SystemModal: React.FC<SystemModalProps> = ({
  isOpen,
  onClose,
  onConfirmOverride,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>('recalibrate');
  const [isArming, setIsArming] = useState<boolean>(false);

  // Focus trap & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Tab trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Initial focus
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const first = modalRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        first?.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExecute = () => {
    setIsArming(true);
    setTimeout(() => {
      setIsArming(false);
      onConfirmOverride?.(selectedAction);
      onClose();
    }, 400);
  };

  return (
    <div
      className="ris-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="ris-modal relative bg-ris-surface2 border border-ris-lineStrong select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="override-modal-title"
        aria-describedby="override-modal-description"
      >
        {/* Modal Head */}
        <div className="ris-modal-head">
          <div className="flex items-center gap-2">
            <IconShield size={16} className="text-ris-accent" />
            <h2 id="override-modal-title" className="font-mono text-xs font-bold uppercase tracking-wider text-ris-fg1">
              SEC-OVERRIDE // KERNEL COMMAND
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ris-btn ris-btn--ghost ris-btn--sm p-1 min-h-[26px] min-w-[26px]"
            aria-label="Close tactical override modal"
          >
            <IconX size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="ris-modal-body p-4 space-y-4">
          <div className="p-2.5 bg-ris-red/10 border border-ris-red/40 flex items-start gap-2.5">
            <IconAlertTriangle size={18} className="text-ris-red shrink-0 mt-0.5" />
            <div className="text-xs font-mono">
              <span className="font-bold text-ris-red block mb-0.5">
                CRITICAL DIRECTIVE WARNING
              </span>
              <p id="override-modal-description" className="text-ris-fg2 text-[11px] leading-relaxed">
                Executing tactical overrides bypasses standard validation gates. All telemetry
                descriptors will be forcefully committed to the immutable forensic ledger.
              </p>
            </div>
          </div>

          {/* Action selection */}
          <div className="space-y-2">
            <label className="block font-mono text-[11px] text-ris-fg3 uppercase tracking-wider">
              SELECT OVERRIDE DIRECTIVE:
            </label>

            <div className="space-y-1.5 font-mono text-xs">
              {[
                {
                  id: 'recalibrate',
                  title: 'RE-CALIBRATE CARRIER BUS',
                  desc: 'Re-align phase lock and reset jitter filters to base profile.',
                },
                {
                  id: 'seal_buffer',
                  title: 'SEAL FORENSIC BUFFER',
                  desc: 'Sign and lock active packet memory into cold archival storage.',
                },
                {
                  id: 'emergency_purge',
                  title: 'PURGE TRANSIENT CACHE',
                  desc: 'Clear unverified memory descriptors to restore signal head-room.',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-2.5 border cursor-pointer transition-colors duration-fast ${
                    selectedAction === opt.id
                      ? 'bg-ris-surface3 border-ris-accent'
                      : 'bg-ris-surface1 border-ris-line hover:border-ris-lineStrong'
                  }`}
                >
                  <input
                    type="radio"
                    name="overrideAction"
                    value={opt.id}
                    checked={selectedAction === opt.id}
                    onChange={() => setSelectedAction(opt.id)}
                    className="mt-0.5 accent-amber-500"
                  />
                  <div>
                    <span className="font-semibold text-ris-fg1 block">{opt.title}</span>
                    <span className="text-ris-fg4 text-[11px] block mt-0.5">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Authentication verification indicator */}
          <div className="p-2 bg-ris-surface1 border border-ris-line flex items-center justify-between font-mono text-[11px]">
            <span className="text-ris-fg4">OPERATOR STATUS:</span>
            <span className="text-ris-green font-semibold">TOKEN VALIDATED // LVL-4</span>
          </div>
        </div>

        {/* Modal Foot */}
        <div className="ris-modal-foot p-3 bg-ris-surface1 border-t border-ris-line flex items-center justify-end gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
          >
            ABORT
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleExecute}
            disabled={isArming}
            loading={isArming}
            leftIcon={!isArming ? <IconShield size={13} /> : undefined}
          >
            {isArming ? 'COMMITTING...' : 'CONFIRM OVERRIDE'}
          </Button>
        </div>
      </div>
    </div>
  );
};
