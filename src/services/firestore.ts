import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { User, DeviceSerial, CareLog, CareProgram, UsageVideo } from "@/types";
import { defaultCarePrograms } from "@/data/carePrograms";

// Device Serials
export async function getDeviceSerial(serialNo: string): Promise<DeviceSerial | null> {
  try {
    const snap = await getDoc(doc(db, "device_serials", serialNo));
    return snap.exists() ? (snap.data() as DeviceSerial) : null;
  } catch {
    return null;
  }
}

// Users
export async function getUserByPhoneAndSerial(phone: string, serialNo: string): Promise<User | null> {
  try {
    const q = query(
      collection(db, "users"),
      where("phone", "==", phone),
      where("serialNo", "==", serialNo)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as User;
  } catch {
    return null;
  }
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
  const docRef = await addDoc(collection(db, "users"), data);
  // Mark serial as registered
  await setDoc(doc(db, "device_serials", data.serialNo), {
    serialNo: data.serialNo,
    productModel: data.productModel,
    status: "registered",
    registeredUserId: docRef.id,
    registeredAt: new Date().toISOString(),
  }, { merge: true });
  return { id: docRef.id, ...data };
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const snap = await getDoc(doc(db, "users", userId));
    return snap.exists() ? { id: snap.id, ...snap.data() } as User : null;
  } catch {
    return null;
  }
}

// Care Logs
export async function addCareLog(log: Omit<CareLog, "id">): Promise<void> {
  await addDoc(collection(db, "care_logs"), log);
}

export async function getCareLogs(userId: string): Promise<CareLog[]> {
  try {
    const q = query(
      collection(db, "care_logs"),
      where("userId", "==", userId),
      where("completed", "==", true),
      orderBy("completionDate", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CareLog));
  } catch {
    return [];
  }
}

export async function hasCompletedToday(userId: string): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];
  try {
    const q = query(
      collection(db, "care_logs"),
      where("userId", "==", userId),
      where("completionDate", "==", today)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch {
    return false;
  }
}

// Care Programs
export async function getCarePrograms(): Promise<CareProgram[]> {
  try {
    const q = query(collection(db, "care_programs"), where("isActive", "==", true));
    const snap = await getDocs(q);
    if (snap.empty) return defaultCarePrograms;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CareProgram));
  } catch {
    return defaultCarePrograms;
  }
}

// Usage Videos
export async function getUsageVideos(): Promise<UsageVideo[]> {
  try {
    const q = query(collection(db, "usage_videos"), where("isActive", "==", true), orderBy("sortOrder"));
    const snap = await getDocs(q);
    if (snap.empty) return defaultVideos;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as UsageVideo));
  } catch {
    return defaultVideos;
  }
}

const defaultVideos: UsageVideo[] = [
  {
    id: "v1",
    title: "조선힐러 기본 사용법",
    description: "기기 사용 전 꼭 확인하세요",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "v2",
    title: "ION 모드 가이드",
    description: "앰플 흡수를 극대화하는 방법",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sortOrder: 2,
    isActive: true,
  },
];

// Challenge stats
export function calculateChallengeStats(logs: CareLog[]) {
  if (logs.length === 0) return { streak: 0, totalDays: 0, remainingDays: 90 };

  const uniqueDates = [...new Set(logs.map((l) => l.completionDate))].sort().reverse();
  const totalDays = uniqueDates.length;

  // Calculate streak
  let streak = 0;
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  for (let i = 0; i < uniqueDates.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split("T")[0];
    if (uniqueDates[i] === expectedStr) {
      streak++;
    } else if (i === 0 && uniqueDates[0] !== todayStr) {
      // If today not done yet, check from yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (uniqueDates[0] === yesterday.toISOString().split("T")[0]) {
        streak = 1;
        continue;
      }
      break;
    } else {
      break;
    }
  }

  return {
    streak,
    totalDays,
    remainingDays: Math.max(0, 90 - streak),
  };
}
