import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { ComplaintCard } from "@/components/complaint/ComplaintCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, MapPin, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const AuthorityDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaintsByCategory, setComplaintsByCategory] = useState<any>({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    highPriority: 0,
  });

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    // ✅ Double check authority access (backup check)
    if (!token || user.role !== "authority") {
      console.error("❌ Unauthorized access attempt to authority dashboard");
      toast.error("Access denied. Authorities only.");
      navigate("/login", { replace: true });
      return;
    }

    console.log("✅ Authority verified. Loading dashboard...");
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("📊 Fetching dashboard data from backend...");

      // ✅ Fetch all complaints
      const response = await axios.get(
        `${API_BASE_URL}/api/complaints/authority/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Dashboard data received:", response.data);

      const complaints = response.data.complaints || [];
      const backendStats = response.data.stats || {};

      // ✅ Group complaints by category
      const grouped: any = {};
      complaints.forEach((complaint: any) => {
        const categoryName = complaint.categories?.[0]?.name || "general";

        if (!grouped[categoryName]) {
          grouped[categoryName] = [];
        }

        grouped[categoryName].push({
          id: String(complaint.complaint_id),
          title: complaint.title,
          description: complaint.description,
          category: categoryName,
          status:
            complaint.status === "resolved" ? "solved" : complaint.status,
          location: complaint.address || "Unknown",
          imageUrl: complaint.image_url
            ? `${API_BASE_URL}${complaint.image_url}`
            : "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
          likes: complaint.likes || 0,
          comments: complaint.comments || 0,
          date: new Date(complaint.created_at).toLocaleDateString(),
          userId: complaint.user_id,
          authorName: complaint.user?.name || "Anonymous",
        });
      });

      setComplaintsByCategory(grouped);

      // ✅ Set stats from backend
      setStats({
        total: backendStats.total || 0,
        pending: backendStats.pending || 0,
        inProgress: backendStats.in_progress || 0,
        highPriority: backendStats.high_priority || 0,
      });

      console.log("📊 Stats:", {
        total: backendStats.total,
        pending: backendStats.pending,
        inProgress: backendStats.in_progress,
        highPriority: backendStats.high_priority,
      });

      setLoading(false);
    } catch (error: any) {
      console.error("❌ Error fetching dashboard data:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Only authorities can access this.");
        navigate("/feed", { replace: true });
      } else {
        toast.error("Failed to load dashboard data");
      }

      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isLoggedIn />
        <div className="container py-8 text-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Authority Dashboard</h1>
          <p className="text-muted-foreground">
            AI-classified complaints for efficient resolution
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Complaints
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-2xl font-bold text-status-pending">
                  {stats.pending}
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
                  {stats.inProgress}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-status-progress/10 flex items-center justify-center">
                <span className="text-lg font-bold text-status-progress">
                  {stats.inProgress}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  High Priority
                </p>
                <p className="text-2xl font-bold text-accent">
                  {stats.highPriority}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-accent" />
            </div>
          </Card>
        </div>

        {/* Categorized Complaints */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Categories</TabsTrigger>
            {Object.keys(complaintsByCategory).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                <Badge variant="secondary" className="ml-2">
                  {complaintsByCategory[category].length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            {Object.entries(complaintsByCategory).length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No complaints found.</p>
              </Card>
            ) : (
              Object.entries(complaintsByCategory).map(
                ([category, complaints]: [string, any]) => (
                  <div key={category} className="mb-8">
                    <h2 className="text-xl font-bold mb-4 capitalize">
                      {category.replace("-", " ")} Issues
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {complaints.map((complaint: any) => (
                        <ComplaintCard
                          key={complaint.id}
                          {...complaint}
                          onClick={() =>
                            navigate(`/authority/complaint/${complaint.id}`)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )
              )
            )}
          </TabsContent>

          {Object.entries(complaintsByCategory).map(
            ([category, complaints]: [string, any]) => (
              <TabsContent key={category} value={category}>
                {complaints.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No {category} complaints found.
                    </p>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complaints.map((complaint: any) => (
                      <ComplaintCard
                        key={complaint.id}
                        {...complaint}
                        onClick={() =>
                          navigate(`/authority/complaint/${complaint.id}`)
                        }
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
