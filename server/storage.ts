import {
  type User, type InsertUser,
  type Venue, type InsertVenue,
  type Event, type InsertEvent,
  type Rsvp, type InsertRsvp,
  type CreditTransaction, type InsertCreditTransaction,
  type Nudge, type InsertNudge,
  type EventWithHost,
  type UserProfile,
  type HomeFeed,
  type OnboardingData,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  completeOnboarding(id: number, data: OnboardingData): Promise<User | undefined>;

  // Venues
  getVenue(id: number): Promise<Venue | undefined>;
  getVenuesByNeighborhood(neighborhood: string): Promise<Venue[]>;
  createVenue(venue: InsertVenue): Promise<Venue>;

  // Events
  getEvent(id: number): Promise<Event | undefined>;
  getEventWithHost(id: number, userId: number): Promise<EventWithHost | undefined>;
  getNearbyEvents(userId: number, neighborhood?: string): Promise<EventWithHost[]>;
  getEventsByCategory(category: string, userId: number): Promise<EventWithHost[]>;
  getUserHostedEvents(userId: number): Promise<Event[]>;
  getUserAttendingEvents(userId: number): Promise<EventWithHost[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, updates: Partial<Event>): Promise<Event | undefined>;

  // RSVPs
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
  cancelRsvp(userId: number, eventId: number): Promise<void>;
  getRsvpsByEvent(eventId: number): Promise<Rsvp[]>;
  getRsvpsByUser(userId: number): Promise<Rsvp[]>;
  getUserRsvpForEvent(userId: number, eventId: number): Promise<Rsvp | undefined>;

  // Credits
  getCreditTransactions(userId: number): Promise<CreditTransaction[]>;
  createCreditTransaction(tx: InsertCreditTransaction): Promise<CreditTransaction>;
  getUserCredits(userId: number): Promise<number>;

  // Nudges
  getNudges(userId: number): Promise<Nudge[]>;
  getUnreadNudges(userId: number): Promise<Nudge[]>;
  createNudge(nudge: InsertNudge): Promise<Nudge>;
  markNudgeRead(id: number): Promise<void>;

  // Home Feed
  getHomeFeed(userId: number): Promise<HomeFeed>;

  // Profile
  getUserProfile(id: number): Promise<UserProfile | undefined>;
}

function getKarmaLevel(karma: number): string {
  if (karma >= 500) return "Legend";
  if (karma >= 200) return "Connector";
  if (karma >= 100) return "Regular";
  if (karma >= 50) return "Explorer";
  return "Newcomer";
}

