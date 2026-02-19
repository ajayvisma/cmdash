import { useQuery } from "@tanstack/react-query";
import { Coins, TrendingUp, TrendingDown, Award, MapPin, Calendar, Gift, Zap } from "lucide-react";
import type { CreditTransaction } from "@shared/schema";
import { CURRENT_USER_ID } from "@/lib/constants";

function TransactionIcon({ type }: { type: string }) {
  const iconMap: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
    event_attendance: { icon: Calendar, bg: "bg-emerald-100", color: "text-emerald-600" },
    hosting: { icon: Award, bg: "bg-blue-100", color: "text-blue-600" },
    check_in: { icon: MapPin, bg: "bg-purple-100", color: "text-purple-600" },
    redemption: { icon: Gift, bg: "bg-orange-100", color: "text-orange-600" },
    referral: { icon: Gift, bg: "bg-pink-100", color: "text-pink-600" },
    streak_bonus: { icon: Zap, bg: "bg-yellow-100", color: "text-yellow-600" },
  };

  const config = iconMap[type] ?? { icon: Coins, bg: "bg-gray-100", color: "text-gray-600" };
  const Icon = config.icon;

  return (
    <div className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
    </div>
  );
}

export default function WalletPage() {
  const { data, isLoading } = useQuery<{ balance: number; transactions: CreditTransaction[] }>({
    queryKey: [`/api/users/${CURRENT_USER_ID}/credits`],
  });

  const { data: profile } = useQuery<{ attendanceStreak: number; eventsAttended: number }>({
    queryKey: [`/api/users/${CURRENT_USER_ID}/profile`],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-32 bg-muted rounded-2xl animate-pulse" />
        <div className="space-y-3 mt-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const balance = data?.balance ?? 0;
  const transactions = data?.transactions ?? [];
  const earned = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const spent = Math.abs(transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="text-2xl font-bold text-foreground mb-5">Wallet</h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground mb-6">
        <p className="text-sm opacity-90 mb-1">Local Credits</p>
        <p className="text-4xl font-bold">{balance}</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 opacity-80" />
            <span className="text-sm opacity-90">{earned} earned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 opacity-80" />
            <span className="text-sm opacity-90">{spent} spent</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card rounded-xl border border-border p-3.5">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>
          <p className="text-xl font-bold text-foreground">{profile?.attendanceStreak ?? 0}</p>
          <p className="text-xs text-muted-foreground">events in a row</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3.5">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Attended</span>
          </div>
          <p className="text-xl font-bold text-foreground">{profile?.eventsAttended ?? 0}</p>
          <p className="text-xs text-muted-foreground">total events</p>
        </div>
      </div>

      {/* How to earn */}
      <div className="bg-muted/50 rounded-xl border border-border p-4 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-2">How to earn credits</h3>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            Attend events at partner venues
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            Check in at local businesses
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            Host your own events
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            Refer friends to the community
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            Build attendance streaks
          </li>
        </ul>
      </div>

      {/* Transactions */}
      <h2 className="text-sm font-semibold text-foreground mb-3">Recent activity</h2>
      <div className="space-y-2">
        {transactions.map(tx => (
          <div key={tx.id} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
            <TransactionIcon type={tx.type} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
              <p className="text-xs text-muted-foreground capitalize">{tx.type.replace(/_/g, " ")}</p>
            </div>
            <span className={`text-sm font-semibold ${tx.amount > 0 ? "text-accent" : "text-destructive"}`}>
              {tx.amount > 0 ? "+" : ""}{tx.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
