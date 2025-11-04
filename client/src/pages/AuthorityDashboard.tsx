import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { ComplaintCard } from "@/components/complaint/ComplaintCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, MapPin, AlertCircle } from "lucide-react";

// Mock categorized data
const complaintsByCategory = {
  pothole: [
    {
      id: "1",
      title: "Large pothole on Main Street",
      description: "Dangerous pothole causing traffic issues",
      category: "pothole" as const,
      status: "pending" as const,
      location: "Main St & 5th Ave",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      likes: 24,
      comments: 8,
      date: "2 days ago",
    },
    {
      id: "7",
      title: "Deep pothole near school",
      description: "Needs urgent attention near school zone",
      category: "pothole" as const,
      status: "in-progress" as const,
      location: "School Road",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      likes: 18,
      comments: 5,
      date: "1 day ago",
    },
  ],
  garbage: [
    {
      id: "2",
      title: "Overflowing garbage bins",
      description: "Multiple bins haven't been collected in a week",
      category: "garbage" as const,
      status: "pending" as const,
      location: "Park Avenue",
      imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
      likes: 15,
      comments: 3,
      date: "1 day ago",
    },
  ],
  "water-leak": [
    {
      id: "3",
      title: "Broken water pipe flooding street",
      description: "Major water leak causing road flooding",
      category: "water-leak" as const,
      status: "pending" as const,
      location: "Oak Street",
      imageUrl: "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=800",
      likes: 42,
      comments: 12,
      date: "3 hours ago",
    },
  ],
  streetlight: [
    {
      id: "4",
      title: "Street lights not working",
      description: "Entire block without lighting at night",
      category: "streetlight" as const,
      status: "in-progress" as const,
      location: "Elm Street",
      imageUrl: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800",
      likes: 31,
      comments: 7,
      date: "5 hours ago",
    },
  ],
};

const AuthorityDashboard = () => {
  const totalComplaints = Object.values(complaintsByCategory).flat().length;
  const pendingCount = Object.values(complaintsByCategory)
    .flat()
    .filter((c) => c.status === "pending").length;
  const inProgressCount = Object.values(complaintsByCategory)
    .flat()
    .filter((c) => c.status === "in-progress").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

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

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  High Priority
                </p>
                <p className="text-2xl font-bold text-accent">3</p>
              </div>
              <MapPin className="w-8 h-8 text-accent" />
            </div>
          </Card>
        </div>

        {/* Categorized Complaints */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Categories</TabsTrigger>
            <TabsTrigger value="pothole">
              Potholes{" "}
              <Badge variant="secondary" className="ml-2">
                {complaintsByCategory.pothole.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="garbage">
              Garbage{" "}
              <Badge variant="secondary" className="ml-2">
                {complaintsByCategory.garbage.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="water-leak">
              Water Leaks{" "}
              <Badge variant="secondary" className="ml-2">
                {complaintsByCategory["water-leak"].length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="streetlight">
              Streetlights{" "}
              <Badge variant="secondary" className="ml-2">
                {complaintsByCategory.streetlight.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {Object.entries(complaintsByCategory).map(([category, complaints]) => (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-bold mb-4 capitalize">
                  {category.replace("-", " ")} Issues
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {complaints.map((complaint) => (
                    <ComplaintCard
                      key={complaint.id}
                      {...complaint}
                      onClick={() => window.location.href = `/authority/complaint/${complaint.id}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {Object.entries(complaintsByCategory).map(([category, complaints]) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {complaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    {...complaint}
                    onClick={() => window.location.href = `/authority/complaint/${complaint.id}`}
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

export default AuthorityDashboard;
