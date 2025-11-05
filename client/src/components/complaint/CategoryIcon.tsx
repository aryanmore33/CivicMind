import { 
  Construction, 
  Trash2, 
  Droplets, 
  Lightbulb, 
  Shield, 
  AlertTriangle,
  MoreHorizontal 
} from "lucide-react";

export type ComplaintCategory = 
  | "pothole" 
  | "garbage" 
  | "water-leak" 
  | "streetlight" 
  | "public-safety" 
  | "drainage" 
  | "other";

interface CategoryIconProps {
  category?: ComplaintCategory | string;
  className?: string;
}

const categoryConfig = {
  pothole: { icon: Construction, color: "text-orange-600" },
  garbage: { icon: Trash2, color: "text-green-600" },
  "water-leak": { icon: Droplets, color: "text-blue-600" },
  streetlight: { icon: Lightbulb, color: "text-yellow-600" },
  "public-safety": { icon: Shield, color: "text-red-600" },
  drainage: { icon: AlertTriangle, color: "text-purple-600" },
  other: { icon: MoreHorizontal, color: "text-gray-600" },
};

// Default fallback config
const defaultConfig = { 
  icon: MoreHorizontal, 
  color: "text-gray-600" 
};

export const CategoryIcon = ({ 
  category = "other", 
  className = "w-5 h-5" 
}: CategoryIconProps) => {
  // ✅ Add fallback - use default if category not found
  const config = categoryConfig[category as keyof typeof categoryConfig] || defaultConfig;
  const Icon = config.icon;

  return <Icon className={`${config.color} ${className}`} />;
};

export const getCategoryLabel = (category?: ComplaintCategory | string): string => {
  const labels: Record<string, string> = {
    pothole: "Pothole",
    garbage: "Garbage",
    "water-leak": "Water Leak",
    streetlight: "Street Light",
    "public-safety": "Public Safety",
    drainage: "Drainage",
    other: "Other",
  };
  // ✅ Return default if not found
  return labels[category as string] || "Other";
};
