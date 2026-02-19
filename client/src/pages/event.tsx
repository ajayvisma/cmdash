import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, MapPin, Clock, Users, Shield, Star, Coins } from "lucide-react";
import { format } from "date-fns";
import type { EventWithHost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { CURRENT_USER_ID, getCategoryColor } from "@/lib/constants";

function HostProfile({ host }: { host: EventWithHost["host"] }) {
  const reliabilityBadge = (host.hostReliabilityScore ?? 0) >= 95
    ? "Rock Solid"
    : (host.hostReliabilityScore ?? 0) >= 85
    ? "Reliable"
    : "Good";

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-sm font-bold text-primary">
          {host.name.split(" ").map(n => n[0]).join("")}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{host.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            {reliabilityBadge}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3" />
            Karma {host.communityKarma}
          </span>
        </div>
      </div>
    </div>
  );
}

function AttendeePreview({ eventId }: { eventId: number }) {
  const { data: attendees } = useQuery<{ id: number; name: string; avatar: string | null; attendanceRate: number }[]>({
    queryKey: [`/api/events/${eventId}/attendees`],
  });

  if (!attendees || attendees.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {attendees.slice(0, 5).map(a => (
          <div
            key={a.id}
            className="w-7 h-7 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center"
          >
            <span className="text-[9px] font-bold text-primary">{a.name[0]}</span>
          </div>
        ))}
      </div>
      {attendees.length > 5 && (
        <span className="text-xs text-muted-foreground">+{attendees.length - 5} more</span>
      )}
    </div>
  );
}

export default function EventPage() {
  const [, params] = useRoute("/event/:id");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const eventId = parseInt(params?.id ?? "0");

  const { data: event, isLoading } = useQuery<EventWithHost>({
    queryKey: [`/api/events/${eventId}?userId=${CURRENT_USER_ID}`],
    enabled: eventId > 0,
  });

  const rsvpMutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", `/api/events/${eventId}/rsvp`, { userId: CURRENT_USER_ID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/home/${CURRENT_USER_ID}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/events/attending/${CURRENT_USER_ID}`] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () =>
      apiRequest("DELETE", `/api/events/${eventId}/rsvp?userId=${CURRENT_USER_ID}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/home/${CURRENT_USER_ID}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/events/attending/${CURRENT_USER_ID}`] });
    },
  });

  if (isLoading || !event) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-6 w-6 bg-muted rounded animate-pulse" />
        <div className="h-8 bg-muted rounded-lg animate-pulse w-3/4 mt-4" />
        <div className="h-40 bg-muted rounded-xl animate-pulse mt-4" />
      </div>
    );
  }

  const seatsLeft = event.seatsLeft;
  const isFull = seatsLeft <= 0;

  return (
    <div className="px-5 pt-12 pb-28">
      {/* Back button */}
      <button
        onClick={() => setLocation("/")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Category + Vibe */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(event.category)}`}>
          {event.category}
        </span>
        {event.vibe && (
          <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-muted">
            {event.vibe}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-foreground mb-4">{event.title}</h1>

      {/* Meta info */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {format(new Date(event.date), "EEEE, MMMM d")} &middot; {event.startTime}
          {event.endTime && ` - ${event.endTime}`}
        </div>
        {event.venue && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {event.venue.name} &middot; {event.venue.address}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          {event.currentAttendees}/{event.maxCapacity} attending
          {seatsLeft <= 3 && seatsLeft > 0 && (
            <span className="text-destructive font-medium">&middot; {seatsLeft} seats left!</span>
          )}
          {isFull && <span className="text-destructive font-medium">&middot; Full</span>}
        </div>
        {(event.creditsEarned ?? 0) > 0 && (
          <div className="flex items-center gap-2 text-sm text-accent font-medium">
            <Coins className="w-4 h-4" />
            Earn {event.creditsEarned} credits
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-2">About</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
      </div>

      {/* Host */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-2">Host</h2>
        <HostProfile host={event.host} />
      </div>

      {/* Attendees */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-2">Who's going</h2>
        <AttendeePreview eventId={event.id} />
      </div>

      {/* Deposit notice */}
      {(event.depositAmount ?? 0) > 0 && (
        <div className="rounded-xl bg-muted/50 border border-border p-3 mb-6">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Refundable deposit:</span>{" "}
            ${((event.depositAmount ?? 0) / 100).toFixed(2)} -- returned when you attend.
          </p>
        </div>
      )}

      {/* RSVP Button - fixed at bottom */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-40">
        <div className="max-w-md mx-auto">
          {event.isRsvped ? (
            <button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="w-full py-3.5 rounded-xl border-2 border-primary text-primary font-semibold text-sm transition-colors hover:bg-primary/5"
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel RSVP"}
            </button>
          ) : (
            <button
              onClick={() => rsvpMutation.mutate()}
              disabled={isFull || rsvpMutation.isPending}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {rsvpMutation.isPending
                ? "Confirming..."
                : isFull
                ? "Event Full"
                : `RSVP${(event.depositAmount ?? 0) > 0 ? ` ($${((event.depositAmount ?? 0) / 100).toFixed(2)} deposit)` : ""}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
