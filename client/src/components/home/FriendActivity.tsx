import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

interface FriendActivityItem {
  userName: string;
  eventTitle: string;
  eventId: number;
}

export default function FriendActivity({ items }: { items: FriendActivityItem[] }) {
  const [, setLocation] = useLocation();

  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => setLocation(`/event/${item.eventId}`)}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">{item.userName[0]}</span>
          </div>
          <p className="text-sm text-foreground flex-1 min-w-0">
            <span className="font-medium">{item.userName}</span>{" "}
            <span className="text-muted-foreground">is attending</span>{" "}
            <span className="font-medium">{item.eventTitle}</span>
          </p>
          <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}
