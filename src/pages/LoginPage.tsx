import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserByPhoneAndSerial } from "@/services/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone || !serialNo) {
      setError("휴대폰번호와 정품번호를 입력하세요");
      return;
    }
    setLoading(true);
    try {
      const user = await getUserByPhoneAndSerial(phone, serialNo);
      if (!user) {
        setError("등록된 정보를 찾을 수 없습니다");
        return;
      }
      setUser(user);
      navigate("/");
    } catch {
      setError("로그인 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary">조선힐러</h1>
          <p className="text-muted-foreground mt-2 text-sm">정품 등록 고객 전용 홈케어</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          아직 등록하지 않으셨나요?{" "}
          <Link to="/register" className="text-primary font-medium underline-offset-4 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
