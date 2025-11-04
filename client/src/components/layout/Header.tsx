import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Menu, User, Eye, Sun, Moon } from "lucide-react";
import civicmindLogo from "@/assets/civicmind-logo.jpg";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export const Header = ({ isLoggedIn = false }: HeaderProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    setLanguage(language === "english" ? "marathi" : "english");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src={civicmindLogo} 
            alt="CivicMind Logo" 
            className="w-14 h-14 rounded-full object-cover"
            style={{ imageRendering: 'crisp-edges' }}
          />
          <span className="text-xl font-bold">CivicMind</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/feed" className="text-sm font-medium hover:text-primary transition-colors">
            {t("reportComplaints")}
          </Link>
          <Link to="/complaints-dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            {t("viewDashboard")}
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
            {t("aboutBMC")}
          </Link>
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
          >
            <span className="text-base font-semibold">म</span>
            <span>{t("marathi")}</span>
          </button>
          <Link to="/accessibility" className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
            <Eye className="h-4 w-4" />
            <span>{t("visuallyChallenged")}</span>
          </Link>
          <Link to="/support" className="text-sm font-medium hover:text-primary transition-colors">
            {t("support")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </Button>
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost">{t("login")}</Button>
              </Link>
              <Link to="/signup">
                <Button>{t("getStarted")}</Button>
              </Link>
            </>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:flex"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
