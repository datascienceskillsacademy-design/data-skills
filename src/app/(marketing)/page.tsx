import {
  Database,
  Brain,
  BarChart2,
  HeartPulse,
  Users,
  Shield,
  Sparkles,
  ClipboardList,
  CheckCircle,
  User,
  GraduationCap,
  BookOpen,
  Link2,
  Calendar,
  MonitorPlay,
  Clock,
  Tag,
  Award,
  ArrowRight,
} from "lucide-react";
import type { ElementType } from "react";
import Image from "next/image";
import { Hero } from "@/components/marketing/Hero";
import { StatsStrip } from "@/components/marketing/StatsStrip";
import { BenefitsGrid } from "@/components/marketing/BenefitsGrid";
import { TestimonialCarousel } from "@/components/marketing/TestimonialCarousel";
import { FadeIn } from "@/components/motion/FadeIn";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { instructors } from "@/lib/data/instructors";
import { testimonials } from "@/lib/data/testimonials";

const fullCurriculumModules = [
  "Introduction to Healthcare Data & AI",
  "Basics of Healthcare Analytics",
  "Excel / Google Sheets for Healthcare Data",
  "Dashboard & Reporting for Healthcare",
  "Healthcare KPI Analysis",
  "AI Tools for Healthcare Professionals",
  "Patient Data Analysis",
  "Disease Trend Analysis",
  "Predictive Insights Using No-Code Tools",
  "Data Visualization in Healthcare",
  "AI for Decision Making",
  "Healthcare Automation Tools",
  "Case Studies in Healthcare Analytics",
  "Ethical Use of Healthcare Data",
  "Mini Project / Practical Application",
  "Final Assessment & Certificate",
];

const audienceGroups = [
  "Doctors",
  "Nurses",
  "Healthcare Administrators",
  "Public Health Students",
  "Medical Professionals",
  "Healthcare Management Professionals",
];

const courseObjectives = [
  "Understand healthcare data and its importance",
  "Analyze healthcare-related data using no-code tools",
  "Create reports and dashboards",
  "Use AI tools in healthcare decision-making",
  "Interpret patient and healthcare trends",
  "Apply AI for healthcare insights and efficiency",
];

const keyModules = [
  {
    icon: Database,
    num: "01",
    title: "Foundations of Health Data",
    points: [
      "EHR, claims & registry data",
      "Data quality & structure",
      "Reading health metrics",
    ],
  },
  {
    icon: Brain,
    num: "02",
    title: "Intro to AI in Medicine",
    points: [
      "What AI can & can't do",
      "ML, deep learning, GenAI",
      "Clinical use-case mapping",
    ],
  },
  {
    icon: BarChart2,
    num: "03",
    title: "No-Code Analytics & BI",
    points: [
      "Spreadsheet analytics",
      "Dashboards (Power BI / Looker Studio)",
      "KPIs that matter",
    ],
  },
  {
    icon: HeartPulse,
    num: "04",
    title: "Clinical Decision Support",
    points: [
      "Risk scoring basics",
      "Diagnostic AI tools",
      "Workflow integration",
    ],
  },
  {
    icon: Users,
    num: "05",
    title: "Public Health Analytics",
    points: [
      "Disease surveillance",
      "Outbreak signals",
      "Population dashboards",
    ],
  },
  {
    icon: Shield,
    num: "06",
    title: "Ethics, Privacy & Governance",
    points: ["Patient privacy", "Bias & fairness", "Responsible AI use"],
  },
  {
    icon: Sparkles,
    num: "07",
    title: "Guided GenAI Tools",
    points: [
      "Prompting for clinicians",
      "Summarising notes safely",
      "Literature triage",
    ],
  },
  {
    icon: ClipboardList,
    num: "08",
    title: "Capstone Mini-Project",
    points: [
      "Pick a real workflow",
      "Build a no-code solution",
      "Present & assess",
    ],
  },
];

const instructorMeta: Record<
  string,
  { badge: string; statIcon: ElementType; stat: string }
