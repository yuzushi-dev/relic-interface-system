/**
 * @relic-ui/react v2.8.0
 * Relic Interface System — Tactical Cyber React + TypeScript UI Kit.
 *
 * Fully typed, WCAG 2.2 AA compliant, tactical zero-reflow motion principles.
 * Zero unnecessary bloat: directly consumes RIS tokens & CSS classes (.ris-*).
 */

// Components
export { Button } from './components/Button.js';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button.js';

export { Panel } from './components/Panel.js';
export type { PanelProps, PanelVariant, PanelChamfer } from './components/Panel.js';

export { Switch } from './components/Switch.js';
export type { SwitchProps } from './components/Switch.js';

export { Accordion } from './components/Accordion.js';
export type { AccordionProps, AccordionItem } from './components/Accordion.js';

export { Modal } from './components/Modal.js';
export type { ModalProps } from './components/Modal.js';

export { Sheet } from './components/Sheet.js';
export type { SheetProps } from './components/Sheet.js';

export { Tabs } from './components/Tabs.js';
export type { TabsProps, TabItem } from './components/Tabs.js';

export { Toast } from './components/Toast.js';
export type { ToastProps, ToastData, ToastVariant, ToastAction } from './components/Toast.js';

export { ToastProvider, useToast, toast } from './components/ToastProvider.js';
export type { ToastProviderProps, ToastOptions, ToastContextValue } from './components/ToastProvider.js';

export { Chip } from './components/Chip.js';
export type { ChipProps, ChipVariant, StreamTag, RiskLevel } from './components/Chip.js';

export { Badge, TelemetryPill, Kpi } from './components/Badge.js';
export type {
  BadgeProps,
  BadgeVariant,
  TelemetryPillProps,
  TelemetryVariant,
  TelemetryDelta,
  KpiProps,
} from './components/Badge.js';

export {
  LineChart,
  BarChart,
  GaugeChart,
  Sparkline,
  EegWaveform,
} from './components/Charts.js';
export type {
  LineChartProps,
  BarChartProps,
  GaugeChartProps,
  SparklineProps,
  EegWaveformProps,
  ScrubPoint,
} from './components/Charts.js';

export { Input } from './components/Input.js';
export type { InputProps } from './components/Input.js';

export { Select } from './components/Select.js';
export type { SelectProps, SelectOption } from './components/Select.js';

export { Textarea } from './components/Textarea.js';
export type { TextareaProps } from './components/Textarea.js';

export { Checkbox } from './components/Checkbox.js';
export type { CheckboxProps } from './components/Checkbox.js';

export { Table } from './components/Table.js';
export type { TableProps, TableColumn } from './components/Table.js';

export { Alert } from './components/Alert.js';
export type { AlertProps, AlertVariant } from './components/Alert.js';

// Core utilities
export { RisChartsCore } from './utils/risChartsCore.js';

// Micro UI components & types
export { MicroReticle } from './components/micro/MicroReticle.js';
export type { MicroReticleProps, MicroReticleVariant, MicroReticlePreset } from './components/micro/MicroReticle.js';

export { MicroCaliper } from './components/micro/MicroCaliper.js';
export type {
  MicroCaliperProps,
  MicroCaliperVariant,
  MicroCaliperPreset,
  MicroCaliperOrientation,
} from './components/micro/MicroCaliper.js';

export { MicroDial } from './components/micro/MicroDial.js';
export type {
  MicroDialProps,
  MicroDialVariant,
  MicroDialPreset,
} from './components/micro/MicroDial.js';

export { MicroEqualizer } from './components/micro/MicroEqualizer.js';
export type {
  MicroEqualizerProps,
  MicroEqualizerVariant,
  MicroEqualizerPreset,
} from './components/micro/MicroEqualizer.js';

export { MicroMatrix } from './components/micro/MicroMatrix.js';
export type {
  MicroMatrixProps,
  MicroMatrixVariant,
  MicroMatrixPreset,
  MicroMatrixDensity,
  MicroMatrixShape,
} from './components/micro/MicroMatrix.js';

export { MicroConstellation } from './components/micro/MicroConstellation.js';
export type {
  MicroConstellationProps,
  MicroConstellationVariant,
  MicroConstellationPreset,
  MicroConstellationNode,
} from './components/micro/MicroConstellation.js';

export { MicroStamp } from './components/micro/MicroStamp.js';
export type {
  MicroStampProps,
  MicroStampVariant,
  MicroStampPreset,
  MicroStampCodeType,
} from './components/micro/MicroStamp.js';

export { MicroTelemetry } from './components/micro/MicroTelemetry.js';
export type {
  MicroTelemetryProps,
  MicroTelemetryVariant,
  MicroTelemetryPreset,
} from './components/micro/MicroTelemetry.js';

export { MicroCluster } from './components/micro/MicroCluster.js';
export type {
  MicroClusterProps,
  MicroClusterPreset,
  MicroClusterTelemetry,
} from './components/micro/MicroCluster.js';

export { MicroNavGuidance } from './components/micro/MicroNavGuidance.js';
export type {
  MicroNavGuidanceProps,
  MicroManeuver,
  EyewearOpticalProfile,
} from './components/micro/MicroNavGuidance.js';

export { MicroLiveCaptions } from './components/micro/MicroLiveCaptions.js';
export type {
  MicroLiveCaptionsProps,
} from './components/micro/MicroLiveCaptions.js';

export { resolveMicroSize, resolveMicroColor } from './components/micro/types.js';
export type { RisBrand, RisMicroStatus, RisMicroSize, MicroBaseProps } from './components/micro/types.js';


