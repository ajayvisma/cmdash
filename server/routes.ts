import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, onboardingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Home feed - curated events + nudges + friend activity
  app.get("/api/home/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const feed = await storage.getHomeFeed(userId);
      res.json(feed);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch home feed" });
    }
  });

  // Events - nearby
  app.get("/api/events/nearby/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const neighborhood = req.query.neighborhood as string | undefined;
      const events = await storage.getNearbyEvents(userId, neighborhood);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch nearby events" });
    }
  });

  // Events - by category
  app.get("/api/events/category/:category/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const category = req.params.category;
      const events = await storage.getEventsByCategory(category, userId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events by category" });
    }
  });

  // Events - user's attending
  app.get("/api/events/attending/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const events = await storage.getUserAttendingEvents(userId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attending events" });
    }
  });

  // Events - user's hosted
  app.get("/api/events/hosted/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const events = await storage.getUserHostedEvents(userId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hosted events" });
    }
  });

  // Event detail
  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = parseInt(req.query.userId as string) || 1;
      const event = await storage.getEventWithHost(id, userId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  // Create event
  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const newEvent = await storage.createEvent(eventData);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  // RSVP to event
  app.post("/api/events/:id/rsvp", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = req.body.userId;
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      if (event.currentAttendees >= event.maxCapacity) {
        return res.status(400).json({ error: "Event is full" });
      }
      const existing = await storage.getUserRsvpForEvent(userId, eventId);
      if (existing) {
        return res.status(400).json({ error: "Already RSVP'd" });
      }
      const rsvp = await storage.createRsvp({
        userId,
        eventId,
        status: "confirmed",
        depositPaid: (event.depositAmount ?? 0) > 0,
        checkedIn: false,
      });
      res.status(201).json(rsvp);
    } catch (error) {
      res.status(500).json({ error: "Failed to RSVP" });
    }
  });

  // Cancel RSVP
  app.delete("/api/events/:id/rsvp", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = parseInt(req.query.userId as string);
      await storage.cancelRsvp(userId, eventId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel RSVP" });
    }
  });

  // Event attendees (RSVP list)
  app.get("/api/events/:id/attendees", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const rsvps = await storage.getRsvpsByEvent(eventId);
      const attendees = [];
      for (const rsvp of rsvps) {
        const user = await storage.getUser(rsvp.userId);
        if (user) {
          attendees.push({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            attendanceRate: user.attendanceRate,
          });
        }
      }
      res.json(attendees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendees" });
    }
  });

  // User profile
  app.get("/api/users/:id/profile", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const profile = await storage.getUserProfile(id);
      if (!profile) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Update user
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateUser(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Onboarding
  app.post("/api/users/:id/onboarding", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = onboardingSchema.parse(req.body);
      const user = await storage.completeOnboarding(id, data);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid onboarding data" });
    }
  });

  // Credit transactions
  app.get("/api/users/:id/credits", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const transactions = await storage.getCreditTransactions(userId);
      const balance = await storage.getUserCredits(userId);
      res.json({ balance, transactions });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credits" });
    }
  });

  // Nudges
  app.get("/api/nudges/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const nudges = await storage.getUnreadNudges(userId);
      res.json(nudges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch nudges" });
    }
  });

  // Mark nudge as read
  app.patch("/api/nudges/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markNudgeRead(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark nudge as read" });
    }
  });

  // Venues
  app.get("/api/venues", async (req, res) => {
    try {
      const neighborhood = req.query.neighborhood as string;
      if (!neighborhood) {
        return res.json([]);
      }
      const venues = await storage.getVenuesByNeighborhood(neighborhood);
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch venues" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
