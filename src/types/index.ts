export interface User {
  id: string;
  phone: string;
  age: number;
  serialNo: string;
  productModel: string;
  warrantyExpiresAt: string;
  createdAt: string;
}

export interface DeviceSerial {
  serialNo: string;
  productModel: string;
  status: "available" | "registered" | "disabled";
  registeredUserId?: string;
  registeredAt?: string;
}

export interface CareStep {
  order: number;
  name: string;
  durationSec: number;
  guideText: string;
  isPrep: boolean;
}

export interface CareProgram {
  id: string;
  name: string;
  subtitle: string;
  totalSec: number;
  description: string;
  frequency: string;
  message: string;
  rfRequired: boolean;
  isActive: boolean;
  steps: CareStep[];
}

export interface CareLog {
  id?: string;
  userId: string;
  programId: string;
  startedAt: string;
  endedAt: string;
  completed: boolean;
  completionDate: string; // YYYY-MM-DD
}

export interface UsageVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  sortOrder: number;
  isActive: boolean;
}
