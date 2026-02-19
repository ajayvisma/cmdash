export const CURRENT_USER_ID = 1;

export const CATEGORIES = [
  { key: "food", label: "Food & Drink", icon: "UtensilsCrossed", color: "bg-orange-100 text-orange-700" },
  { key: "fitness", label: "Fitness", icon: "Dumbbell", color: "bg-emerald-100 text-emerald-700" },
  { key: "arts", label: "Arts", icon: "Palette", color: "bg-purple-100 text-purple-700" },
  { key: "music", label: "Music", icon: "Music", color: "bg-pink-100 text-pink-700" },
  { key: "social", label: "Social", icon: "Users", color: "bg-blue-100 text-blue-700" },
  { key: "learning", label: "Learning", icon: "BookOpen", color: "bg-yellow-100 text-yellow-700" },
  { key: "outdoor", label: "Outdoor", icon: "TreePine", color: "bg-green-100 text-green-700" },
  { key: "wellness", label: "Wellness", icon: "Heart", color: "bg-cyan-100 text-cyan-700" },
] as const;

export const VIBES = [
  { key: "chill", label: "Chill" },
  { key: "energetic", label: "Energetic" },
  { key: "creative", label: "Creative" },
  { key: "mindful", label: "Mindful" },
  { key: "adventurous", label: "Adventurous" },
] as const;

export const NEIGHBORHOODS = [
  "Williamsburg",
  "Greenpoint",
  "Bushwick",
  "Park Slope",
  "DUMBO",
  "Fort Greene",
  "Prospect Heights",
  "Crown Heights",
] as const;

export const DAYS = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
] as const;

export function getCategoryColor(category: string): string {
  const cat = CATEGORIES.find(c => c.key === category);
  return cat?.color ?? "bg-gray-100 text-gray-700";
}

export function getCategoryBgClass(category: string): string {
  const map: Record<string, string> = {
    food: "bg-orange-500",
    fitness: "bg-emerald-500",
    arts: "bg-purple-500",
    music: "bg-pink-500",
    social: "bg-blue-500",
    learning: "bg-yellow-500",
    outdoor: "bg-green-500",
    wellness: "bg-cyan-500",
  };
  return map[category] ?? "bg-gray-500";
}
