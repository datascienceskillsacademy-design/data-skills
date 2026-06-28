import type { Instructor } from "@/lib/types";

export const instructors: Instructor[] = [
  {
    id: "founder-amelia",
    name: "Amelia Hart",
    role: "Founder & CEO, DataSkills",
    bio: "Amelia spent eight years leading analytics teams at two Fortune 500 companies before founding DataSkills in 2021. She's obsessed with turning dense, academic data science into career-ready skills anyone can learn.",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    isFounder: true,
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "instr-daniel",
    name: "Daniel Reyes",
    role: "Lead Instructor, Machine Learning",
    bio: "Former ML engineer at a Series-B startup, Daniel has shipped recommendation systems used by millions of users. He teaches with a project-first philosophy: build it, break it, understand it.",
    avatar:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
  {
    id: "instr-priya",
    name: "Priya Nair",
    role: "Instructor, Data Visualization & Analytics",
    bio: "Priya is a data storyteller who has trained over 12,000 students. Previously a senior analyst at a global consulting firm, she specializes in turning raw numbers into decisions executives act on.",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    socials: {
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "instr-marcus",
    name: "Marcus Chen",
    role: "Instructor, Python & Statistics",
    bio: "Marcus holds a PhD in statistics and spent six years teaching at the university level before joining DataSkills full-time to make rigorous statistical thinking accessible online.",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  },
];
