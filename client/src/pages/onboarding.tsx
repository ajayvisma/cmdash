import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronRight, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { CURRENT_USER_ID, CATEGORIES, DAYS, NEIGHBORHOODS } from "@/lib/constants";
import type { OnboardingData } from "@shared/schema";

type Step = "interests" | "availability" | "energy" | "neighborhood";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("interests");
  const [data, setData] = useState<OnboardingData>({
    interests: [],
    availableDays: [],
    socialEnergy: "small",
    neighborhood: "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", `/api/users/${CURRENT_USER_ID}/onboarding`, data),
    onSuccess: () => setLocation("/"),
  });

  const steps: Step[] = ["interests", "availability", "energy", "neighborhood"];
  const currentIndex = steps.indexOf(step);
  const isLast = currentIndex === steps.length - 1;

  const canProceed = () => {
    switch (step) {
      case "interests": return data.interests.length >= 2;
      case "availability": return data.availableDays.length >= 1;
      case "energy": return true;
      case "neighborhood": return data.neighborhood.length > 0;
    }
  };

  const next = () => {
    if (isLast) {
      mutation.mutate();
    } else {
      setStep(steps[currentIndex + 1]);
    }
  };

  const toggleInterest = (key: string) => {
    setData(d => ({
      ...d,
      interests: d.interests.includes(key)
        ? d.interests.filter(i => i !== key)
        : [...d.interests, key],
    }));
  };

  const toggleDay = (key: string) => {
    setData(d => ({
      ...d,
      availableDays: d.availableDays.includes(key)
        ? d.availableDays.filter(i => i !== key)
        : [...d.availableDays, key],
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Progress */}
      <div className="px-6 pt-12">
        <div className="flex gap-1.5 mb-8">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= currentIndex ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 px-6">
        {/* Step: Interests */}
        {step === "interests" && (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-2">What are you into?</h1>
            <p className="text-sm text-muted-foreground mb-6">Pick at least 2 interests so we can find the right events for you.</p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => {
                const selected = data.interests.includes(cat.key);
                return (
                  <button
                    key={cat.key}
                    onClick={() => toggleInterest(cat.key)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
                        {cat.label}
                      </span>
                      {selected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Step: Availability */}
        {step === "availability" && (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-2">When are you usually free?</h1>
            <p className="text-sm text-muted-foreground mb-6">We'll suggest events that match your schedule.</p>
            <div className="flex flex-wrap gap-3">
              {DAYS.map(day => {
                const selected = data.availableDays.includes(day.key);
                return (
                  <button
                    key={day.key}
                    onClick={() => toggleDay(day.key)}
                    className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <span className={`text-sm font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
                      {day.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Step: Social Energy */}
        {step === "energy" && (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-2">What's your social energy?</h1>
            <p className="text-sm text-muted-foreground mb-6">This helps us match you with the right group sizes.</p>
            <div className="space-y-3">
              {[
                { key: "small", title: "Intimate", desc: "Small gatherings of 4-8 people. Deeper conversations." },
                { key: "medium", title: "Balanced", desc: "Medium groups of 8-15 people. Mix of familiar and new faces." },
                { key: "large", title: "Social butterfly", desc: "Larger events of 15+ people. Love meeting lots of new people." },
              ].map(opt => {
                const selected = data.socialEnergy === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setData(d => ({ ...d, socialEnergy: opt.key as OnboardingData["socialEnergy"] }))}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
                          {opt.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                      </div>
                      {selected && <Check className="w-5 h-5 text-primary flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Step: Neighborhood */}
        {step === "neighborhood" && (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-2">Where do you live?</h1>
            <p className="text-sm text-muted-foreground mb-6">We'll show you events within walking distance.</p>
            <div className="grid grid-cols-2 gap-3">
              {NEIGHBORHOODS.map(hood => {
                const selected = data.neighborhood === hood;
                return (
                  <button
                    key={hood}
                    onClick={() => setData(d => ({ ...d, neighborhood: hood }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <span className={`text-sm font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
                      {hood}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Bottom Button */}
      <div className="p-6 safe-bottom">
        <button
          onClick={next}
          disabled={!canProceed() || mutation.isPending}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {mutation.isPending ? "Setting up..." : isLast ? "Let's go" : "Continue"}
          {!isLast && !mutation.isPending && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
