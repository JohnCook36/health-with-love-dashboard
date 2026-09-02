import {
  mdiAccountGroupOutline,
  mdiAccountOutline,
  mdiAlertOutline,
  mdiBellOutline,
  mdiChartBar,
  mdiChartLine,
  mdiCheck,
  mdiCheckCircle,
  mdiChevronRight,
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiClipboardCheckOutline,
  mdiClipboardPulseOutline,
  mdiClose,
  mdiClockOutline,
  mdiCogOutline,
  mdiDotsHorizontal,
  mdiHeart,
  mdiHeartOutline,
  mdiHeartPulse,
  mdiHomeOutline,
  mdiLungs,
  mdiMagnify,
  mdiPencilOutline,
  mdiPhone,
  mdiPill,
  mdiPillMultiple,
  mdiPlus,
  mdiTrashCanOutline,
} from '@mdi/js';

export const semanticIcons = {
  brandHeart: mdiHeart,
  home: mdiHomeOutline,
  profile: mdiAccountOutline,
  settings: mdiCogOutline,
  dashboard: mdiChartBar,
  statistics: mdiChartLine,
  medication: mdiPill,
  medications: mdiPillMultiple,
  checkup: mdiClipboardPulseOutline,
  questionnaire: mdiClipboardCheckOutline,
  emergency: mdiPhone,
  warning: mdiAlertOutline,
  success: mdiCheckCircle,
  taken: mdiCheck,
  pending: mdiClockOutline,
  bloodPressure: mdiHeartPulse,
  pulse: mdiHeartPulse,
  oxygen: mdiLungs,
  plus: mdiPlus,
  edit: mdiPencilOutline,
  delete: mdiTrashCanOutline,
  search: mdiMagnify,
  notifications: mdiBellOutline,
  menuFold: mdiChevronDoubleLeft,
  menuUnfold: mdiChevronDoubleRight,
  more: mdiDotsHorizontal,
  family: mdiAccountGroupOutline,
  heart: mdiHeartOutline,
  chevronRight: mdiChevronRight,
  close: mdiClose,
} as const;

export type SemanticIconName = keyof typeof semanticIcons;

export function SemanticIcon({ name, size = 20 }: { name: SemanticIconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d={semanticIcons[name]} />
    </svg>
  );
}
