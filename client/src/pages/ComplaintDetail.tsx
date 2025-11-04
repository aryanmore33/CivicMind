import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/complaint/StatusBadge";
import { CategoryIcon, getCategoryLabel } from "@/components/complaint/CategoryIcon";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Calendar, 
  User,
  CheckCircle 
} from "lucide-react";
import { useParams, Link } from "react-router-dom";

const ComplaintDetail = () => {
  const { id } = useParams();

  // Mock data - in real app, fetch based on id
  const complaint = {
    id: "1",
    title: "Large pothole on Main Street",
    description: "There is a dangerous pothole causing traffic issues near the intersection of Main Street and 5th Avenue. The pothole has been growing larger over the past few weeks and is now causing damage to vehicles. Several cars have already suffered tire damage. This is a safety hazard that needs immediate attention.",
    category: "pothole" as const,
    status: "in-progress" as const,
    location: "Main St & 5th Ave, Downtown",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200",
    likes: 24,
    comments: 8,
    date: "2 days ago",
    isLiked: true,
    authorName: "John Smith",
    statusUpdates: [
      { status: "Submitted", date: "Dec 15, 2024", message: "Complaint submitted by citizen" },
      { status: "Assigned", date: "Dec 16, 2024", message: "Assigned to Public Works Department" },
      { status: "In Progress", date: "Dec 17, 2024", message: "Repair crew dispatched to location" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn />
      
      <div className="container py-8 max-w-5xl">
        <Link to="/feed">
          <Button variant="ghost" className="mb-6">
            ← Back to Feed
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <Card className="overflow-hidden">
              <img 
                src={complaint.imageUrl} 
                alt={complaint.title}
                className="w-full aspect-video object-cover"
              />
            </Card>

            {/* Details */}
            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl font-bold">{complaint.title}</h1>
                  <StatusBadge status={complaint.status} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CategoryIcon category={complaint.category} className="w-4 h-4" />
                    <span>{getCategoryLabel(complaint.category)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{complaint.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{complaint.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{complaint.authorName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" className={complaint.isLiked ? "text-red-500 border-red-200" : ""}>
                    <Heart className={`w-4 h-4 mr-2 ${complaint.isLiked ? "fill-current" : ""}`} />
                    {complaint.likes}
                  </Button>
                  <Button variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {complaint.comments}
                  </Button>
                </div>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </Card>

            {/* Comments Section */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Comments ({complaint.comments})</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center py-8">
                  Comments section coming soon...
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Location</h3>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Map view</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {complaint.location}
              </p>
            </Card>

            {/* Status Timeline */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Status Timeline</h3>
              <div className="space-y-4">
                {complaint.statusUpdates.map((update, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      {index < complaint.statusUpdates.length - 1 && (
                        <div className="w-0.5 h-full bg-border my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm">{update.status}</p>
                      <p className="text-xs text-muted-foreground">{update.date}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {update.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Action Button */}
            <Button className="w-full" size="lg">
              Mark as Resolved
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
