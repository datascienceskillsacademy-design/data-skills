import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/marketing/Hero";
import { StatsStrip } from "@/components/marketing/StatsStrip";
import { CategoryTiles } from "@/components/marketing/CategoryTiles";
import { CourseCard } from "@/components/marketing/CourseCard";
import { BenefitsGrid } from "@/components/marketing/BenefitsGrid";
import { FounderSpotlight } from "@/components/marketing/FounderSpotlight";
import { InstructorCard } from "@/components/marketing/InstructorCard";
import { TestimonialCarousel } from "@/components/marketing/TestimonialCarousel";
import { FadeIn } from "@/components/motion/FadeIn";
import { LinkButton } from "@/components/ui/Button";
import { courses } from "@/lib/data/courses";
import { instructors } from "@/lib/data/instructors";
import { testimonials } from "@/lib/data/testimonials";

export default function HomePage() {
  const founder = instructors.find((i) => i.isFounder)!;
  const teamInstructors = instructors.filter((i) => !i.isFounder);

  return (
    <>
      <Hero />

      <section className="mx-auto -mt-4 max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <StatsStrip />
        </FadeIn>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            What do you want to learn?
          </h2>
          <p className="mt-3 text-neutral-500">
            Pick a track and start building real skills today.
          </p>
        </FadeIn>
        <div className="mt-12">
          <CategoryTiles />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <FadeIn className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
              Featured courses
            </h2>
            <p className="mt-3 text-neutral-500">
              Hand-picked, project-based courses to get you job-ready.
            </p>
          </div>
          <LinkButton href="/courses" variant="outline">
            View all courses
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <FadeIn key={course.id} delay={i * 0.06}>
              <CourseCard
                course={course}
                instructor={instructors.find((ins) => ins.id === course.instructorId)}
              />
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

      <section id="founder" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <FounderSpotlight founder={founder} />
      </section>

      <section id="instructors" className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
              Learn from people who&rsquo;ve done the work
            </h2>
            <p className="mt-3 text-neutral-500">
              Our instructors are practitioners first, teachers second.
            </p>
          </FadeIn>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamInstructors.map((instructor, i) => (
              <FadeIn key={instructor.id} delay={i * 0.08}>
                <InstructorCard instructor={instructor} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
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
        <FadeIn className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-700 via-primary-600 to-accent-500 px-8 py-16 text-center sm:px-16">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Your data science career starts today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-100">
            Join thousands of learners building real skills with real
            projects. No experience required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <LinkButton href="/courses" variant="secondary" size="lg">
              Browse Courses
            </LinkButton>
            <LinkButton
              href="/login"
              variant="outline"
              size="lg"
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary-700"
            >
              Student Login
            </LinkButton>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
