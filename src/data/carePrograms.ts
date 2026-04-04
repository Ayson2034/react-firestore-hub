import { CareProgram } from "@/types";

export const defaultCarePrograms: CareProgram[] = [
  {
    id: "care_3min",
    name: "3분 라이트 케어",
    subtitle: "아침 케어",
    totalSec: 180,
    description: "매일 3분, 콜라겐 기둥을 탱탱하게 관리하는 라이트 케어",
    frequency: "매일",
    message: "매일 3분만 케어해도 콜라겐/엘라스틴 단백질 자극/신생 콜라겐 유도하여 콜라겐 기둥을 탱탱하게 관리해줍니다.",
    rfRequired: false,
    isActive: true,
    steps: [
      { order: 1, name: "ION 모드", durationSec: 80, guideText: "세럼 성분 진피층까지 전달", direction: "이마 → 볼 → 턱선 순으로 천천히 쓸어내리세요", isPrep: false },
      { order: 2, name: "RF 모드", durationSec: 100, guideText: "고주파 온열로 진피층 자극 + 흡수된 영양의 활성화", direction: "한 부위에서 3초씩 머문 뒤 원을 그리며 이동하세요", isPrep: false },
    ],
  },
  {
    id: "care_5min",
    name: "5분 밸런스 케어",
    subtitle: "밸런스 케어",
    totalSec: 300,
    description: "ION·EMS·RF 3단계로 탄력과 영양을 동시에",
    frequency: "매일",
    message: "딱 하루 5분만 내 피부에 투자하세요. 비싼 1회 피부관리보다 매일 5분 케어가 더 중요합니다.",
    rfRequired: false,
    isActive: true,
    steps: [
      { order: 1, name: "ION 모드", durationSec: 70, guideText: "세럼 성분 진피층까지 전달", direction: "이마 중앙에서 관자놀이 방향으로 쓸어올리세요", isPrep: false },
      { order: 2, name: "EMS 모드", durationSec: 90, guideText: "근육 수축·이완하여 탄력 케어", direction: "턱선 → 광대 → 이마 순으로 위로 끌어올리듯 이동하세요", isPrep: false },
      { order: 3, name: "RF 모드", durationSec: 140, guideText: "고주파 온열로 진피층 자극", direction: "한 부위에서 3초씩 머문 뒤 천천히 원을 그리며 이동하세요", isPrep: false },
    ],
  },
  {
    id: "care_9min",
    name: "9분 조선 딥케어",
    subtitle: "풀케어",
    totalSec: 540,
    description: "채우고, 깨우고, 열고, 다시 채우는 프리미엄 풀케어",
    frequency: "주 3~4회",
    message: "채우고, 깨우고, 열고, 다시 채우다. 관리실에서 받던 케어를 9분 하나로.",
    rfRequired: false,
    isActive: true,
    steps: [
      { order: 1, name: "ION 모드", durationSec: 100, guideText: "세럼 성분 진피층까지 전달", direction: "이마 → 볼 → 턱선 순으로 부드럽게 쓸어내리세요", isPrep: false },
      { order: 2, name: "EMS 모드", durationSec: 130, guideText: "근육 수축·이완하여 탄력 케어", direction: "턱 끝에서 귀 방향으로 위로 끌어올리듯 이동하세요", isPrep: false },
      { order: 3, name: "RF 모드", durationSec: 180, guideText: "고주파 온열로 진피층 자극", direction: "한 부위에서 3초씩, 원을 그리며 넓게 움직이세요. 한곳에 멈추지 마세요", isPrep: false },
      { order: 4, name: "ION 모드", durationSec: 130, guideText: "2차 영양 공급, 다시 채우다", direction: "세럼을 추가 도포한 뒤 목 → 턱 → 이마 순으로 올려주세요", isPrep: false },
    ],
  },
];

// RF 케어일: 월(1), 수(3), 금(5), 토(6)
export const RF_DAYS = [1, 3, 5, 6];

export function isRfDay(date: Date = new Date()): boolean {
  return RF_DAYS.includes(date.getDay());
}
