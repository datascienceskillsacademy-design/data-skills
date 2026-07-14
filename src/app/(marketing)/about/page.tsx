import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Telescope,
  BookOpenCheck,
  FolderGit2,
  Users,
  Briefcase,
  Building2,
  GraduationCap,
  MessagesSquare,
  Presentation,
  Lightbulb,
  Wrench,
  ShieldCheck,
  Handshake,
  Award,
  Infinity as InfinityIcon,
  ArrowRight,
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About Us — Data Science Skills Academy",
  description:
    "Building the next generation of data, AI, and analytics professionals through practical, project-based, and career-focused learning.",
};

const differentiators = [
  {
    icon: BookOpenCheck,
    title: "Industry-Designed Curriculum",
    description:
      "Programs built with industry experts, aligned with the latest tools and workforce demands.",
  },
  {
    icon: Presentation,
    title: "Live Projects & Case Studies",
    description:
      "Learn by solving real-world business problems, not just watching lectures.",
  },
  {
    icon: Users,
    title: "Expert Mentors",
    description:
      "Guidance from professionals working at leading organizations across the industry.",
  },
  {
    icon: Briefcase,
    title: "Career Guidance & Interview Prep",
    description:
      "Structured support to get you job-ready — from CV reviews to mock interviews.",
  },
  {
    icon: FolderGit2,
    title: "Portfolio Development",
    description:
      "Graduate with a portfolio that demonstrates practical, employer-ready skills.",
  },
  {
    icon: Building2,
    title: "Corporate Training Solutions",
    description:
      "Tailored upskilling programs for teams and organizations of every size.",
  },
  {
    icon: GraduationCap,
    title: "University Collaboration",
    description:
      "Partnerships with universities to bridge academic knowledge and industry expectations.",
  },
  {
    icon: MessagesSquare,
    title: "Continuous Learning Community",
    description:
      "A thriving network of data professionals who learn, share, and grow together.",
  },
];

const coreValues = [
  { icon: Lightbulb, label: "Innovation" },
  { icon: Wrench, label: "Practical Learning" },
  { icon: ShieldCheck, label: "Integrity" },
  { icon: Handshake, label: "Collaboration" },
  { icon: Award, label: "Excellence" },
  { icon: InfinityIcon, label: "Lifelong Learning" },
];

export default function AboutPage() {
  return (
    <div className="bg-linear-to-b from-primary-50 via-white to-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-20 lg:px-8">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            About Us
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
            About Data Science Skills Academy
          </h1>
          <p className="mt-4 text-lg font-medium text-primary-700">
            Building the Next Generation of Data, AI, and Analytics
            Professionals
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mx-auto mt-10 max-w-3xl space-y-5 text-base leading-relaxed text-neutral-600">
          <p>
            At Data Science Skills Academy, we believe that data is the
            foundation of tomorrow&apos;s economy. Our mission is to empower
            students, professionals, entrepreneurs, and organizations with
            practical, industry-relevant skills in Data Science, Artificial
            Intelligence, Machine Learning, Business Analytics, Data
            Engineering, and Emerging Technologies.
          </p>
          <p>
            Unlike traditional learning platforms, we focus on hands-on
            experience, real-world business problems, live projects, industry
            mentorship, and career readiness. Our programs are designed to
            bridge the gap between academic knowledge and industry
            expectations, enabling learners to build portfolios that
            demonstrate practical skills.
          </p>
          <p>
            We work closely with industry experts, universities, and corporate
            partners to ensure our curriculum remains aligned with the latest
            technologies, tools, and workforce demands. Whether you are
            starting your data journey or advancing your professional career,
            our structured learning paths are designed to help you achieve
            measurable growth.
          </p>
          <p>
            Our vision extends beyond technical training. We aim to build a
            thriving community of data professionals who can drive innovation,
            solve complex business challenges, and create meaningful impact
            through data-driven decision-making.
          </p>
        </FadeIn>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FadeIn>
            <Card className="h-full overflow-hidden">
              <div className="h-2 w-full bg-linear-to-r from-primary-600 to-primary-400" />
              <div className="p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <Target className="h-6 w-6" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold text-neutral-900">
                  Our Mission
                </h2>
                <p className="mt-3 leading-relaxed text-neutral-600">
                  To make world-class data science and AI education accessible
                  through practical, project-based, and career-focused
                  learning.
                </p>
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card className="h-full overflow-hidden">
              <div className="h-2 w-full bg-linear-to-r from-accent-500 to-accent-300" />
              <div className="p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
                  <Telescope className="h-6 w-6" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold text-neutral-900">
                  Our Vision
                </h2>
                <p className="mt-3 leading-relaxed text-neutral-600">
                  To become one of Asia&apos;s leading data and AI learning
                  ecosystems, producing globally competitive professionals who
                  shape the future through innovation and technology.
                </p>
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-neutral-50/60">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
              Why Choose Us
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
              What Makes Us Different
            </h2>
          </FadeIn>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.05}>
                <Card className="h-full p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {item.description}
                  </p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            What We Stand For
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            Our Core Values
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {coreValues.map((value, i) => (
            <FadeIn key={value.label} delay={i * 0.05}>
              <Card className="flex h-full flex-col items-center gap-3 p-6 text-center">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <value.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-neutral-800">
                  {value.label}
                </span>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Join Our Community CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <FadeIn>
          <div className="overflow-hidden rounded-3xl bg-linear-to-br from-primary-700 via-primary-800 to-primary-950 px-8 py-16 text-center sm:px-16">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Join Our Community
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-primary-100">
              Whether you are a student, fresh graduate, working professional,
              researcher, or business leader, Data Science Skills Academy is
              your trusted partner in building future-ready skills for the
              data-driven world.
            </p>
            <p className="mt-6 font-display text-lg font-semibold tracking-wide text-accent-300">
              Learn. Build. Innovate. Lead.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
