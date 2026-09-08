'use client';

import React, { forwardRef, useState, useId, useRef } from 'react';

export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Label text or element displayed on the tab */
  label: React.ReactNode;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Optional trailing status or count badge */
  badge?: React.ReactNode;
  /** Content rendered inside the associated tabpanel */
  content?: React.ReactNode;
  /** Whether the tab is disabled */
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** List of tabs and their associated content */
  items: TabItem[];
  /** Controlled active tab ID */
  value?: string;
  /** Default active tab ID (uncontrolled) */
  defaultValue?: string;
  /** Callback fired when the active tab changes */
  onChange?: (value: string) => void;
  /** Enables horizontal scrolling on narrow viewports */
  scrollable?: boolean;
  /** Visual variant: 'line' (standard underline) or 'segmented' (tactical boxed subtabs) */
  variant?: 'line' | 'segmented';
  /** Accessible label describing the purpose of this tablist */
  'aria-label'?: string;
}

/**
 * Tactical Tabs component (`.ris-tabs` / `.ris-subtabs`).
 * Implements full WAI-ARIA Tab pattern with automatic or manual keyboard arrow cycling
 * (ArrowLeft, ArrowRight, Home, End), zero reflow, and high-contrast active states.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    items,
    value,
    defaultValue,
    onChange,
    scrollable = false,
    variant = 'line',
    'aria-label': ariaLabel = 'Navigation Tabs',
    className = '',
    style,
    ...rest
  },
  ref
) {
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [internalValue, setInternalValue] = useState<string>(() => {
    if (defaultValue !== undefined) return defaultValue;
    const firstEnabled = items.find((t) => !t.disabled);
    return firstEnabled ? firstEnabled.id : (items[0]?.id || '');
  });

  const isControlled = value !== undefined;
  const currentTab = isControlled ? value : internalValue;

  const handleSelect = (tabId: string, disabled?: boolean) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue(tabId);
    }
    onChange?.(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const enabledIndices = items
      .map((item, idx) => (!item.disabled ? idx : -1))
      .filter((idx) => idx !== -1);

    if (enabledIndices.length === 0) return;

    const currentPositionInEnabled = enabledIndices.indexOf(currentIndex);
    let nextIndex: number | null = null;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextPos = (currentPositionInEnabled + 1) % enabledIndices.length;
      nextIndex = enabledIndices[nextPos] ?? null;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevPos = (currentPositionInEnabled - 1 + enabledIndices.length) % enabledIndices.length;
      nextIndex = enabledIndices[prevPos] ?? null;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = enabledIndices[0] ?? null;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = enabledIndices[enabledIndices.length - 1] ?? null;
    }

    if (nextIndex !== null) {
      const targetItem = items[nextIndex];
      if (targetItem) {
        tabRefs.current[nextIndex]?.focus();
        handleSelect(targetItem.id, targetItem.disabled);
      }
    }
  };

  const isSegmented = variant === 'segmented';
  const containerClass = isSegmented
    ? `ris-subtabs ${scrollable ? 'ris-subtabs--scrollable' : ''}`
    : `ris-tabs ${scrollable ? 'ris-tabs--scrollable' : ''}`;

  const activeItem = items.find((item) => item.id === currentTab);

  return (
    <div
      ref={ref}
      className={`ris-tabs-wrapper ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={containerClass}
        style={{
          display: 'flex',
          overflowX: scrollable ? 'auto' : undefined,
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item, idx) => {
          const isSelected = item.id === currentTab;
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;

          const buttonClass = isSegmented
            ? `ris-subtab ${isSelected ? 'ris-subtab--active' : ''}`
            : 'ris-tab';

          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              data-active={isSelected ? 'true' : undefined}
              className={buttonClass}
              onClick={() => handleSelect(item.id, item.disabled)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--ris-s2, 8px)',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.4 : 1,
              }}
            >
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge && <span className="ris-tab-badge">{item.badge}</span>}
            </button>
          );
        })}
      </div>

      {activeItem && activeItem.content && (
        <div
          id={`${baseId}-panel-${activeItem.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeItem.id}`}
          tabIndex={0}
          className="ris-tabpanel"
          style={{
            paddingTop: 'var(--ris-s4, 16px)',
            outline: 'none',
          }}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
});

Tabs.displayName = 'Tabs';
