import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import {
  CheckCircle,
  Clock,
  Calendar,
  MonitorPlay,
  Tag,
  Users,
  Award,
  Brain,
  Wifi,
  BookOpen,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import type { ElementType } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { instructors } from "@/lib/data/instructors";
import Link from "next/link";

const instructorMeta: Record<
  string,
  { badge: string; statIcon: ElementType; stat: string }
> = {
  "instr-gias": {
    badge: "Chief Trainer",
    statIcon: BookOpen,
    stat: "30+ Years Experience",
  },
  "instr-ahmed": {
    badge: "Co-Instructor",
    statIcon: BookOpen,
    stat: "118+ Publications",
  },
};

const features: { icon: ElementType; title: string; desc: string }[] = [
  {
    icon: MonitorPlay,
    title: "Live Online Interactive Classes",
    desc: "Join live sessions from anywhere — ask questions in real time.",
  },
  {
    icon: Brain,
    title: "Hands-on AI Tools Training",
    desc: "Work with real AI tools used in healthcare settings today.",
  },
  {
    icon: ClipboardList,
    title: "Practical Case Studies",
    desc: "Learn through real-world healthcare data scenarios.",
  },
  {
    icon: Award,
    title: "Certificate of Completion",
    desc: "Earn a verifiable certificate recognised in the industry.",
  },
  {
    icon: BookOpen,
    title: "No Coding Required",
    desc: "Everything is done with no-code tools — accessible to all.",
  },
  {
    icon: Wifi,
    title: "Industry-Relevant Learning",
    desc: "Curriculum shaped around what healthcare employers actually need.",
  },
];

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) return { title: "Course not found" };
  return {
    title: `${course.title} — DataSkills`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug, isPublished: true },
    include: { modules: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();

  const placeholder =
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=900&auto=format&fit=crop";

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-900 via-primary-800 to-primary-700 py-20">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <FadeIn>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-400/40 bg-primary-800/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400" />
                Now Enrolling · Launch Offer
              </span>

              <h1 className="mt-5 font-display text-3xl font-bold leading-snug text-white sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="mt-2 text-lg font-medium text-primary-300">
                  {course.subtitle}
                </p>
              )}

              <p className="mt-4 max-w-lg text-base text-primary-200">
                {course.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4 text-sm">
                {[
                  { icon: Calendar, text: course.durationLabel },
                  { icon: MonitorPlay, text: `${course.classCount} Live Online Classes` },
                  { icon: Clock, text: `${course.classHours} Hours per Class` },
                  { icon: Users, text: `${course.batchSize} Students per Batch` },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-2 text-primary-200">
                    <Icon className="h-4 w-4 text-accent-400" />
                    {text}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#enroll"
                  className="inline-flex items-center gap-2 rounded-full bg-accent-400 px-7 py-3.5 text-base font-semibold text-neutral-950 transition-all hover:bg-accent-500 active:scale-[0.98]"
                >
                  Enroll Now — BDT {course.price.toLocaleString("en-BD")}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#curriculum"
                  className="inline-flex items-center gap-2 rounded-full border border-primary-400/50 px-7 py-3.5 text-base font-medium text-white transition-all hover:border-white active:scale-[0.98]"
                >
                  View Curriculum
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.12} className="relative mx-auto w-full max-w-md">
              <div className="overflow-hidden rounded-3xl ring-4 ring-white/10 shadow-2xl">
                <Image
                  src={course.thumbnail ?? placeholder}
                  alt={course.title}
                  width={560}
                  height={400}
                  className="h-72 w-full object-cover sm:h-80"
                />
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-max rounded-2xl bg-white px-6 py-4 shadow-2xl text-center">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Launch Price
                </p>
                <p className="font-display text-2xl font-bold text-primary-700">
                  BDT {course.price.toLocaleString("en-BD")}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Limited seats · Online Live
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Overview stats bar ── */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-between gap-6 py-6">
            {[
              { icon: Tag, label: "Course Fee", value: `BDT ${course.price.toLocaleString("en-BD")}` },
              { icon: Calendar, label: "Duration", value: course.durationLabel },
              { icon: MonitorPlay, label: "Total Classes", value: `${course.classCount} Live Classes` },
              { icon: Clock, label: "Class Duration", value: `${course.classHours} Hours / Class` },
              { icon: Users, label: "Batch Size", value: `${course.batchSize} Students` },
              { icon: Wifi, label: "Mode", value: "Online Live" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">{label}</p>
                  <p className="text-sm font-semibold text-neutral-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_340px]">
          {/* ── Main content ── */}
          <div className="space-y-20">
            {/* Curriculum */}
            <div id="curriculum">
              <FadeIn>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
                  Full Curriculum
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-neutral-900 sm:text-3xl">
                  All {course.modules.length} modules across{" "}
                  {Math.ceil(course.modules.length / 2)} weeks
                </h2>
                <p className="mt-3 text-neutral-500">
                  {course.classCount / (course.durationLabel.includes("2") ? 8 : 4)} classes per week ·{" "}
                  {course.classHours} hours each · Online Live
                </p>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {course.modules.map((mod) => (
                    <Card
                      key={mod.id}
                      className="flex items-center gap-4 px-5 py-4"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
                        {String(mod.order).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-medium text-neutral-800">
                        {mod.title}
                      </span>
                    </Card>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Features */}
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
                Course Features
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-neutral-900 sm:text-3xl">
                Everything you need to succeed
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {features.map(({ icon: Icon, title, desc }) => (
                  <Card key={title} className="flex flex-col gap-3 p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-700">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-neutral-900">
                      {title}
                    </h3>
                    <p className="text-sm text-neutral-500">{desc}</p>
                  </Card>
                ))}
              </div>
            </FadeIn>

            {/* Instructors */}
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
                Your Trainers
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-neutral-900 sm:text-3xl">
                World-class expertise
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {instructors.map((instructor) => {
                  const meta = instructorMeta[instructor.id];
                  if (!meta) return null;
                  const StatIcon = meta.statIcon;
                  return (
                    <Card key={instructor.id} className="flex gap-4 p-6">
                      <div className="relative shrink-0">
                        <div className="h-16 w-16 overflow-hidden rounded-full ring-4 ring-primary-100 ring-offset-1">
                          <Image
                            src={instructor.avatar}
                            alt={instructor.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <span className="inline-block rounded-full bg-primary-700 px-2.5 py-0.5 text-xs font-semibold text-white">
                          {meta.badge}
                        </span>
                        <h3 className="mt-1 font-display text-base font-bold text-neutral-900">
                          {instructor.name}
                        </h3>
                        <p className="text-xs font-medium text-primary-600">
                          {instructor.role}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                          <StatIcon className="h-3 w-3" />
                          {meta.stat}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </FadeIn>
          </div>

          {/* ── Sticky enroll sidebar ── */}
          <div className="lg:relative">
            <div id="enroll" className="sticky top-24">
              <Card className="overflow-hidden">
                <div className="bg-linear-to-br from-primary-700 to-primary-900 px-6 py-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary-300">
                    Launch Offer
                  </p>
                  <p className="mt-1 font-display text-4xl font-bold text-white">
                    BDT {course.price.toLocaleString("en-BD")}
                  </p>
                  <p className="mt-1 text-sm text-primary-300">
                    Per student · All inclusive
                  </p>
                </div>
                <div className="space-y-4 p-6">
                  <ul className="space-y-2.5">
                    {[
                      `${course.classCount} Live Online Classes`,
                      `${course.classHours} Hours per Session`,
                      "Hands-on AI Tools",
                      "Practical Case Studies",
                      "Certificate of Completion",
                      `Batch of ${course.batchSize} Students`,
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-neutral-700"
                      >
                        <CheckCircle className="h-4 w-4 shrink-0 text-primary-500" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/checkout/${course.id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary-700 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-800"
                  >
                    Enroll Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="text-center text-xs text-neutral-400">
                    Seats are limited to {course.batchSize} per batch
                  </p>
                </div>
              </Card>

              <Card className="mt-4 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Schedule
                </p>
                <div className="mt-3 space-y-2 text-sm text-neutral-700">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold">{course.durationLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Classes</span>
                    <span className="font-semibold">2× per week</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Per Class</span>
                    <span className="font-semibold">{course.classHours} Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format</span>
                    <span className="font-semibold">Online Live</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
