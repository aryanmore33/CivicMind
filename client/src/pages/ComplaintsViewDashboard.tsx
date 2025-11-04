import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { ComplaintCard } from "@/components/complaint/ComplaintCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock categorized complaints data
const complaintsByCategory = {
  "roads-transport": [
    {
      id: "rt1",
      title: "Large pothole on SV Road",
      description: "Dangerous pothole causing traffic issues near the intersection",
      category: "pothole" as const,
      status: "pending" as const,
      location: "SV Road, Andheri West",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      likes: 24,
      comments: 8,
      date: "2 days ago",
    },
    {
      id: "rt2",
      title: "Broken footpath near station",
      description: "Pedestrians at risk due to damaged footpath tiles",
      category: "pothole" as const,
      status: "in-progress" as const,
      location: "Bandra Station Road",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      likes: 18,
      comments: 5,
      date: "1 day ago",
    },
  ],
  "garbage-sanitation": [
    {
      id: "gs1",
      title: "Overflowing garbage bins",
      description: "Multiple garbage bins haven't been collected in over a week",
      category: "garbage" as const,
      status: "pending" as const,
      location: "Linking Road, Khar",
      imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
      likes: 32,
      comments: 12,
      date: "1 day ago",
    },
    {
      id: "gs2",
      title: "Open drain stench",
      description: "Unbearable smell from open drain affecting residents",
      category: "garbage" as const,
      status: "pending" as const,
      location: "Juhu Scheme",
      imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
      likes: 45,
      comments: 18,
      date: "3 hours ago",
    },
  ],
  "water-drainage": [
    {
      id: "wd1",
      title: "Water leakage from main pipe",
      description: "Major water leak causing road flooding and wastage",
      category: "water-leak" as const,
      status: "in-progress" as const,
      location: "Hill Road, Bandra",
      imageUrl: "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=800",
      likes: 56,
      comments: 15,
      date: "5 hours ago",
    },
    {
      id: "wd2",
      title: "Irregular water supply",
      description: "No water supply for 3 days in the area",
      category: "water-leak" as const,
      status: "pending" as const,
      location: "Goregaon East",
      imageUrl: "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=800",
      likes: 67,
      comments: 24,
      date: "12 hours ago",
    },
  ],
  "electricity-lighting": [
    {
      id: "el1",
      title: "Street lights not working",
      description: "Entire street without lighting at night creating safety concerns",
      category: "streetlight" as const,
      status: "pending" as const,
      location: "Carter Road, Bandra",
      imageUrl: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800",
      likes: 41,
      comments: 11,
      date: "6 hours ago",
    },
    {
      id: "el2",
      title: "Exposed electrical wires",
      description: "Dangerous exposed wires near residential area",
      category: "streetlight" as const,
      status: "in-progress" as const,
      location: "Lokhandwala Complex",
      imageUrl: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800",
      likes: 52,
      comments: 19,
      date: "8 hours ago",
    },
  ],
  "public-safety": [
    {
      id: "ps1",
      title: "Illegal hawkers blocking footpath",
      description: "Vendors occupying entire footpath forcing pedestrians onto road",
      category: "pothole" as const,
      status: "pending" as const,
      location: "Station Road, Dadar",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
      likes: 38,
      comments: 14,
      date: "1 day ago",
    },
    {
      id: "ps2",
      title: "Open manhole without cover",
      description: "Dangerous open manhole posing risk to pedestrians and vehicles",
      category: "pothole" as const,
      status: "pending" as const,
      location: "Worli Sea Face",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
      likes: 73,
      comments: 28,
      date: "4 hours ago",
    },
  ],
};

const ComplaintsViewDashboard = () => {
  const { t } = useLanguage();
  
  const totalComplaints = Object.values(complaintsByCategory).flat().length;
  const pendingCount = Object.values(complaintsByCategory)
    .flat()
    .filter((c) => c.status === "pending").length;
  const inProgressCount = Object.values(complaintsByCategory)
    .flat()
    .filter((c) => c.status === "in-progress").length;

  const categoryLabels = {
    "roads-transport": t("roadsTransportTitle"),
    "garbage-sanitation": t("garbageSanitationTitle"),
    "water-drainage": t("waterDrainageTitle"),
    "electricity-lighting": t("electricityLightingTitle"),
    "public-safety": t("publicSafetyTitle"),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("complaintsTitle")}</h1>
          <p className="text-muted-foreground">
            View all registered complaints organized by category
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Complaints
                </p>
                <p className="text-2xl font-bold">{totalComplaints}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-2xl font-bold text-status-pending">
                  {pendingCount}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-status-pending" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-status-progress">
                  {inProgressCount}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-status-progress/10 flex items-center justify-center">
                <span className="text-lg font-bold text-status-progress">
                  {inProgressCount}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Categorized Complaints */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="all">All Categories</TabsTrigger>
            {Object.entries(complaintsByCategory).map(([categoryId, complaints]) => (
              <TabsTrigger key={categoryId} value={categoryId}>
                {categoryLabels[categoryId as keyof typeof categoryLabels]}
                <Badge variant="secondary" className="ml-2">
                  {complaints.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            {Object.entries(complaintsByCategory).map(([categoryId, complaints]) => (
              <div key={categoryId} className="mb-8">
                <h2 className="text-xl font-bold mb-4">
                  {categoryLabels[categoryId as keyof typeof categoryLabels]}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {complaints.map((complaint) => (
                    <ComplaintCard
                      key={complaint.id}
                      {...complaint}
                      onClick={() => window.location.href = `/complaint/${complaint.id}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {Object.entries(complaintsByCategory).map(([categoryId, complaints]) => (
            <TabsContent key={categoryId} value={categoryId}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {complaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    {...complaint}
                    onClick={() => window.location.href = `/complaint/${complaint.id}`}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ComplaintsViewDashboard;
