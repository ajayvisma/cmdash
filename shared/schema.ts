import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users - app members with reputation and preferences
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  neighborhood: text("neighborhood"),
  interests: text("interests"), // JSON array stored as text
  socialEnergy: text("social_energy"), // "small", "medium", "large"
  availableDays: text("available_days"), // JSON array stored as text
  attendanceRate: integer("attendance_rate").default(100),
  hostReliabilityScore: integer("host_reliability_score").default(100),
  communityKarma: integer("community_karma").default(0),
  credits: integer("credits").default(0),
  attendanceStreak: integer("attendance_streak").default(0),
  eventsAttended: integer("events_attended").default(0),
  eventsHosted: integer("events_hosted").default(0),
  onboardingComplete: boolean("onboarding_complete").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Venues - local businesses and event spaces
export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  neighborhood: text("neighborhood").notNull(),
  category: text("category").notNull(), // "cafe", "restaurant", "park", "studio", "bar", "community_center"
  imageUrl: text("image_url"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  isPartner: boolean("is_partner").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Events - hyperlocal gatherings
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  hostId: integer("host_id").references(() => users.id).notNull(),
  venueId: integer("venue_id").references(() => venues.id),
  category: text("category").notNull(), // "food", "fitness", "arts", "music", "social", "learning", "outdoor", "wellness"
  vibe: text("vibe"), // "chill", "energetic", "creative", "mindful", "adventurous"
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  maxCapacity: integer("max_capacity").notNull().default(12),
  currentAttendees: integer("current_attendees").notNull().default(0),
  depositAmount: integer("deposit_amount").default(0), // in cents
  creditsEarned: integer("credits_earned").default(10),
  imageUrl: text("image_url"),
  neighborhood: text("neighborhood").notNull(),
  lat: real("lat"),
  lng: real("lng"),
  distance: real("distance"), // calculated field in miles
  status: text("status").notNull().default("upcoming"), // "upcoming", "ongoing", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// RSVPs - attendance commitments
export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  status: text("status").notNull().default("confirmed"), // "confirmed", "cancelled", "attended", "no_show"
  depositPaid: boolean("deposit_paid").default(false),
  checkedIn: boolean("checked_in").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Credit transactions - local economy loop
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(), // positive = earned, negative = spent
  type: text("type").notNull(), // "event_attendance", "hosting", "check_in", "redemption", "referral", "streak_bonus"
  description: text("description").notNull(),
  eventId: integer("event_id").references(() => events.id),
  venueId: integer("venue_id").references(() => venues.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI Nudges - personalized suggestions
export const nudges = pgTable("nudges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // "suggestion", "reminder", "social", "streak", "milestone"
  eventId: integer("event_id").references(() => events.id),
  read: boolean("read").default(false),
  actionLabel: text("action_label"), // "View Event", "Join Now", etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertVenueSchema = createInsertSchema(venues).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export const insertRsvpSchema = createInsertSchema(rsvps).omit({
  id: true,
  createdAt: true,
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertNudgeSchema = createInsertSchema(nudges).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Venue = typeof venues.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Rsvp = typeof rsvps.$inferSelect;
export type InsertRsvp = z.infer<typeof insertRsvpSchema>;

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;

export type Nudge = typeof nudges.$inferSelect;
export type InsertNudge = z.infer<typeof insertNudgeSchema>;

// Extended types for API responses
export type EventWithHost = Event & {
  host: Pick<User, "id" | "name" | "avatar" | "hostReliabilityScore" | "communityKarma">;
  venue?: Venue;
  seatsLeft: number;
  isRsvped: boolean;
};

export type UserProfile = User & {
  karmaLevel: string;
  reliabilityBadge: string;
};

export type HomeFeed = {
  curatedEvents: EventWithHost[];
  nudges: Nudge[];
  friendActivity: { userName: string; eventTitle: string; eventId: number }[];
};

// Onboarding data type
export const onboardingSchema = z.object({
  interests: z.array(z.string()),
  availableDays: z.array(z.string()),
  socialEnergy: z.enum(["small", "medium", "large"]),
  neighborhood: z.string(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
