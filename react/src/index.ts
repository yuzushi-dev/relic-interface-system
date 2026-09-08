/**
 * @relic-ui/react v2.8.0
 * Relic Interface System — Tactical Cyber React + TypeScript UI Kit.
 *
 * Fully typed, WCAG 2.2 AA compliant, Emil Kowalski motion principles.
 * Zero unnecessary bloat: directly consumes RIS tokens & CSS classes (.ris-*).
 */

// Components
export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

export { Panel } from './components/Panel';
export type { PanelProps, PanelVariant, PanelChamfer } from './components/Panel';

export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';

export { Accordion } from './components/Accordion';
export type { AccordionProps, AccordionItem } from './components/Accordion';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

export { Sheet } from './components/Sheet';
export type { SheetProps } from './components/Sheet';

export { Tabs } from './components/Tabs';
export type { TabsProps, TabItem } from './components/Tabs';

export { Toast } from './components/Toast';
export type { ToastProps, ToastData, ToastVariant, ToastAction } from './components/Toast';

export { ToastProvider, useToast, toast } from './components/ToastProvider';
export type { ToastProviderProps, ToastOptions, ToastContextValue } from './components/ToastProvider';

export { Chip } from './components/Chip';
export type { ChipProps, ChipVariant, StreamTag, RiskLevel } from './components/Chip';

export { Badge, TelemetryPill, Kpi } from './components/Badge';
export type {
  BadgeProps,
  BadgeVariant,
  TelemetryPillProps,
  TelemetryVariant,
  TelemetryDelta,
  KpiProps,
} from './components/Badge';

export {
  LineChart,
  BarChart,
  GaugeChart,
  Sparkline,
  EegWaveform,
} from './components/Charts';
export type {
  LineChartProps,
  BarChartProps,
  GaugeChartProps,
  SparklineProps,
  EegWaveformProps,
  ScrubPoint,
} from './components/Charts';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { Table } from './components/Table';
export type { TableProps, TableColumn } from './components/Table';

export { Alert } from './components/Alert';
export type { AlertProps, AlertVariant } from './components/Alert';

// Core utilities
export { RisChartsCore } from './utils/risChartsCore';
