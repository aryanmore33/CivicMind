import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { 
  Upload, 
  Brain, 
  Bell, 
  CheckCircle, 
  Users, 
  MapPin, 
  TrendingUp,
  ArrowRight
} from "lucide-react";
import heroBuilding from "@/assets/bmc-building.avif";
import civicmindLogo from "@/assets/civicmind-logo.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBuilding})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative container py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
              <Brain className="w-4 h-4 text-primary" />
              <span>{t("aiPoweredSolutions")}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t("reportCivicIssues")}{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t("createChange")}
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("heroDescription")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="text-lg px-8">
                  {t("reportIssueCitizen")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/feed">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  {t("viewComplaints")}
                </Button>
              </Link>
              <Link to="/authority">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  {t("authorityPortal")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("howItWorks")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("howItWorksSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{t("step1Title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("step1Desc")}
              </p>
            </Card>

            <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{t("step2Title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("step2Desc")}
              </p>
            </Card>

            <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
                <Bell className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">{t("step3Title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("step3Desc")}
              </p>
            </Card>

            <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10">
                <CheckCircle className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg">{t("step4Title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("step4Desc")}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 text-center space-y-2">
              <Users className="w-10 h-10 text-primary mx-auto" />
              <div className="text-4xl font-bold">50K+</div>
              <div className="text-muted-foreground">{t("activeCitizens")}</div>
            </Card>

            <Card className="p-8 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-secondary mx-auto" />
              <div className="text-4xl font-bold">85K+</div>
              <div className="text-muted-foreground">{t("issuesResolved")}</div>
            </Card>

            <Card className="p-8 text-center space-y-2">
              <MapPin className="w-10 h-10 text-accent mx-auto" />
              <div className="text-4xl font-bold">120+</div>
              <div className="text-muted-foreground">{t("citiesCovered")}</div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container">
          <Card className="max-w-4xl mx-auto p-12 text-center space-y-6">
            <TrendingUp className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("readyToMakeDifference")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("joinThousands")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/signup">
                <Button size="lg" className="text-lg px-8">
                  {t("getStartedFree")}
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  {t("signIn")}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={civicmindLogo} 
                  alt="CivicMind Logo" 
                  className="w-14 h-14 rounded-full object-cover"
                  style={{ imageRendering: 'crisp-edges' }}
                />
                <span className="text-xl font-bold">CivicMind</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("makingCitiesSmarter")}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("product")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/feed" className="hover:text-primary">{t("browseComplaints")}</Link></li>
                <li><Link to="/post-complaint" className="hover:text-primary">{t("reportIssue")}</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary">{t("dashboard")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("company")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary">{t("aboutUs")}</Link></li>
                <li><Link to="/support" className="hover:text-primary">{t("support")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("legal")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">{t("privacyPolicy")}</a></li>
                <li><a href="#" className="hover:text-primary">{t("termsOfService")}</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 CivicMind. {t("allRightsReserved")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
