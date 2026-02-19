import { useLocation } from "wouter";
import { Sparkles, ArrowRight } from "lucide-react";
import type { Nudge } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CURRENT_USER_ID } from "@/lib/constants";

export default function NudgeCard({ nudge }: { nudge: Nudge }) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const markRead = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/nudges/${nudge.id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/home/${CURRENT_USER_ID}`] });
    },
  });

  const handleAction = () => {
    markRead.mutate();
    if (nudge.eventId) {
      setLocation(`/event/${nudge.eventId}`);
    }
  };

  const typeIcon: Record<string, string> = {
    suggestion: "bg-blue-50 border-blue-200",
    reminder: "bg-orange-50 border-orange-200",
    social: "bg-purple-50 border-purple-200",
    streak: "bg-emerald-50 border-emerald-200",
    milestone: "bg-yellow-50 border-yellow-200",
  };

  return (
    <div className={`rounded-xl border p-3.5 ${typeIcon[nudge.type] ?? "bg-muted border-border"}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground leading-snug">{nudge.message}</p>
          {nudge.actionLabel && (
            <button
              onClick={handleAction}
              className="mt-2 text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
            >
              {nudge.actionLabel}
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
