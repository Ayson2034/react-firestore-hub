import { CareProgram } from "@/types";

export const defaultCarePrograms: CareProgram[] = [
  {
    id: "care_3min",
    name: "3분 케어",
    subtitle: "매일 습관",
    totalSec: 180,
    description: "간편하게 매일 할 수 있는 기본 케어",
    frequency: "매일",
    message: "꾸준한 3분이 피부를 바꿉니다",
    rfRequired: false,
    isActive: true,
    steps: [
      { order: 1, name: "준비", durationSec: 0, guideText: "따뜻한 타올로 피부를 이완시킨 후, 앰플을 도포하세요", isPrep: true },
      { order: 2, name: "ION 모드", durationSec: 90, guideText: "앰플 성분을 피부 깊숙이 전달합니다", isPrep: false },
      { order: 3, name: "EMS 모드", durationSec: 90, guideText: "턱선→광대→이마 순으로 들어올려주세요", isPrep: false },
      { order: 4, name: "마무리", durationSec: 0, guideText: "차갑게 적신 타올로 피부를 진정시키세요", isPrep: true },
    ],
  },
  {
    id: "care_4min",
    name: "4분 케어",
    subtitle: "기본 관리",
    totalSec: 240,
    description: "RF 모드가 포함된 기본 관리 코스",
    frequency: "RF 케어일",
    message: "RF로 콜라겐을 깨우세요",
    rfRequired: true,
    isActive: true,
    steps: [
      { order: 1, name: "준비", durationSec: 0, guideText: "따뜻한 타올로 피부를 이완시킨 후, 앰플을 도포하세요", isPrep: true },
      { order: 2, name: "ION 모드", durationSec: 90, guideText: "앰플 성분을 피부 깊숙이 전달합니다", isPrep: false },
      { order: 3, name: "EMS 모드", durationSec: 80, guideText: "턱선→광대→이마 순으로 들어올려주세요", isPrep: false },
      { order: 4, name: "RF 모드", durationSec: 70, guideText: "원을 그리며 천천히 움직이세요. 한곳에 멈추지 마세요", isPrep: false },
      { order: 5, name: "마무리", durationSec: 0, guideText: "차갑게 적신 타올로 마무리하세요", isPrep: true },
    ],
  },
  {
    id: "care_5min",
    name: "5분 케어",
    subtitle: "풀케어",
    totalSec: 300,
    description: "모든 기능을 활용한 풀 케어 코스",
    frequency: "RF 케어일",
    message: "최고의 케어를 경험하세요",
    rfRequired: true,
    isActive: true,
    steps: [
      { order: 1, name: "준비", durationSec: 0, guideText: "따뜻한 타올로 피부를 이완시킨 후, 앰플을 충분히 도포하세요", isPrep: true },
      { order: 2, name: "ION 모드", durationSec: 120, guideText: "따뜻한 이온이 앰플 성분을 피부 깊숙이 전달합니다", isPrep: false },
      { order: 3, name: "EMS 모드", durationSec: 90, guideText: "턱선→광대→이마→목 순으로 들어올려주세요", isPrep: false },
      { order: 4, name: "RF 모드", durationSec: 90, guideText: "고주파 열이 콜라겐을 깨웁니다. 원을 그리며 움직이세요", isPrep: false },
      { order: 5, name: "마무리", durationSec: 0, guideText: "차갑게 적신 타올로 피부를 진정시키며 마무리하세요", isPrep: true },
    ],
  },
];

// RF 케어일: 월(1), 수(3), 금(5), 토(6)
export const RF_DAYS = [1, 3, 5, 6];

export function isRfDay(date: Date = new Date()): boolean {
  return RF_DAYS.includes(date.getDay());
}
