import { useQuery } from "@tanstack/react-query";
import { Shield, Star, Award, Calendar, Users, Zap, TrendingUp, MapPin } from "lucide-react";
import type { UserProfile, EventWithHost } from "@shared/schema";
import EventCard from "@/components/home/EventCard";
import { CURRENT_USER_ID } from "@/lib/constants";

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-3.5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function ReputationSection({ profile }: { profile: UserProfile }) {
  return (
    <div className="space-y-3">
      {/* Attendance Rate */}
      <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-sm text-foreground">Attendance Rate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${profile.attendanceRate}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-foreground">{profile.attendanceRate}%</span>
        </div>
      </div>

      {/* Host Reliability */}
      <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-foreground">Host Reliability</span>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
          {profile.reliabilityBadge}
        </span>
      </div>

      {/* Community Karma */}
      <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-foreground">Community Karma</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{profile.communityKarma}</span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">
            {profile.karmaLevel}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: [`/api/users/${CURRENT_USER_ID}/profile`],
  });

  const { data: upcomingEvents } = useQuery<EventWithHost[]>({
    queryKey: [`/api/events/attending/${CURRENT_USER_ID}`],
  });

  if (isLoading || !profile) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-muted rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse w-32" />
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
          </div>
        </div>
      </div>
    );
  }

  const interests: string[] = profile.interests ? JSON.parse(profile.interests) : [];

  return (
    <div className="px-5 pt-12 pb-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xl font-bold text-primary">
            {profile.name.split(" ").map(n => n[0]).join("")}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{profile.name}</h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            {profile.neighborhood}
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-sm text-muted-foreground mb-5">{profile.bio}</p>
      )}

      {/* Interests */}
      {interests.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {interests.map(interest => (
            <span key={interest} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground capitalize">
              {interest}
            </span>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Calendar}
          label="Events Attended"
          value={profile.eventsAttended ?? 0}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={Users}
          label="Events Hosted"
          value={profile.eventsHosted ?? 0}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          icon={Zap}
          label="Current Streak"
          value={profile.attendanceStreak ?? 0}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          icon={Award}
          label="Credits"
          value={profile.credits ?? 0}
          color="bg-emerald-100 text-emerald-600"
        />
      </div>

      {/* Reputation */}
      <h2 className="text-sm font-semibold text-foreground mb-3">Reputation</h2>
      <div className="mb-6">
        <ReputationSection profile={profile} />
      </div>

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-foreground mb-3">Your upcoming events</h2>
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
