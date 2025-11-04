import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, ComplaintStatus } from "./StatusBadge";
import { CategoryIcon, ComplaintCategory, getCategoryLabel } from "./CategoryIcon";
import { Heart, MessageCircle, Share2, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface ComplaintCardProps {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  location: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  date: string;
  isLiked?: boolean;
  onClick?: () => void;
}

export const ComplaintCard = ({
  id,
  title,
  description,
  category,
  status,
  location,
  imageUrl,
  likes,
  comments,
  date,
  isLiked = false,
  onClick,
}: ComplaintCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow" onClick={onClick ? handleClick : undefined}>
      {imageUrl && (
        <Link to={onClick ? "#" : `/complaint/${id}`} onClick={onClick ? handleClick : undefined}>
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link to={onClick ? "#" : `/complaint/${id}`} onClick={onClick ? handleClick : undefined}>
              <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-1">
                {title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CategoryIcon category={category} className="w-4 h-4" />
            <span>{getCategoryLabel(category)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{date}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart className={`w-4 h-4 mr-1.5 ${isLiked ? "fill-current" : ""}`} />
              {likes}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="w-4 h-4 mr-1.5" />
              {comments}
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