function getReliabilityBadge(score: number): string {
  if (score >= 95) return "Rock Solid";
  if (score >= 85) return "Reliable";
  if (score >= 70) return "Good";
  return "Building";
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private venues: Map<number, Venue>;
  private events: Map<number, Event>;
  private rsvps: Map<number, Rsvp>;
  private creditTransactions: Map<number, CreditTransaction>;
  private nudges: Map<number, Nudge>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.venues = new Map();
    this.events = new Map();
    this.rsvps = new Map();
    this.creditTransactions = new Map();
    this.nudges = new Map();
    this.currentId = 1;
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create users
    const user1 = await this.createUser({
      username: "hari",
      password: "password",
      name: "Hari Kumar",
      avatar: null,
      bio: "Foodie and yoga enthusiast. New to the neighborhood!",
      neighborhood: "Williamsburg",
      interests: JSON.stringify(["food", "fitness", "wellness", "music"]),
      socialEnergy: "small",
      availableDays: JSON.stringify(["friday", "saturday", "sunday"]),
      attendanceRate: 92,
      hostReliabilityScore: 95,
      communityKarma: 145,
      credits: 320,
      attendanceStreak: 5,
      eventsAttended: 18,
      eventsHosted: 3,
      onboardingComplete: true,
    });

    const user2 = await this.createUser({
      username: "maya",
      password: "password",
      name: "Maya Chen",
      avatar: null,
      bio: "Artist and coffee lover. Always up for gallery walks.",
      neighborhood: "Williamsburg",
      interests: JSON.stringify(["arts", "food", "social"]),
      socialEnergy: "medium",
      availableDays: JSON.stringify(["saturday", "sunday"]),
      attendanceRate: 97,
      hostReliabilityScore: 100,
      communityKarma: 280,
      credits: 540,
      attendanceStreak: 12,
      eventsAttended: 34,
      eventsHosted: 8,
      onboardingComplete: true,
    });

    const user3 = await this.createUser({
      username: "alex",
      password: "password",
      name: "Alex Rivera",
      avatar: null,
      bio: "Music producer and vinyl collector. Let's jam!",
      neighborhood: "Greenpoint",
      interests: JSON.stringify(["music", "social", "food"]),
      socialEnergy: "large",
      availableDays: JSON.stringify(["thursday", "friday", "saturday"]),
      attendanceRate: 88,
      hostReliabilityScore: 90,
      communityKarma: 190,
      credits: 210,
      attendanceStreak: 3,
      eventsAttended: 25,
      eventsHosted: 6,
      onboardingComplete: true,
    });

    const user4 = await this.createUser({
      username: "priya",
      password: "password",
      name: "Priya Patel",
      avatar: null,
      bio: "Bookworm and tea enthusiast. Love thoughtful conversations.",
      neighborhood: "Williamsburg",
      interests: JSON.stringify(["learning", "wellness", "food"]),
      socialEnergy: "small",
      availableDays: JSON.stringify(["wednesday", "saturday"]),
      attendanceRate: 100,
      hostReliabilityScore: 98,
      communityKarma: 320,
      credits: 680,
      attendanceStreak: 8,
      eventsAttended: 42,
      eventsHosted: 12,
      onboardingComplete: true,
    });

    const user5 = await this.createUser({
      username: "sam",
      password: "password",
      name: "Sam Okafor",
      avatar: null,
      bio: "Runner and home cook. Training for my first marathon!",
      neighborhood: "Greenpoint",
      interests: JSON.stringify(["fitness", "food", "outdoor"]),
      socialEnergy: "medium",
      availableDays: JSON.stringify(["monday", "wednesday", "saturday"]),
      attendanceRate: 85,
      hostReliabilityScore: 88,
      communityKarma: 95,
      credits: 150,
      attendanceStreak: 2,
      eventsAttended: 12,
      eventsHosted: 2,
      onboardingComplete: true,
    });

    // Create venues
    const venue1 = await this.createVenue({
      name: "Devocion Coffee",
      address: "69 Grand St, Brooklyn",
      neighborhood: "Williamsburg",
      category: "cafe",
      imageUrl: null,
      lat: 40.7143,
      lng: -73.9613,
      isPartner: true,
    });

    const venue2 = await this.createVenue({
      name: "Domino Park",
      address: "15 River St, Brooklyn",
      neighborhood: "Williamsburg",
      category: "park",
      imageUrl: null,
      lat: 40.7138,
      lng: -73.9685,
      isPartner: false,
    });

    const venue3 = await this.createVenue({
      name: "The Yoga Room",
      address: "112 N 6th St, Brooklyn",
      neighborhood: "Williamsburg",
      category: "studio",
      imageUrl: null,
      lat: 40.7181,
      lng: -73.9612,
      isPartner: true,
    });

    const venue4 = await this.createVenue({
      name: "Rough Trade",
      address: "64 N 9th St, Brooklyn",
      neighborhood: "Williamsburg",
      category: "bar",
      imageUrl: null,
      lat: 40.7178,
      lng: -73.9583,
      isPartner: true,
    });

    const venue5 = await this.createVenue({
      name: "Five Leaves",
      address: "18 Bedford Ave, Brooklyn",
      neighborhood: "Greenpoint",
      category: "restaurant",
      imageUrl: null,
      lat: 40.7226,
      lng: -73.9569,
      isPartner: true,
    });

    const venue6 = await this.createVenue({
      name: "Transmitter Park",
      address: "Greenpoint Ave, Brooklyn",
      neighborhood: "Greenpoint",
      category: "park",
      imageUrl: null,
      lat: 40.7292,
      lng: -73.9601,
      isPartner: false,
    });

    const venue7 = await this.createVenue({
      name: "Brooklyn Art Library",
      address: "103 N 3rd St, Brooklyn",
      neighborhood: "Williamsburg",
      category: "community_center",
      imageUrl: null,
      lat: 40.7168,
      lng: -73.9619,
      isPartner: true,
    });

    // Create events
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    const thisSaturday = new Date();
    thisSaturday.setDate(thisSaturday.getDate() + (6 - thisSaturday.getDay()));
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const event1 = await this.createEvent({
      title: "Morning Yoga in the Park",
      description: "Start your day right with a gentle flow session. All levels welcome. Bring your own mat!",
      hostId: user2.id,
      venueId: venue2.id,
      category: "fitness",
      vibe: "mindful",
      date: tomorrow,
      startTime: "7:30 AM",
      endTime: "8:30 AM",
      maxCapacity: 12,
      currentAttendees: 8,
      depositAmount: 500,
      creditsEarned: 15,
      imageUrl: null,
      neighborhood: "Williamsburg",
      lat: 40.7138,
      lng: -73.9685,
      distance: 0.3,
      status: "upcoming",
    });

    const event2 = await this.createEvent({
      title: "Homemade Pasta Night",
      description: "Learn to make fresh pasta from scratch. We'll be making tagliatelle with a seasonal ragu. Ingredients provided.",
      hostId: user4.id,
      venueId: venue5.id,
      category: "food",
      vibe: "chill",
      date: thisSaturday,
      startTime: "6:30 PM",
      endTime: "9:00 PM",
      maxCapacity: 8,
      currentAttendees: 6,
      depositAmount: 1500,
      creditsEarned: 25,
      imageUrl: null,
      neighborhood: "Greenpoint",
      lat: 40.7226,
      lng: -73.9569,
      distance: 0.8,
      status: "upcoming",
    });

    const event3 = await this.createEvent({
      title: "Vinyl Listening Session",
      description: "Bring your favorite records and share the stories behind them. Great vibes, great sound system, great people.",
      hostId: user3.id,
      venueId: venue4.id,
      category: "music",
      vibe: "chill",
      date: tomorrow,
      startTime: "8:00 PM",
      endTime: "10:30 PM",
      maxCapacity: 15,
      currentAttendees: 9,
      depositAmount: 0,
      creditsEarned: 10,
      imageUrl: null,
      neighborhood: "Williamsburg",
      lat: 40.7178,
      lng: -73.9583,
      distance: 0.4,
      status: "upcoming",
    });

    const event4 = await this.createEvent({
      title: "Sketch & Sip",
      description: "Bring your sketchbook and a drink. We'll draw the sunset over the Manhattan skyline. No experience needed.",
      hostId: user2.id,
      venueId: venue6.id,
      category: "arts",
      vibe: "creative",
      date: dayAfter,
      startTime: "5:00 PM",
      endTime: "7:00 PM",
      maxCapacity: 10,
      currentAttendees: 4,
      depositAmount: 0,
      creditsEarned: 15,
      imageUrl: null,
      neighborhood: "Greenpoint",
      lat: 40.7292,
      lng: -73.9601,
      distance: 1.1,
      status: "upcoming",
    });

    const event5 = await this.createEvent({
      title: "Book Club: Fiction picks",
      description: "This month we're reading 'Tomorrow, and Tomorrow, and Tomorrow'. Join for a thoughtful discussion and chai.",
      hostId: user4.id,
      venueId: venue1.id,
      category: "learning",
      vibe: "mindful",
      date: nextWeek,
      startTime: "3:00 PM",
      endTime: "5:00 PM",
      maxCapacity: 8,
      currentAttendees: 5,
      depositAmount: 0,
      creditsEarned: 20,
      imageUrl: null,
      neighborhood: "Williamsburg",
      lat: 40.7143,
      lng: -73.9613,
      distance: 0.2,
      status: "upcoming",
    });

    const event6 = await this.createEvent({
      title: "5K Fun Run",
      description: "Easy-paced group run along the waterfront. All paces welcome! We'll grab coffee after.",
      hostId: user5.id,
      venueId: venue6.id,
      category: "fitness",
      vibe: "energetic",
      date: thisSaturday,
      startTime: "8:00 AM",
      endTime: "9:30 AM",
      maxCapacity: 20,
      currentAttendees: 11,
      depositAmount: 0,
      creditsEarned: 15,
      imageUrl: null,
      neighborhood: "Greenpoint",
      lat: 40.7292,
      lng: -73.9601,
      distance: 1.0,
      status: "upcoming",
    });

    const event7 = await this.createEvent({
      title: "Jazz Night at Rough Trade",
      description: "Local jazz trio performing live. Intimate setting with craft cocktails. Limited seats.",
      hostId: user3.id,
      venueId: venue4.id,
      category: "music",
      vibe: "chill",
      date: dayAfter,
      startTime: "9:00 PM",
      endTime: "11:00 PM",
      maxCapacity: 10,
      currentAttendees: 8,
      depositAmount: 1000,
      creditsEarned: 20,
      imageUrl: null,
      neighborhood: "Williamsburg",
      lat: 40.7178,
      lng: -73.9583,
      distance: 0.4,
      status: "upcoming",
    });

    const event8 = await this.createEvent({
      title: "Community Potluck",
      description: "Bring a dish to share! Theme: comfort food from home. Great way to meet your neighbors.",
      hostId: user1.id,
      venueId: venue7.id,
      category: "social",
      vibe: "chill",
      date: nextWeek,
      startTime: "12:00 PM",
      endTime: "3:00 PM",
      maxCapacity: 16,
      currentAttendees: 7,
      depositAmount: 0,
      creditsEarned: 10,
      imageUrl: null,
      neighborhood: "Williamsburg",
      lat: 40.7168,
      lng: -73.9619,
      distance: 0.3,
      status: "upcoming",
    });

    // Create RSVPs
    await this.createRsvp({ userId: user1.id, eventId: event1.id, status: "confirmed", depositPaid: true, checkedIn: false });
    await this.createRsvp({ userId: user1.id, eventId: event3.id, status: "confirmed", depositPaid: false, checkedIn: false });
    await this.createRsvp({ userId: user2.id, eventId: event2.id, status: "confirmed", depositPaid: true, checkedIn: false });
    await this.createRsvp({ userId: user3.id, eventId: event1.id, status: "confirmed", depositPaid: true, checkedIn: false });
    await this.createRsvp({ userId: user4.id, eventId: event3.id, status: "confirmed", depositPaid: false, checkedIn: false });
    await this.createRsvp({ userId: user5.id, eventId: event6.id, status: "confirmed", depositPaid: false, checkedIn: false });
    await this.createRsvp({ userId: user1.id, eventId: event5.id, status: "confirmed", depositPaid: false, checkedIn: false });

    // Credit transactions for user1
    await this.createCreditTransaction({ userId: user1.id, amount: 15, type: "event_attendance", description: "Attended Morning Yoga", eventId: event1.id, venueId: null });
    await this.createCreditTransaction({ userId: user1.id, amount: 25, type: "event_attendance", description: "Attended Pasta Night", eventId: event2.id, venueId: null });
    await this.createCreditTransaction({ userId: user1.id, amount: 10, type: "hosting", description: "Hosted Community Potluck", eventId: event8.id, venueId: null });
    await this.createCreditTransaction({ userId: user1.id, amount: 20, type: "check_in", description: "Checked in at Devocion Coffee", eventId: null, venueId: venue1.id });
    await this.createCreditTransaction({ userId: user1.id, amount: -50, type: "redemption", description: "Redeemed at Five Leaves", eventId: null, venueId: venue5.id });
    await this.createCreditTransaction({ userId: user1.id, amount: 30, type: "streak_bonus", description: "5-event attendance streak!", eventId: null, venueId: null });
    await this.createCreditTransaction({ userId: user1.id, amount: 50, type: "referral", description: "Referred a friend", eventId: null, venueId: null });
    await this.createCreditTransaction({ userId: user1.id, amount: -25, type: "redemption", description: "Exclusive event access", eventId: event7.id, venueId: null });

    // Nudges for user1
    await this.createNudge({
      userId: user1.id,
      message: "You've had a busy week. How about something low-key this weekend?",
      type: "suggestion",
      eventId: event5.id,
      read: false,
      actionLabel: "View Event",
    });
    await this.createNudge({
      userId: user1.id,
      message: "Two seats left for Jazz Night near you.",
      type: "reminder",
      eventId: event7.id,
      read: false,
      actionLabel: "Grab a Seat",
    });
    await this.createNudge({
      userId: user1.id,
      message: "Maya is attending Sketch & Sip -- join her?",
      type: "social",
      eventId: event4.id,
      read: false,
      actionLabel: "Join",
    });
    await this.createNudge({
      userId: user1.id,
      message: "You're on a 5-event streak! Keep it going this weekend.",
      type: "streak",
      eventId: null,
      read: true,
      actionLabel: null,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      id,
      username: userData.username,
      password: userData.password,
      name: userData.name,
      avatar: userData.avatar ?? null,
      bio: userData.bio ?? null,
      neighborhood: userData.neighborhood ?? null,
      interests: userData.interests ?? null,
      socialEnergy: userData.socialEnergy ?? null,
      availableDays: userData.availableDays ?? null,
      attendanceRate: userData.attendanceRate ?? 100,
      hostReliabilityScore: userData.hostReliabilityScore ?? 100,
      communityKarma: userData.communityKarma ?? 0,
      credits: userData.credits ?? 0,
      attendanceStreak: userData.attendanceStreak ?? 0,
      eventsAttended: userData.eventsAttended ?? 0,
      eventsHosted: userData.eventsHosted ?? 0,
      onboardingComplete: userData.onboardingComplete ?? false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async completeOnboarding(id: number, data: OnboardingData): Promise<User | undefined> {
    return this.updateUser(id, {
      interests: JSON.stringify(data.interests),
      availableDays: JSON.stringify(data.availableDays),
      socialEnergy: data.socialEnergy,
      neighborhood: data.neighborhood,
      onboardingComplete: true,
    });
  }

  // Venue methods
  async getVenue(id: number): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async getVenuesByNeighborhood(neighborhood: string): Promise<Venue[]> {
    return Array.from(this.venues.values()).filter(v =>
      v.neighborhood.toLowerCase() === neighborhood.toLowerCase()
    );
  }

  async createVenue(venueData: InsertVenue): Promise<Venue> {
    const id = this.currentId++;
    const venue: Venue = {
      id,
      name: venueData.name,
      address: venueData.address,
      neighborhood: venueData.neighborhood,
      category: venueData.category,
      imageUrl: venueData.imageUrl ?? null,
      lat: venueData.lat,
      lng: venueData.lng,
      isPartner: venueData.isPartner ?? false,
      createdAt: new Date(),
    };
    this.venues.set(id, venue);
    return venue;
  }

  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  private async enrichEvent(event: Event, userId: number): Promise<EventWithHost> {
    const host = await this.getUser(event.hostId);
    const venue = event.venueId ? await this.getVenue(event.venueId) : undefined;
    const rsvp = await this.getUserRsvpForEvent(userId, event.id);

    return {
      ...event,
      host: {
        id: host!.id,
        name: host!.name,
        avatar: host!.avatar,
        hostReliabilityScore: host!.hostReliabilityScore,
        communityKarma: host!.communityKarma,
      },
      venue,
      seatsLeft: event.maxCapacity - event.currentAttendees,
      isRsvped: !!rsvp && rsvp.status === "confirmed",
    };
  }

  async getEventWithHost(id: number, userId: number): Promise<EventWithHost | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    return this.enrichEvent(event, userId);
  }

  async getNearbyEvents(userId: number, neighborhood?: string): Promise<EventWithHost[]> {
    const user = await this.getUser(userId);
    const hood = neighborhood || user?.neighborhood || "Williamsburg";
    const allEvents = Array.from(this.events.values())
      .filter(e => e.status === "upcoming")
      .sort((a, b) => (a.distance || 99) - (b.distance || 99));

    const result: EventWithHost[] = [];
    for (const event of allEvents) {
      result.push(await this.enrichEvent(event, userId));
    }
    return result;
  }

  async getEventsByCategory(category: string, userId: number): Promise<EventWithHost[]> {
    const events = Array.from(this.events.values())
      .filter(e => e.category === category && e.status === "upcoming");

    const result: EventWithHost[] = [];
    for (const event of events) {
      result.push(await this.enrichEvent(event, userId));
    }
    return result;
  }

  async getUserHostedEvents(userId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(e => e.hostId === userId);
  }

  async getUserAttendingEvents(userId: number): Promise<EventWithHost[]> {
    const userRsvps = Array.from(this.rsvps.values())
      .filter(r => r.userId === userId && r.status === "confirmed");

    const result: EventWithHost[] = [];
    for (const rsvp of userRsvps) {
      const event = this.events.get(rsvp.eventId);
      if (event && event.status === "upcoming") {
        result.push(await this.enrichEvent(event, userId));
      }
    }
    return result;
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const id = this.currentId++;
    const event: Event = {
      id,
      title: eventData.title,
      description: eventData.description ?? null,
      hostId: eventData.hostId,
      venueId: eventData.venueId ?? null,
      category: eventData.category,
      vibe: eventData.vibe ?? null,
      date: eventData.date,
      startTime: eventData.startTime,
      endTime: eventData.endTime ?? null,
      maxCapacity: eventData.maxCapacity ?? 12,
      currentAttendees: eventData.currentAttendees ?? 0,
      depositAmount: eventData.depositAmount ?? 0,
      creditsEarned: eventData.creditsEarned ?? 10,
      imageUrl: eventData.imageUrl ?? null,
      neighborhood: eventData.neighborhood,
      lat: eventData.lat ?? null,
      lng: eventData.lng ?? null,
      distance: eventData.distance ?? null,
      status: eventData.status ?? "upcoming",
      createdAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, updates: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    const updated = { ...event, ...updates };
    this.events.set(id, updated);
    return updated;
  }

  // RSVP methods
  async createRsvp(rsvpData: InsertRsvp): Promise<Rsvp> {
    const id = this.currentId++;
    const rsvp: Rsvp = {
      id,
      userId: rsvpData.userId,
      eventId: rsvpData.eventId,
      status: rsvpData.status ?? "confirmed",
      depositPaid: rsvpData.depositPaid ?? false,
      checkedIn: rsvpData.checkedIn ?? false,
      createdAt: new Date(),
    };
    this.rsvps.set(id, rsvp);

    // Update event attendee count
    const event = this.events.get(rsvpData.eventId);
    if (event) {
      event.currentAttendees += 1;
      this.events.set(event.id, event);
    }

    return rsvp;
  }

  async cancelRsvp(userId: number, eventId: number): Promise<void> {
    const rsvp = await this.getUserRsvpForEvent(userId, eventId);
    if (rsvp) {
      rsvp.status = "cancelled";
      this.rsvps.set(rsvp.id, rsvp);
      const event = this.events.get(eventId);
      if (event && event.currentAttendees > 0) {
        event.currentAttendees -= 1;
        this.events.set(event.id, event);
      }
    }
  }

  async getRsvpsByEvent(eventId: number): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values()).filter(r => r.eventId === eventId && r.status === "confirmed");
  }

  async getRsvpsByUser(userId: number): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values()).filter(r => r.userId === userId);
  }

  async getUserRsvpForEvent(userId: number, eventId: number): Promise<Rsvp | undefined> {
    return Array.from(this.rsvps.values()).find(r =>
      r.userId === userId && r.eventId === eventId && r.status === "confirmed"
    );
  }

  // Credit methods
  async getCreditTransactions(userId: number): Promise<CreditTransaction[]> {
    return Array.from(this.creditTransactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createCreditTransaction(txData: InsertCreditTransaction): Promise<CreditTransaction> {
    const id = this.currentId++;
    const tx: CreditTransaction = {
      id,
      userId: txData.userId,
      amount: txData.amount,
      type: txData.type,
      description: txData.description,
      eventId: txData.eventId ?? null,
      venueId: txData.venueId ?? null,
      createdAt: new Date(),
    };
    this.creditTransactions.set(id, tx);
    return tx;
  }

  async getUserCredits(userId: number): Promise<number> {
    const user = await this.getUser(userId);
    return user?.credits ?? 0;
  }

  // Nudge methods
  async getNudges(userId: number): Promise<Nudge[]> {
    return Array.from(this.nudges.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUnreadNudges(userId: number): Promise<Nudge[]> {
    return (await this.getNudges(userId)).filter(n => !n.read);
  }

  async createNudge(nudgeData: InsertNudge): Promise<Nudge> {
    const id = this.currentId++;
    const nudge: Nudge = {
      id,
      userId: nudgeData.userId,
      message: nudgeData.message,
      type: nudgeData.type,
      eventId: nudgeData.eventId ?? null,
      read: nudgeData.read ?? false,
      actionLabel: nudgeData.actionLabel ?? null,
      createdAt: new Date(),
    };
    this.nudges.set(id, nudge);
    return nudge;
  }

  async markNudgeRead(id: number): Promise<void> {
    const nudge = this.nudges.get(id);
    if (nudge) {
      nudge.read = true;
      this.nudges.set(id, nudge);
    }
  }

  // Home Feed
  async getHomeFeed(userId: number): Promise<HomeFeed> {
    const events = await this.getNearbyEvents(userId);
    const nudges = await this.getUnreadNudges(userId);

    // Build friend activity from RSVPs
    const friendActivity: HomeFeed["friendActivity"] = [];
    const allRsvps = Array.from(this.rsvps.values()).filter(r => r.userId !== userId && r.status === "confirmed");
    for (const rsvp of allRsvps.slice(0, 3)) {
      const friend = await this.getUser(rsvp.userId);
      const event = await this.getEvent(rsvp.eventId);
      if (friend && event) {
        friendActivity.push({
          userName: friend.name.split(" ")[0],
          eventTitle: event.title,
          eventId: event.id,
        });
      }
    }

    return {
      curatedEvents: events.slice(0, 5),
      nudges,
      friendActivity,
    };
  }

  // Profile
  async getUserProfile(id: number): Promise<UserProfile | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    return {
      ...user,
      karmaLevel: getKarmaLevel(user.communityKarma ?? 0),
      reliabilityBadge: getReliabilityBadge(user.hostReliabilityScore ?? 100),
    };
  }
}

export const storage = new MemStorage();
