import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import axios from "axios";

const AuthorityComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState<any>(null);
  const [status, setStatus] = useState<"pending" | "in_progress" | "resolved">("pending");
  const [response, setResponse] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sendingResponse, setSendingResponse] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ Verify authority access
  useEffect(() => {
    if (!token || user.role !== "authority") {
      toast.error("Access denied. Authorities only.");
      navigate("/login", { replace: true });
      return;
    }

    if (id) {
      fetchComplaintDetail();
    }
  }, [id]);

  const fetchComplaintDetail = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching complaint detail for ID:", id);

      const response = await axios.get(
        `${API_BASE_URL}/api/complaints/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Complaint detail fetched:", response.data);

      const data = response.data.complaint || response.data;

      const formatted = {
        id: String(data.complaint_id),
        title: data.title,
        description: data.description,
        category: (data.categories?.[0]?.name || "general").toLowerCase(),
        status: data.status || "pending",
        location: data.address || "Unknown location",
        imageUrl: data.image_url
          ? `${API_BASE_URL}${data.image_url}`
          : "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200",
        citizenName: data.user?.name || "Anonymous",
        citizenContact: data.user?.email || "N/A",
        date: new Date(data.created_at).toLocaleDateString(),
        userId: data.user_id,
        likes: data.likes || 0,
        comments: data.comments || 0,
      };

      setComplaint(formatted);
      setStatus(data.status || "pending");
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching complaint:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login", { replace: true });
      } else if (error.response?.status === 404) {
        toast.error("Complaint not found");
        navigate("/authority", { replace: true });
      } else {
        toast.error("Failed to load complaint details");
      }

      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!complaint) return;

    try {
      setUpdatingStatus(true);
      console.log("📝 Updating status to:", status);

      const response = await axios.put(
        `${API_BASE_URL}/api/complaints/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Status updated:", response.data);

      setComplaint({
        ...complaint,
        status: status,
      });

      toast.success(`Status updated to ${status}`);
      setUpdatingStatus(false);
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.error || "Failed to update status");
      setUpdatingStatus(false);
    }
  };

  const handleSendResponse = async () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      setSendingResponse(true);
      console.log("💬 Sending response...");

      // ✅ Add response as a comment
      await axios.post(
        `${API_BASE_URL}/api/interactions/${id}/comment`,
        { commentText: `[AUTHORITY] ${response}` },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Response sent");
      toast.success("Response sent to citizen");
      setResponse("");
      setSendingResponse(false);
    } catch (error: any) {
      console.error("Error sending response:", error);
      toast.error("Failed to send response");
      setSendingResponse(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isLoggedIn />
        <div className="container py-8 text-center">
          <p className="text-muted-foreground">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-background">
        <Header isLoggedIn />
        <div className="container py-8 text-center">
          <p className="text-muted-foreground">Complaint not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn />

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
                        <StatusBadge status={complaint.status as any} />
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
                  <h3 className="font-semibold mb-2">Complaint Stats</h3>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Likes</p>
                      <p className="text-lg font-bold">{complaint.likes}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Comments</p>
                      <p className="text-lg font-bold">{complaint.comments}</p>
                    </div>
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
                <Button
                  onClick={handleSendResponse}
                  className="w-full"
                  disabled={sendingResponse || !response.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendingResponse ? "Sending..." : "Send Response"}
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
                  <p className="font-medium text-sm break-all">
                    {complaint.citizenContact}
                  </p>
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
                  <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                    <SelectTrigger id="status" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleStatusUpdate}
                  className="w-full"
                  disabled={updatingStatus}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {updatingStatus ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            {/* <Card className="p-6">
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
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityComplaintDetail;
