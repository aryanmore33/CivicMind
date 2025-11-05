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
  ArrowLeft,
  Send
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface Comment {
  interaction_id: number;
  user_name: string;
  user_id: number;
  comment_text: string;
  created_at: string;
}

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  // ✅ Combined fetch function to avoid race conditions
  useEffect(() => {
    if (id) {
      fetchAllData();
    }
  }, [id]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      console.log("📡 Fetching complaint detail for ID:", id);

      // ✅ Fetch complaint detail
      const complaintResponse = await axios.get(
        `${API_BASE_URL}/api/complaints/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Complaint detail fetched:", complaintResponse.data);

      // ✅ Fetch interactions (likes & comments)
      const interactionsResponse = await axios.get(
        `${API_BASE_URL}/api/interactions/${id}/interactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Interactions fetched:", interactionsResponse.data);

      const complaintData = complaintResponse.data.complaint || complaintResponse.data;
      const interactionsData = interactionsResponse.data?.data;

      // ✅ Format complaint with FRESH like count from interactions
      const formatted = {
        id: String(complaintData.complaint_id),
        title: complaintData.title,
        description: complaintData.description,
        category: (complaintData.categories?.[0]?.name || "general").toLowerCase(),
        status: complaintData.status === "resolved" ? "solved" : (complaintData.status || "pending"),
        location: complaintData.address || "Unknown location",
        imageUrl: complaintData.image_url
          ? `${API_BASE_URL}${complaintData.image_url}`
          : "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200",
        likes: interactionsData?.likes_count || 0, // ✅ Use fresh count from interactions
        comments: complaintData.comments || 0,
        date: new Date(complaintData.created_at).toLocaleDateString(),
        authorName: complaintData.user?.name || "Anonymous",
      };

      // ✅ Update all state at once
      setComplaint(formatted);
      setComments(interactionsData?.comments || []);
      setIsLiked(interactionsData?.current_user_liked || false);

      console.log("💬 Comments loaded:", interactionsData?.comments?.length);
      console.log("❤️ Likes count:", interactionsData?.likes_count);

      setLoading(false);

    } catch (error: any) {
      console.error("Error fetching data:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error("Complaint not found");
        navigate("/feed");
      } else {
        toast.error("Failed to load complaint details");
      }
      
      setLoading(false);
    }
  };

  // ✅ Helper function to fetch fresh like count
  const fetchFreshLikeCount = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/interactions/${id}/interactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const freshLikeCount = response.data?.data?.likes_count || 0;
      console.log("✅ Fresh like count fetched:", freshLikeCount);
      return freshLikeCount;
    } catch (error) {
      console.error("⚠️ Could not fetch fresh like count");
      return complaint?.likes || 0;
    }
  };

  const handleLike = async () => {
    try {
      if (!token) {
        toast.error("Please login to like");
        navigate("/login");
        return;
      }

      console.log("❤️ Toggling like for complaint:", id);
      console.log("🔑 Token being sent:", token.substring(0, 20) + "...");

      const response = await axios.post(
        `${API_BASE_URL}/api/interactions/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Like response:", response.data);
      
      // ✅ Update local state immediately
      setIsLiked(response.data.liked);

      // ✅ Fetch fresh like count from database
      const freshLikeCount = await fetchFreshLikeCount();
      
      setComplaint({
        ...complaint,
        likes: freshLikeCount,
      });

      toast.success(response.data.action === "liked" ? "Liked! ❤️" : "Unliked");
    } catch (error: any) {
      console.error("❌ Error toggling like:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to toggle like");
    }
  };

  const handleAddComment = async () => {
    try {
      if (!token) {
        toast.error("Please login to comment");
        navigate("/login");
        return;
      }

      if (!commentText.trim()) {
        toast.error("Comment cannot be empty");
        return;
      }

      setSubmittingComment(true);

      console.log("💬 Adding comment for complaint:", id);
      console.log("🔑 Token being sent:", token.substring(0, 20) + "...");

      const response = await axios.post(
        `${API_BASE_URL}/api/interactions/${id}/comment`,
        { commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Comment added:", response.data);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const newComment: Comment = {
        interaction_id: response.data.interaction_id,
        user_name: user.name || "You",
        user_id: user.user_id,
        comment_text: response.data.comment_text,
        created_at: response.data.created_at,
      };

      setComments([newComment, ...comments]);
      setCommentText("");
      
      setComplaint({
        ...complaint,
        comments: complaint.comments + 1,
      });

      toast.success("Comment added!");
      setSubmittingComment(false);
    } catch (error: any) {
      console.error("❌ Error adding comment:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to add comment");
      setSubmittingComment(false);
    }
  };

  const handleMarkResolved = async () => {
    try {
      console.log("📡 Marking complaint as resolved...");

      await axios.put(
        `${API_BASE_URL}/api/complaints/${id}/status`,
        { status: "resolved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Complaint marked as resolved!");
      setComplaint({ ...complaint, status: "solved" });
    } catch (error: any) {
      console.error("Error marking as resolved:", error);
      toast.error("Failed to mark as resolved");
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

      <div className="container py-8 max-w-5xl">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

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
                  <StatusBadge status={complaint.status as any} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CategoryIcon category={complaint.category as any} className="w-4 h-4" />
                    <span>{getCategoryLabel(complaint.category as any)}</span>
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
                  <Button 
                    variant="outline" 
                    className={isLiked ? "text-red-500 border-red-200" : ""}
                    onClick={handleLike}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
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
              
              {/* Add Comment Input */}
              <div className="mb-6 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                    disabled={submittingComment}
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={submittingComment || !commentText.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No comments yet. Be the first to comment! 💬
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.interaction_id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{comment.user_name}</p>
                          <p className="text-xs text-muted-foreground mb-1">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {comment.comment_text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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

            {/* Action Button */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleMarkResolved}
              disabled={complaint.status === "solved"}
            >
              {complaint.status === "solved" ? "✓ Resolved" : "Mark as Resolved"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
