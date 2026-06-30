import type { Course } from "@/lib/types";

export const courses: Course[] = [
  {
    id: "c1",
    slug: "python-for-data-science",
    title: "Python for Data Science, Zero to Job-Ready",
    description:
      "Master Python fundamentals, NumPy, and Pandas through real datasets. Build the foundation every data role requires.",
    category: "Python",
    level: "Beginner",
    price: 49,
    originalPrice: 99,
    rating: 4.8,
    studentsCount: 18420,
    durationHours: 26,
    lessonsCount: 84,
    thumbnail:
      "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?q=80&w=1200&auto=format&fit=crop",
    instructorId: "instr-gias",
    syllabus: [
      {
        module: "Python Fundamentals",
        lessons: ["Variables & Data Types", "Control Flow", "Functions & Modules"],
      },
      {
        module: "Working with Data",
        lessons: ["NumPy Arrays", "Pandas DataFrames", "Cleaning Real Datasets"],
      },
      {
        module: "Capstone Project",
        lessons: ["Exploratory Analysis", "Presenting Findings"],
      },
    ],
  },
  {
    id: "c2",
    slug: "machine-learning-foundations",
    title: "Machine Learning Foundations",
    description:
      "Understand the math and intuition behind supervised and unsupervised learning, then implement models with scikit-learn.",
    category: "Machine Learning",
    level: "Intermediate",
    price: 79,
    originalPrice: 149,
    rating: 4.9,
    studentsCount: 12860,
    durationHours: 34,
    lessonsCount: 96,
    thumbnail:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1200&auto=format&fit=crop",
    instructorId: "instr-ahmed",
    syllabus: [
      {
        module: "Supervised Learning",
        lessons: ["Linear & Logistic Regression", "Decision Trees", "Ensemble Methods"],
      },
      {
        module: "Unsupervised Learning",
        lessons: ["Clustering", "Dimensionality Reduction"],
      },
      {
        module: "Model Evaluation",
        lessons: ["Cross-Validation", "Metrics That Matter"],
      },
    ],
  },
  {
    id: "c3",
    slug: "data-visualization-masterclass",
    title: "Data Visualization Masterclass",
    description:
      "Turn spreadsheets into stories. Learn Matplotlib, Seaborn, and dashboard design principles used by top analysts.",
    category: "Data Visualization",
    level: "Beginner",
    price: 39,
    originalPrice: 79,
    rating: 4.7,
    studentsCount: 9540,
    durationHours: 18,
    lessonsCount: 52,
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    instructorId: "instr-ahmed",
    syllabus: [
      {
        module: "Visualization Principles",
        lessons: ["Choosing the Right Chart", "Color & Typography"],
      },
      {
        module: "Tools in Practice",
        lessons: ["Matplotlib Deep Dive", "Seaborn for Statistical Plots"],
      },
      {
        module: "Dashboards",
        lessons: ["Building an Executive Dashboard"],
      },
    ],
  },
  {
    id: "c4",
    slug: "deep-learning-with-pytorch",
    title: "Deep Learning with PyTorch",
    description:
      "Go from neural network basics to training computer vision and NLP models on real-world data with PyTorch.",
    category: "Deep Learning",
    level: "Advanced",
    price: 99,
    originalPrice: 189,
    rating: 4.9,
    studentsCount: 7320,
    durationHours: 41,
    lessonsCount: 110,
    thumbnail:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    instructorId: "instr-ahmed",
    syllabus: [
      {
        module: "Neural Network Foundations",
        lessons: ["Tensors & Autograd", "Building Your First Network"],
      },
      {
        module: "Computer Vision",
        lessons: ["Convolutional Networks", "Transfer Learning"],
      },
      {
        module: "NLP",
        lessons: ["Transformers Intro", "Fine-Tuning Language Models"],
      },
    ],
  },
  {
    id: "c5",
    slug: "statistics-for-data-analysts",
    title: "Statistics for Data Analysts",
    description:
      "Build rock-solid statistical intuition: distributions, hypothesis testing, and regression, explained without the jargon.",
    category: "Statistics",
    level: "Beginner",
    price: 0,
    rating: 4.6,
    studentsCount: 21130,
    durationHours: 14,
    lessonsCount: 40,
    thumbnail:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1200&auto=format&fit=crop",
    instructorId: "instr-gias",
    syllabus: [
      {
        module: "Descriptive Statistics",
        lessons: ["Mean, Median & Variance", "Distributions"],
      },
      {
        module: "Inferential Statistics",
        lessons: ["Hypothesis Testing", "Confidence Intervals"],
      },
      {
        module: "Regression",
        lessons: ["Simple Linear Regression", "Interpreting Coefficients"],
      },
    ],
  },
  {
    id: "c6",
    slug: "sql-and-data-analysis",
    title: "SQL & Data Analysis for Business Teams",
    description:
      "Query, join, and analyze production databases with confidence. The most requested skill in data analyst job posts.",
    category: "Data Analysis",
    level: "Intermediate",
    price: 59,
    originalPrice: 119,
    rating: 4.8,
    studentsCount: 15870,
    durationHours: 22,
    lessonsCount: 68,
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop",
    instructorId: "instr-ahmed",
    syllabus: [
      {
        module: "SQL Fundamentals",
        lessons: ["SELECT, WHERE, ORDER BY", "Joins Explained"],
      },
      {
        module: "Advanced Querying",
        lessons: ["Window Functions", "CTEs & Subqueries"],
      },
      {
        module: "Real-World Analysis",
        lessons: ["Cohort Analysis", "Building Recurring Reports"],
      },
    ],
  },
];

export function getCourseBySlug(slug: string) {
  return courses.find((course) => course.slug === slug);
}
