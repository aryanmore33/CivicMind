import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ComplaintCard } from "@/components/complaint/ComplaintCard";
import { Link } from "react-router-dom";
import { Plus, Award, TrendingUp, FileText } from "lucide-react";

// Mock data
const mockComplaints = [
  {
    id: "1",
    title: "Large pothole on Main Street",
    description: "Dangerous pothole causing traffic issues near the intersection",
    category: "pothole" as const,
    status: "in-progress" as const,
    location: "Main St & 5th Ave",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
    likes: 24,
    comments: 8,
    date: "2 days ago",
    isLiked: true,
  },
  {
    id: "2",
    title: "Overflowing garbage bins",
    description: "Multiple garbage bins haven't been collected in over a week",
    category: "garbage" as const,
    status: "pending" as const,
    location: "Park Avenue",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
    likes: 15,
    comments: 3,
    date: "1 day ago",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn />
      
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, John!</p>
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
                <p className="text-sm text-muted-foreground mb-1">Total Complaints</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resolved</p>
                <p className="text-2xl font-bold text-secondary">8</p>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                <p className="text-2xl font-bold text-primary">3</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">3</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Badges Earned</p>
                <p className="text-2xl font-bold text-accent">5</p>
              </div>
              <Award className="w-8 h-8 text-accent" />
            </div>
          </Card>
        </div>

        {/* My Complaints */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Complaints</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} {...complaint} />
            ))}
          </div>
        </div>

        {/* Nearby Complaints */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Nearby Complaints</h2>
            <Link to="/feed">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockComplaints.map((complaint) => (
              <ComplaintCard key={`nearby-${complaint.id}`} {...complaint} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
