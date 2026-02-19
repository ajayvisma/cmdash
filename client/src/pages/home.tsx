import { useQuery } from "@tanstack/react-query";
import { MapPin, Bell } from "lucide-react";
import type { HomeFeed } from "@shared/schema";
import EventCard from "@/components/home/EventCard";
import NudgeCard from "@/components/home/NudgeCard";
import FriendActivity from "@/components/home/FriendActivity";
import { CURRENT_USER_ID } from "@/lib/constants";

export default function HomePage() {
  const { data: feed, isLoading } = useQuery<HomeFeed>({
    queryKey: [`/api/home/${CURRENT_USER_ID}`],
  });

  const { data: profile } = useQuery<{ name: string; neighborhood: string; credits: number }>({
    queryKey: [`/api/users/${CURRENT_USER_ID}/profile`],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-muted rounded-lg animate-pulse w-48" />
        <div className="h-4 bg-muted rounded animate-pulse w-32" />
        <div className="space-y-3 mt-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const firstName = profile?.name?.split(" ")[0] ?? "there";

  return (
    <div className="px-5 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hey, {firstName}</h1>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            {profile?.neighborhood ?? "Your neighborhood"}
          </div>
        </div>
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          {feed && feed.nudges.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          )}
        </button>
      </div>

      {/* AI Nudges */}
      {feed && feed.nudges.length > 0 && (
        <section className="mb-6">
          <div className="space-y-2">
            {feed.nudges.slice(0, 2).map(nudge => (
              <NudgeCard key={nudge.id} nudge={nudge} />
            ))}
          </div>
        </section>
      )}

      {/* For You */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">For you this week</h2>
        <div className="space-y-3">
          {feed?.curatedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Friend Activity */}
      {feed && feed.friendActivity.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Friends are going</h2>
          <FriendActivity items={feed.friendActivity} />
        </section>
      )}
    </div>
  );
}
