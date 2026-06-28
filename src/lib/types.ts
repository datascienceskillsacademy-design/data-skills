export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type CourseCategory =
  | "Data Analysis"
  | "Machine Learning"
  | "Python"
  | "Data Visualization"
  | "Deep Learning"
  | "Statistics";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsCount: number;
  durationHours: number;
  lessonsCount: number;
  thumbnail: string;
  instructorId: string;
  syllabus: { module: string; lessons: string[] }[];
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  isFounder?: boolean;
  socials: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface EnrolledCourse {
  courseId: string;
  progress: number;
  lastAccessed: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  title: string;
  joinedDate: string;
  certificatesEarned: number;
  enrolled: EnrolledCourse[];
}
