import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getDeviceSerial, createUser } from "@/services/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone || !age || !serialNo) {
      setError("모든 항목을 입력하세요");
      return;
    }

    setLoading(true);
    try {
      // Check serial
      const serial = await getDeviceSerial(serialNo);
      if (!serial) {
        setError("존재하지 않는 정품번호입니다");
        return;
      }
      if (serial.status === "registered") {
        setError("이미 등록된 정품번호입니다");
        return;
      }
      if (serial.status === "disabled") {
        setError("비활성화된 정품번호입니다");
        return;
      }

      const now = new Date();
      const warranty = new Date(now);
      warranty.setFullYear(warranty.getFullYear() + 1);

      const user = await createUser({
        phone,
        age: parseInt(age),
        serialNo,
        productModel: serial.productModel || "조선힐러 프로",
        warrantyExpiresAt: warranty.toISOString(),
        createdAt: now.toISOString(),
      });

      setUser(user);
      navigate("/");
    } catch {
      setError("회원가입 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary">회원가입</h1>
          <p className="text-muted-foreground mt-2 text-sm">정품번호를 등록하고 케어를 시작하세요</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="phone">휴대폰번호</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="01012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">나이</Label>
            <Input
              id="age"
              type="number"
              placeholder="30"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serial">정품번호</Label>
            <Input
              id="serial"
              placeholder="JH-XXXX-XXX"
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value.toUpperCase())}
              className="h-12 rounded-xl"
            />
          </div>

          {error && <p className="text-destructive text-sm text-center">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl text-base font-medium"
          >
            {loading ? "등록 중..." : "회원가입"}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          이미 등록하셨나요?{" "}
          <Link to="/login" className="text-primary font-medium underline-offset-4 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
