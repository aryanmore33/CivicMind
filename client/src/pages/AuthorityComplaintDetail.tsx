import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/complaint/StatusBadge";
import { CategoryIcon } from "@/components/complaint/CategoryIcon";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthorityComplaintDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<"pending" | "in-progress" | "solved" | "rejected">("pending");
  const [response, setResponse] = useState("");

  // Mock data
  const complaint = {
    id: id,
    title: "Large pothole on Main Street",
    description:
      "There is a dangerous pothole at the intersection of Main Street and 5th Avenue. It's been there for over a week and is causing traffic issues. Several vehicles have been damaged. The pothole is approximately 2 feet wide and 6 inches deep.",
    category: "pothole" as const,
    status: status,
    location: "Main St & 5th Ave, Downtown",
    imageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
    citizenName: "John Doe",
    citizenContact: "john.doe@email.com",
    date: "2024-03-15",
    aiClassification: "Pothole - High Priority",
    aiConfidence: "95%",
  };

  const handleStatusUpdate = () => {
    toast({
      title: "Status Updated",
      description: `Complaint status changed to ${status}`,
    });
  };

  const handleSendResponse = () => {
    if (!response.trim()) return;
    toast({
      title: "Response Sent",
      description: "Citizen has been notified of the update",
    });
    setResponse("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <Link to="/authority">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <img
                src={complaint.imageUrl}
                alt={complaint.title}
                className="w-full h-80 object-cover"
              />
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={complaint.category} />
                    <div>
                      <h1 className="text-2xl font-bold">{complaint.title}</h1>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={complaint.status} />
                        <span className="text-sm text-muted-foreground">
                          Reported on {complaint.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{complaint.location}</span>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{complaint.description}</p>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">AI Classification</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-medium">
                      {complaint.aiClassification}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Confidence: {complaint.aiConfidence}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Response Section */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Send Update to Citizen</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="response">Your Response</Label>
                  <Textarea
                    id="response"
                    placeholder="Provide an update or request additional information..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <Button onClick={handleSendResponse} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Response
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Citizen Info */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Citizen Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{complaint.citizenName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{complaint.citizenContact}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reported</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{complaint.date}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Status Management */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Update Status</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Current Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value: any) => setStatus(value)}
                  >
                    <SelectTrigger id="status" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="solved">Solved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleStatusUpdate} className="w-full">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Update Status
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Contact Citizen
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityComplaintDetail;
