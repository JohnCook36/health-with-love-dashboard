export type EntityId = number;

export type MedicationDosageUnit = 'mg' | 'mcg' | 'g';
export type MedicationDoseUnit = 'tablet';
export type MedicationAdherenceLevel = 'standard' | 'important' | 'critical';
export type MedicationScheduleType = 'daily' | 'weekdays' | 'interval';
export type MedicationPeriod = 'morning' | 'afternoon' | 'evening';
export type MedicationIntakeStatus = 'pending' | 'taken' | 'missed' | 'skipped' | 'cancelled';

export type MedicationSchedule = Readonly<{
  id: EntityId;
  medicationId: EntityId;
  time: string;
  scheduleType: MedicationScheduleType;
  weekdays: readonly number[] | null;
  intervalDays: number | null;
  startDate: string | null;
  createdAt: string;
}>;

export type Medication = Readonly<{
  id: EntityId;
  name: string;
  dosageValue: number;
  dosageUnit: MedicationDosageUnit;
  doseAmount: number;
  doseUnit: MedicationDoseUnit;
  adherenceLevel: MedicationAdherenceLevel;
  instructions: string | null;
  missedDoseInstructions: string | null;
  isActive: boolean;
  createdAt: string;
  schedules: readonly MedicationSchedule[];
}>;

export type MedicationScheduleInput = Readonly<{
  time: string;
  scheduleType: MedicationScheduleType;
  weekdays?: readonly number[];
  intervalDays?: number;
  startDate?: string;
}>;

export type MedicationInput = Readonly<{
  name: string;
  dosageValue: number;
  dosageUnit: MedicationDosageUnit;
  doseAmount: number;
  doseUnit: MedicationDoseUnit;
  adherenceLevel: MedicationAdherenceLevel;
  instructions?: string;
  missedDoseInstructions?: string;
  schedules: readonly MedicationScheduleInput[];
}>;

export type MedicationIntake = Readonly<{
  id: EntityId;
  medicationId: EntityId;
  scheduleId: EntityId | null;
  scheduledAt: string;
  takenAt: string | null;
  status: MedicationIntakeStatus;
  comment: string | null;
}>;

export type DailyMetrics = Readonly<{
  id: EntityId;
  date: string;
  systolic: number | null;
  diastolic: number | null;
  pulse: number | null;
  spo2: number | null;
  steps: number | null;
  createdAt: string;
  updatedAt: string;
}>;

export type CheckupSummary = Readonly<{
  id: EntityId;
  startedAt: string;
  completedAt: string | null;
  status: 'in_progress' | 'completed' | 'cancelled';
  riskLevel: 'normal' | 'attention' | 'emergency' | null;
}>;

export type HealthEvent = Readonly<{
  id: EntityId;
  type: 'checkup' | 'measurement' | 'medication';
  title: string;
  description: string | null;
  level: 'info' | 'attention' | 'emergency';
  occurredAt: string;
  isRead: boolean;
}>;

export type HealthOverview = Readonly<{
  patientId: EntityId;
  generatedAt: string;
  latestMetrics: DailyMetrics | null;
  latestCheckup: CheckupSummary | null;
  medications: readonly Medication[];
  todayIntakes: readonly MedicationIntake[];
  recentEvents: readonly HealthEvent[];
}>;

export type ApiError = Readonly<{
  code: string;
  message: string;
  requestId?: string;
}>;

export type ApiResponse<T> = Readonly<{
  data: T;
  error: ApiError | null;
}>;

export const healthApiPaths = {
  overview: '/api/v1/patients/:patientId/overview',
  metrics: '/api/v1/patients/:patientId/metrics',
  checkups: '/api/v1/patients/:patientId/checkups',
  medications: '/api/v1/patients/:patientId/medications',
  intakes: '/api/v1/patients/:patientId/medication-intakes',
  events: '/api/v1/patients/:patientId/events',
} as const;
