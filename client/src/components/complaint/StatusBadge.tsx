import { cn } from "@/lib/utils";
import { Clock, PlayCircle, CheckCircle, XCircle } from "lucide-react";

export type ComplaintStatus = "pending" | "in-progress" | "solved" | "rejected";

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
  },
  "in-progress": {
    label: "In Progress",
    icon: PlayCircle,
    className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
  },
  solved: {
    label: "Solved",
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};
