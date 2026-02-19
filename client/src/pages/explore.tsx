import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import type { EventWithHost } from "@shared/schema";
import EventCard from "@/components/home/EventCard";
import { CURRENT_USER_ID, CATEGORIES } from "@/lib/constants";

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allEvents, isLoading } = useQuery<EventWithHost[]>({
    queryKey: [`/api/events/nearby/${CURRENT_USER_ID}`],
  });

  const { data: categoryEvents } = useQuery<EventWithHost[]>({
    queryKey: [`/api/events/category/${selectedCategory}/${CURRENT_USER_ID}`],
    enabled: !!selectedCategory,
  });

  const events = selectedCategory ? categoryEvents : allEvents;
  const filteredEvents = events?.filter(e =>
    searchQuery === "" ||
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="text-2xl font-bold text-foreground mb-4">Explore</h1>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search events, categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-5 -mx-5 px-5">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !selectedCategory
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === cat.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Something different */}
      {!selectedCategory && !searchQuery && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Something different this week
          </h2>
          {allEvents && allEvents.length > 2 && (
            <EventCard event={allEvents[allEvents.length - 1]} />
          )}
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
          ))
        ) : filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No events found</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
