import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { ComplaintCard } from "@/components/complaint/ComplaintCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Complaint {
  complaint_id: string | number;
  title: string;
  description: string;
  categories?: Array<{ name: string; category_id: number }>;
  status: "pending" | "in-progress" | "in_progress" | "resolved"; // ✅ Add "in_progress"
  address: string;
  image_url?: string;
  created_at: string;
  likes?: number;
  comments?: number;
}


interface FormattedComplaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in-progress" | "solved";
  location: string;
  imageUrl: string;
  likes: number;
  comments: number;
  date: string;
  isLiked?: boolean;
}

const ComplaintsViewDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintsByCategory, setComplaintsByCategory] = useState<
    Record<string, FormattedComplaint[]>
  >({});

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const fetchAllComplaints = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:4000";
    const token = localStorage.getItem("token"); // ✅ Get token

    console.log("📡 Fetching all complaints...");
    console.log("🔑 Token:", token ? "Present" : "Missing"); // Debug

    const response = await axios.get(`${API_BASE_URL}/api/complaints`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Add token to headers
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Complaints fetched:", response.data);

    const fetchedComplaints = response.data.complaints || [];
    setComplaints(fetchedComplaints);

    // Group complaints by category
    categorizeComplaints(fetchedComplaints);

    setLoading(false);
  } catch (error: any) {
    console.error("Error fetching complaints:", error);
    
    // Check if it's 401 Unauthorized
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // You might want to redirect to login here
    } else {
      toast.error("Failed to load complaints");
    }
    
    setLoading(false);
  }
};


  const categorizeComplaints = (comps: Complaint[]) => {
    const categorized: Record<string, FormattedComplaint[]> = {};

    comps.forEach((c) => {
      const formatted = formatComplaint(c);
      const categoryKey = getCategoryKey(c.categories?.[0]?.name || "other");

      if (!categorized[categoryKey]) {
        categorized[categoryKey] = [];
      }

      categorized[categoryKey].push(formatted);
    });

    setComplaintsByCategory(categorized);
  };

  const getCategoryKey = (categoryName: string): string => {
    const normalized = categoryName.toLowerCase();

    if (
      normalized.includes("pothole") ||
      normalized.includes("road") ||
      normalized.includes("footpath")
    ) {
      return "roads-transport";
    } else if (
      normalized.includes("garbage") ||
      normalized.includes("trash") ||
      normalized.includes("drain")
    ) {
      return "garbage-sanitation";
    } else if (
      normalized.includes("water") ||
      normalized.includes("drainage") ||
      normalized.includes("leak")
    ) {
      return "water-drainage";
    } else if (
      normalized.includes("light") ||
      normalized.includes("electric") ||
      normalized.includes("wire")
    ) {
      return "electricity-lighting";
    } else if (
      normalized.includes("safety") ||
      normalized.includes("manhole") ||
      normalized.includes("hawker")
    ) {
      return "public-safety";
    }

    return "other";
  };

  const formatComplaint = (c: Complaint): FormattedComplaint => {
  const categoryName = (c.categories?.[0]?.name || "general").toLowerCase();
  
  // ✅ Handle both "in-progress" and "in_progress"
  let mappedStatus: "pending" | "in-progress" | "solved";
  if (c.status === "resolved") {
    mappedStatus = "solved";
  } else if (c.status === "in_progress" || c.status === "in-progress") {
    mappedStatus = "in-progress";
  } else {
    mappedStatus = "pending";
  }

  return {
    id: String(c.complaint_id),
    title: c.title,
    description: c.description,
    category: categoryName,
    status: mappedStatus,
    location: c.address || "Unknown location",
    imageUrl: c.image_url
      ? `http://localhost:4000${c.image_url}`
      : "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
    likes: c.likes || 0,
    comments: c.comments || 0,
    date: new Date(c.created_at).toLocaleDateString(),
    isLiked: false,
  };
};


  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 text-center">
          <p className="text-muted-foreground">Loading complaints...</p>
        </div>
      </div>
    );
  }

  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const inProgressCount = complaints.filter(
    (c) => c.status === "in-progress"
  ).length;

  const categoryLabels = {
    "roads-transport": t("roadsTransportTitle") || "Roads & Transport",
    "garbage-sanitation": t("garbageSanitationTitle") || "Garbage & Sanitation",
    "water-drainage": t("waterDrainageTitle") || "Water & Drainage",
    "electricity-lighting": t("electricityLightingTitle") || "Electricity & Lighting",
    "public-safety": t("publicSafetyTitle") || "Public Safety",
    other: "Other",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t("complaintsTitle") || "All Complaints"}
          </h1>
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
        {Object.keys(complaintsByCategory).length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No complaints available</p>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 flex-wrap h-auto">
              <TabsTrigger value="all">All Categories</TabsTrigger>
              {Object.entries(complaintsByCategory).map(
                ([categoryId, comps]) => (
                  <TabsTrigger key={categoryId} value={categoryId}>
                    {categoryLabels[categoryId as keyof typeof categoryLabels]}
                    <Badge variant="secondary" className="ml-2">
                      {comps.length}
                    </Badge>
                  </TabsTrigger>
                )
              )}
            </TabsList>

            <TabsContent value="all">
              {Object.entries(complaintsByCategory).map(
                ([categoryId, comps]) => (
                  <div key={categoryId} className="mb-8">
                    <h2 className="text-xl font-bold mb-4">
                      {categoryLabels[categoryId as keyof typeof categoryLabels]}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {comps.map((complaint) => (
                        <ComplaintCard
                          key={complaint.id}
                          id={complaint.id}
                          title={complaint.title}
                          description={complaint.description}
                          category={complaint.category as any}
                          status={complaint.status}
                          location={complaint.location}
                          imageUrl={complaint.imageUrl}
                          likes={complaint.likes}
                          comments={complaint.comments}
                          date={complaint.date}
                          isLiked={complaint.isLiked}
                          onClick={() => navigate(`/complaint/${complaint.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </TabsContent>

            {Object.entries(complaintsByCategory).map(([categoryId, comps]) => (
              <TabsContent key={categoryId} value={categoryId}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {comps.map((complaint) => (
                    <ComplaintCard
                      key={complaint.id}
                      id={complaint.id}
                      title={complaint.title}
                      description={complaint.description}
                      category={complaint.category as any}
                      status={complaint.status}
                      location={complaint.location}
                      imageUrl={complaint.imageUrl}
                      likes={complaint.likes}
                      comments={complaint.comments}
                      date={complaint.date}
                      isLiked={complaint.isLiked}
                      onClick={() => navigate(`/complaint/${complaint.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ComplaintsViewDashboard;
