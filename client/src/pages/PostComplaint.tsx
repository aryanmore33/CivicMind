import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, MapPin, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const PostComplaint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    anonymous: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!imageFile) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:4000";
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      console.log("📡 Submitting complaint...");

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("address", formData.location);
      submitData.append("image", imageFile);
      submitData.append("anonymous", String(formData.anonymous));

      // Get geolocation if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            submitData.append("latitude", String(position.coords.latitude));
            submitData.append("longitude", String(position.coords.longitude));
            submitComplaint(submitData, API_BASE_URL, token);
          },
          (error) => {
            console.warn("Geolocation error:", error);
            // Submit without geolocation
            submitComplaint(submitData, API_BASE_URL, token);
          }
        );
      } else {
        // Submit without geolocation
        submitComplaint(submitData, API_BASE_URL, token);
      }
    } catch (error: any) {
      console.error("Error preparing complaint:", error);
      toast.error("Failed to submit complaint");
      setLoading(false);
    }
  };

  const submitComplaint = async (
    data: FormData,
    apiBaseUrl: string,
    token: string
  ) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/complaints`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Complaint submitted:", response.data);
      toast.success("Complaint submitted successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        anonymous: false,
      });
      setImageFile(null);
      setImagePreview("");

      // Redirect after delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting complaint:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to submit complaint";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn />

      <div className="container py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Report a Civic Issue</h1>
          <p className="text-muted-foreground">
            Help make your community better by reporting issues. Our AI will
            automatically categorize and route your complaint.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Upload Image *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                        if (errors.image) {
                          setErrors({ ...errors, image: "" });
                        }
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Click to upload an image</p>
                        <p className="text-sm text-muted-foreground">
                          or drag and drop
                        </p>
                      </div>
                    </div>
                  </label>
                )}
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) {
                    setErrors({ ...errors, title: "" });
                  }
                }}
                className={errors.title ? "border-red-500" : ""}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the issue"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) {
                    setErrors({ ...errors, description: "" });
                  }
                }}
                className={errors.description ? "border-red-500" : ""}
                rows={5}
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Enter address or location"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    if (errors.location) {
                      setErrors({ ...errors, location: "" });
                    }
                  }}
                  className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                  required
                />
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location}</p>
              )}
              <Button type="button" variant="outline" size="sm" className="mt-2">
                <MapPin className="w-4 h-4 mr-2" />
                Use Current Location
              </Button>
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={formData.anonymous}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, anonymous: checked as boolean })
                }
              />
              <label
                htmlFor="anonymous"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Post anonymously
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                <Upload className="w-5 h-5 mr-2" />
                {loading ? "Submitting..." : "Submit Complaint"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostComplaint;
