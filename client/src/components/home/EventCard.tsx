import { useLocation } from "wouter";
import { MapPin, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import type { EventWithHost } from "@shared/schema";
import { getCategoryColor } from "@/lib/constants";

function SeatsIndicator({ seatsLeft, maxCapacity }: { seatsLeft: number; maxCapacity: number }) {
  const pct = ((maxCapacity - seatsLeft) / maxCapacity) * 100;
  const isUrgent = seatsLeft <= 3;

  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isUrgent ? "bg-destructive" : "bg-accent"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
        {seatsLeft} left
      </span>
    </div>
  );
}

export default function EventCard({ event }: { event: EventWithHost }) {
  const [, setLocation] = useLocation();

  return (
    <button
      onClick={() => setLocation(`/event/${event.id}`)}
      className="w-full text-left bg-card rounded-xl border border-border p-4 transition-spring hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(event.category)}`}>
          {event.category}
        </span>
        {event.vibe && (
          <span className="text-xs text-muted-foreground">
            {event.vibe}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-foreground mb-1 leading-tight">{event.title}</h3>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {format(new Date(event.date), "EEE, MMM d")} {event.startTime}
        </span>
        {event.distance != null && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {event.distance} mi
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">
              {event.host.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{event.host.name}</span>
        </div>

        <SeatsIndicator seatsLeft={event.seatsLeft} maxCapacity={event.maxCapacity} />
      </div>

      {event.isRsvped && (
        <div className="mt-2 text-xs font-medium text-accent flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          You're going
        </div>
      )}
    </button>
  );
}
