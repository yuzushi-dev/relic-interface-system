import React, { forwardRef, useState, useId, useRef } from 'react';

export interface AccordionItem {
  /** Unique identifier for the accordion item */
  id: string;
  /** Header title text or element */
  title: React.ReactNode;
  /** Content rendered inside the expandable panel */
  content: React.ReactNode;
  /** Optional subtitle or metadata tag */
  subtitle?: React.ReactNode;
  /** Optional status badge or count pill */
  badge?: React.ReactNode;
  /** Whether this specific item is disabled */
  disabled?: boolean;
}

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** List of accordion items */
  items: AccordionItem[];
  /** Controlled active item ID or array of IDs */
  value?: string | string[];
  /** Default active item ID or array of IDs (uncontrolled) */
  defaultValue?: string | string[];
  /** Whether multiple items can be open simultaneously (default: false) */
  multiple?: boolean;
  /** Callback fired when open item selection changes */
  onChange?: (value: string | string[]) => void;
}

/**
 * Tactical Accordion component (`.ris-acc`).
 * Implements CSS Grid 0fr → 1fr transitions for true 60fps zero-reflow animations.
 * Fully keyboard accessible (Arrow Up/Down, Home/End) according to WAI-ARIA Accordion specifications.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    items,
    value,
    defaultValue,
    multiple = false,
    onChange,
    className = '',
    style,
    ...rest
  },
  ref
) {
  const baseId = useId();
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState<string[]>(() => {
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const isControlled = value !== undefined;
  const currentOpenList: string[] = isControlled
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : internalValue;

  const handleToggle = (itemId: string, disabled?: boolean) => {
    if (disabled) return;

    let nextOpenList: string[];
    const isOpen = currentOpenList.includes(itemId);

    if (multiple) {
      nextOpenList = isOpen
        ? currentOpenList.filter((id) => id !== itemId)
        : [...currentOpenList, itemId];
    } else {
      nextOpenList = isOpen ? [] : [itemId];
    }

    if (!isControlled) {
      setInternalValue(nextOpenList);
    }

    if (onChange) {
      onChange(multiple ? nextOpenList : nextOpenList[0] || '');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const total = items.length;
    let targetIndex: number | null = null;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (index + 1) % total;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (index - 1 + total) % total;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = total - 1;
    }

    if (targetIndex !== null) {
      triggerRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div
      ref={ref}
      className={`ris-acc ${className}`.trim()}
      style={style}
      {...rest}
    >
      {items.map((item, index) => {
        const isOpen = currentOpenList.includes(item.id);
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className="ris-acc-item"
            data-open={isOpen ? 'true' : 'false'}
          >
            <button
              ref={(el) => {
                triggerRefs.current[index] = el;
              }}
              id={triggerId}
              type="button"
              className="ris-acc-trigger"
              disabled={item.disabled}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => handleToggle(item.id, item.disabled)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.45 : 1,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--ris-s3, 12px)',
                }}
              >
                <span className="ris-acc-title">{item.title}</span>
                {item.subtitle && (
                  <span
                    className="ris-acc-subtitle"
                    style={{
                      fontFamily: 'var(--ris-font-mono)',
                      fontSize: 'var(--ris-text-xs, 11px)',
                      color: 'var(--ris-fg3)',
                      textTransform: 'none',
                    }}
                  >
                    {item.subtitle}
                  </span>
                )}
                {item.badge && <span className="ris-acc-badge">{item.badge}</span>}
              </span>

              <span
                className="ris-acc-chevron"
                aria-hidden="true"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform var(--ris-dur-base, 200ms) var(--ris-ease-out, cubic-bezier(0.22, 1, 0.36, 1))',
                }}
              >
                ▼
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="ris-acc-drawer"
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows var(--ris-dur-base, 200ms) var(--ris-ease-out, cubic-bezier(0.22, 1, 0.36, 1))',
              }}
            >
              <div
                className="ris-acc-body"
                style={{
                  overflow: 'hidden',
                }}
              >
                <div className="ris-acc-body-inner">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

Accordion.displayName = 'Accordion';
