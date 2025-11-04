import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ComplaintCard } from "@/components/complaint/ComplaintCard";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Award, TrendingUp, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Complaint {
  complaint_id: string | number;
  title: string;
  description: string;
  categories?: Array<{ name: string }>;
  status: "pending" | "in-progress" | "resolved";
  address: string;
  image_url?: string;
  created_at: string;
  latitude?: string;
  longitude?: string;
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
  isLiked: boolean;
}

interface Stats {
  total: number;
  resolved: number;
  inProgress: number;
  badges: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    resolved: 0,
    inProgress: 0,
    badges: 0,
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    // Fetch user's complaints
    fetchComplaints();
  }, [navigate]);

  const fetchComplaints = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:4000";
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      console.log("📡 Fetching user's complaints...");

      const response = await axios.get(`${API_BASE_URL}/api/complaints/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Complaints fetched:", response.data);

      const fetchedComplaints = response.data.complaints || [];
      setComplaints(fetchedComplaints);

      // Calculate stats
      const resolved = fetchedComplaints.filter(
        (c: Complaint) => c.status === "resolved"
      ).length;
      const inProgress = fetchedComplaints.filter(
        (c: Complaint) => c.status === "in-progress"
      ).length;

      setStats({
        total: fetchedComplaints.length,
        resolved,
        inProgress,
        badges: Math.floor(fetchedComplaints.length / 3),
      });

      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching complaints:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error("Failed to load complaints");
      }

      setLoading(false);
    }
  };

  // Convert complaint format for ComplaintCard
  const formatComplaintsForCard = (comps: Complaint[]): FormattedComplaint[] => {
    return comps.map((c) => {
      const categoryName = (c.categories?.[0]?.name || "general").toLowerCase();
      const mappedStatus: "pending" | "in-progress" | "solved" = 
        c.status === "resolved" ? "solved" : c.status;

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
        likes: 0,
        comments: 0,
        date: new Date(c.created_at).toLocaleDateString(),
        isLiked: false,
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isLoggedIn />
        <div className="container py-8 text-center">
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const formattedComplaints = formatComplaintsForCard(complaints);

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn />

      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || "User"}!
            </p>
          </div>
          <Link to="/post-complaint">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Post Complaint
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Complaints
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resolved</p>
                <p className="text-2xl font-bold text-secondary">
                  {stats.resolved}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-primary">
                  {stats.inProgress}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {stats.inProgress}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Badges Earned
                </p>
                <p className="text-2xl font-bold text-accent">{stats.badges}</p>
              </div>
              <Award className="w-8 h-8 text-accent" />
            </div>
          </Card>
        </div>

        {/* My Complaints */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Complaints</h2>
            {formattedComplaints.length > 0 && (
              <Button variant="outline" size="sm">
                View All
              </Button>
            )}
          </div>

          {formattedComplaints.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No complaints posted yet
              </p>
              <Link to="/post-complaint">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Post Your First Complaint
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formattedComplaints.map((complaint) => (
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
                />
              ))}
            </div>
          )}
        </div>

        {/* Nearby Complaints */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Nearby Complaints</h2>
            <Link to="/feed">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {formattedComplaints.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No nearby complaints available
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formattedComplaints.slice(0, 3).map((complaint) => (
                <ComplaintCard
                  key={`nearby-${complaint.id}`}
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
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
