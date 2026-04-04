import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { LogOut, Phone, Calendar, Shield, Package, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const warrantyValid = new Date(user.warrantyExpiresAt) > new Date();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="px-5 pt-6 pb-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <img src={logo} alt="조선힐러" className="h-8 object-contain" />
        <span className="text-sm font-medium text-muted-foreground">마이페이지</span>
      </div>

      {/* User Info */}
      <div className="rounded-3xl glass-card p-5 mb-4">
        <h2 className="font-bold text-foreground mb-4 text-sm">내 정보</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-muted-foreground">휴대폰</span>
            <span className="ml-auto text-foreground">{user.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 text-center text-muted-foreground text-xs">🎂</span>
            <span className="text-muted-foreground">나이</span>
            <span className="ml-auto text-foreground">{user.age}세</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-muted-foreground">가입일</span>
            <span className="ml-auto text-foreground">
              {format(new Date(user.createdAt), "yyyy.MM.dd")}
            </span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="rounded-3xl glass-card p-5 mb-4">
        <h2 className="font-bold text-foreground mb-4 text-sm">등록 제품</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Package className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-muted-foreground">제품명</span>
            <span className="ml-auto text-foreground">{user.productModel}</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-muted-foreground">정품번호</span>
            <span className="ml-auto text-foreground">{user.serialNo}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-muted-foreground">보증 만료일</span>
            <span className="ml-auto text-foreground">
              {format(new Date(user.warrantyExpiresAt), "yyyy.MM.dd")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4" />
            <span className="text-muted-foreground">보증 상태</span>
            <span
              className={`ml-auto text-xs px-3 py-1 rounded-full font-medium ${
                warrantyValid
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {warrantyValid ? "유효" : "만료"}
            </span>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="rounded-3xl glass-card mb-4 divide-y divide-border/50 overflow-hidden">
        {[
          { label: "고객센터", href: "#" },
          { label: "이용약관", href: "#" },
          { label: "개인정보처리방침", href: "#" },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="flex items-center justify-between px-5 py-4 text-sm text-foreground hover:bg-accent/50 transition-colors"
          >
            {label}
            <ExternalLink className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </a>
        ))}
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full h-12 rounded-2xl text-destructive border-destructive/20 hover:bg-destructive/5"
      >
        <LogOut className="w-4 h-4 mr-2" />
        로그아웃
      </Button>
    </div>
  );
}
