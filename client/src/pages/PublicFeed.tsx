import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Construction, Trash2, Droplet, Zap, ShieldAlert } from "lucide-react";
import roadsTransportBanner from "@/assets/roads-transportation-banner.jpg";
import garbageSanitationBanner from "@/assets/garbage-sanitation-banner.jpg";
import waterDrainageBanner from "@/assets/water-drainage-banner.jpg";
import electricityLightingBanner from "@/assets/electricity-lighting-banner.jpg";
import publicSafetyBanner from "@/assets/public-safety-banner.jpg";

interface CategoryCardProps {
  title: string;
  description: string;
  subcategories: string[];
  banner: string;
  icon: React.ReactNode;
  onReport: () => void;
  reportButtonText: string;
}

const CategoryCard = ({ title, description, subcategories, banner, icon, onReport, reportButtonText }: CategoryCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img src={banner} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            {icon}
          </div>
          <h3 className="text-white text-2xl font-bold">{title}</h3>
        </div>
      </div>
      <CardHeader>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col">
        <div className="flex-1">
          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Common Issues:</h4>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub, index) => (
              <span key={index} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                {sub}
              </span>
            ))}
          </div>
        </div>
        <Button onClick={onReport} className="w-full mt-auto">
          {reportButtonText}
        </Button>
      </CardContent>
    </Card>
  );
};

const PublicFeed = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const categories = [
    {
      id: "roads-transport",
      title: t("roadsTransportTitle"),
      description: t("roadsTransportDesc"),
      subcategories: [
        t("roadsTransportSub1"),
        t("roadsTransportSub2"),
        t("roadsTransportSub3"),
        t("roadsTransportSub4"),
        t("roadsTransportSub5"),
        t("roadsTransportSub6"),
        t("roadsTransportSub7"),
      ],
      banner: roadsTransportBanner,
      icon: <Construction className="w-6 h-6 text-white" />,
    },
    {
      id: "garbage-sanitation",
      title: t("garbageSanitationTitle"),
      description: t("garbageSanitationDesc"),
      subcategories: [
        t("garbageSanitationSub1"),
        t("garbageSanitationSub2"),
        t("garbageSanitationSub3"),
        t("garbageSanitationSub4"),
        t("garbageSanitationSub5"),
        t("garbageSanitationSub6"),
      ],
      banner: garbageSanitationBanner,
      icon: <Trash2 className="w-6 h-6 text-white" />,
    },
    {
      id: "water-drainage",
      title: t("waterDrainageTitle"),
      description: t("waterDrainageDesc"),
      subcategories: [
        t("waterDrainageSub1"),
        t("waterDrainageSub2"),
        t("waterDrainageSub3"),
        t("waterDrainageSub4"),
        t("waterDrainageSub5"),
      ],
      banner: waterDrainageBanner,
      icon: <Droplet className="w-6 h-6 text-white" />,
    },
    {
      id: "electricity-lighting",
      title: t("electricityLightingTitle"),
      description: t("electricityLightingDesc"),
      subcategories: [
        t("electricityLightingSub1"),
        t("electricityLightingSub2"),
        t("electricityLightingSub3"),
        t("electricityLightingSub4"),
      ],
      banner: electricityLightingBanner,
      icon: <Zap className="w-6 h-6 text-white" />,
    },
    {
      id: "public-safety",
      title: t("publicSafetyTitle"),
      description: t("publicSafetyDesc"),
      subcategories: [
        t("publicSafetySub1"),
        t("publicSafetySub2"),
        t("publicSafetySub3"),
        t("publicSafetySub4"),
        t("publicSafetySub5"),
        t("publicSafetySub6"),
      ],
      banner: publicSafetyBanner,
      icon: <ShieldAlert className="w-6 h-6 text-white" />,
    },
  ];

  const handleReportComplaint = (categoryId: string) => {
    navigate(`/post-complaint?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {t("complaintsTitle")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("complaintsSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              description={category.description}
              subcategories={category.subcategories}
              banner={category.banner}
              icon={category.icon}
              onReport={() => handleReportComplaint(category.id)}
              reportButtonText={t("reportComplaintBtn")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicFeed;