> = {
  "instr-gias": {
    badge: "Chief Trainer",
    statIcon: GraduationCap,
    stat: "30+ Years Experience",
  },
  "instr-ahmed": {
    badge: "Co-Instructor",
    statIcon: BookOpen,
    stat: "118+ Publications",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto -mt-4 max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <StatsStrip />
        </FadeIn>
      </section>

      {/* Course Showcase */}
      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left: course info */}
            <FadeIn>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-500" />
                Now Enrolling
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold leading-snug text-neutral-900 sm:text-4xl">
                AI &amp; Data Analytics for{" "}
                <span className="text-primary-600">
                  Healthcare Professionals
                </span>
              </h2>
              <p className="mt-1 text-base font-medium text-neutral-400">
                No Coding Required
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Calendar, label: "Duration", value: "2 Months" },
                  { icon: MonitorPlay, label: "Classes", value: "16 Live" },
                  { icon: Clock, label: "Per Class", value: "2 Hours" },
                  { icon: Tag, label: "Fee", value: "BDT 8,000" },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white px-3 py-4 text-center shadow-sm"
                  >
                    <Icon className="h-5 w-5 text-primary-600" />
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-neutral-900">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { icon: CheckCircle, label: "No Coding Required" },
                  { icon: MonitorPlay, label: "Live Online Classes" },
                  { icon: Award, label: "Certificate" },
                  { icon: Brain, label: "AI Tools Training" },
                  { icon: Users, label: "25–30 Students" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary-500" />
                    {label}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-neutral-500">
                A practical, no-code course designed for healthcare
                professionals who want to harness the power of AI and data
                analytics — without writing a single line of code.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href="/course" size="lg">
                  View Full Course
                  <ArrowRight className="h-4 w-4" />
                </LinkButton>
                <LinkButton href="/course#enroll" variant="outline" size="lg">
                  Enroll Now
                </LinkButton>
              </div>
            </FadeIn>

            {/* Right: thumbnail */}
            <FadeIn delay={0.1} className="relative mx-auto w-full max-w-lg">
              <div className="overflow-hidden rounded-3xl shadow-2xl shadow-primary-900/15">
                <Image
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop"
                  alt="AI & Data Analytics for Healthcare Professionals"
                  width={600}
                  height={420}
                  className="h-72 w-full object-cover sm:h-96"
                />
              </div>
              {/* Floating batch card */}
              <div className="absolute -left-4 -top-4 rounded-2xl bg-white px-4 py-3 shadow-xl">
                <p className="text-xs font-medium text-neutral-400">
                  Next Batch
                </p>
                <p className="text-sm font-bold text-neutral-900">
                  Starting Soon
                </p>
              </div>
              {/* Floating seats card */}
              <div className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-2xl bg-primary-700 px-4 py-3 shadow-xl">
                <Users className="h-4 w-4 text-primary-200" />
                <div>
                  <p className="text-xs font-medium text-primary-200">
                    Limited Seats
                  </p>
                  <p className="text-sm font-bold text-white">25–30 Students</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Full Curriculum */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Full Curriculum
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            All 16 modules across 8 weeks
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-500">
            A complete walk-through of the proposed curriculum — from healthcare
            data fundamentals to your final assessment and certificate.
          </p>
        </FadeIn>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fullCurriculumModules.map((title, i) => (
            <FadeIn key={i} delay={i * 0.03}>
              <Card className="flex items-center gap-4 px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-neutral-800">
                  {title}
                </span>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Who is this for / Course Objectives */}
      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
                Who is this for
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
                Designed for healthcare practitioners
              </h2>
              <p className="mt-4 text-neutral-500">
                Whether you treat patients, manage a department, or shape public
                health policy — this course meets you where you are.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {audienceGroups.map((group) => (
                  <div
                    key={group}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white px-4 py-3 shadow-sm"
                  >
                    <User className="h-4 w-4 shrink-0 text-primary-600" />
                    <span className="text-sm font-medium text-neutral-700">
                      {group}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card className="h-full p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
                  Course Objectives
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-neutral-900">
                  What you will learn
                </h3>
                <ul className="mt-6 space-y-4">
                  {courseObjectives.map((obj) => (
                    <li key={obj} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                      <span className="text-sm text-neutral-700">{obj}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Key modules & learning outcomes */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Curriculum
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            Key modules &amp; learning outcomes
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-500">
            Eight focused modules build from health-data fundamentals to a
            capstone mini-project, with hands-on exercises throughout.
          </p>
        </FadeIn>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {keyModules.map((mod, i) => (
            <FadeIn key={mod.num} delay={i * 0.05}>
              <Card className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-700">
                    <mod.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-neutral-300">
                    {mod.num}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-neutral-900">
                  {mod.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {mod.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                      <span className="text-xs text-neutral-500">{pt}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
              Why learn with DataSkills
            </h2>
            <p className="mt-3 text-neutral-500">
              Everything is designed around one outcome: getting you hired.
            </p>
          </FadeIn>
          <div className="mt-12">
            <BenefitsGrid />
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section id="instructors" className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
              Meet Your Trainers
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
              World-class expertise, built for healthcare
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-neutral-500">
              Your course is led by two of the region&rsquo;s foremost
              authorities in healthcare data, AI, and public health research.
            </p>
          </FadeIn>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {instructors.map((instructor, i) => {
              const meta = instructorMeta[instructor.id];
              const StatIcon = meta.statIcon;
              return (
                <FadeIn key={instructor.id} delay={i * 0.1}>
                  <Card className="flex flex-col gap-0 overflow-hidden">
                    {/* Top gradient band */}
                    <div className="h-2 w-full bg-linear-to-r from-primary-600 to-primary-400" />

                    <div className="flex flex-col items-center gap-5 px-8 pb-8 pt-10 text-center sm:flex-row sm:items-start sm:text-left">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="h-28 w-28 overflow-hidden rounded-full ring-4 ring-primary-100 ring-offset-2">
                          <Image
                            src={instructor.avatar}
                            alt={instructor.name}
                            width={112}
                            height={112}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {/* Role badge pinned to bottom of avatar */}
                        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold text-white shadow">
                          {meta.badge}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="mt-4 flex-1 sm:mt-0">
                        <h3 className="font-display text-xl font-bold text-neutral-900">
                          {instructor.name}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-primary-600">
                          {instructor.role}
                        </p>

                        {/* Stat chip */}
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                          <StatIcon className="h-3.5 w-3.5" />
                          {meta.stat}
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                          {instructor.bio}
                        </p>

                        {instructor.socials.linkedin && (
                          <a
                            href={instructor.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-800"
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            LinkedIn Profile
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            Loved by learners worldwide
          </h2>
          <p className="mt-3 text-neutral-500">
            Real stories from people who changed their careers with us.
          </p>
        </FadeIn>
        <div className="mt-12">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <FadeIn className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary-700 via-primary-600 to-accent-500 px-8 py-16 text-center sm:px-16">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Your healthcare career, powered by data
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-100">
            Join the next cohort of healthcare professionals learning AI &amp;
            analytics. No coding. No prior experience. Just results.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <LinkButton href="/course#enroll" variant="secondary" size="lg">
              Enroll Now — BDT 8,000
            </LinkButton>
            <LinkButton
              href="/course"
              variant="outline"
              size="lg"
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary-700"
            >
              View Full Course
            </LinkButton>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
