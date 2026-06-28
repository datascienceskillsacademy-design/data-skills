import type { User } from "@/lib/types";

export const demoUser: User = {
  name: "Jordan Avery",
  email: "jordan@example.com",
  avatar:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop",
  title: "Aspiring Data Analyst",
  joinedDate: "2025-02-14",
  certificatesEarned: 2,
  enrolled: [
    { courseId: "c1", progress: 100, lastAccessed: "2026-06-20" },
    { courseId: "c6", progress: 62, lastAccessed: "2026-06-27" },
    { courseId: "c3", progress: 28, lastAccessed: "2026-06-24" },
    { courseId: "c2", progress: 5, lastAccessed: "2026-06-10" },
  ],
};
