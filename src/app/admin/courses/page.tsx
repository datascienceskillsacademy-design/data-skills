export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Plus } from "lucide-react";
import { CourseRowActions } from "./CourseRowActions";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Courses</h1>
          <p className="mt-1 text-neutral-500">Manage all courses.</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 rounded-full bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
        >
          <Plus className="h-4 w-4" />
          New Course
        </Link>
      </div>

      <Card className="mt-8 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Title</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Price</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Enrollments</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Status</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                <td className="px-5 py-3">
                  <div className="font-medium text-neutral-900">{course.title}</div>
                  <div className="text-xs text-neutral-400">{course.slug}</div>
                </td>
                <td className="px-5 py-3 text-neutral-700">
                  BDT {course.price.toLocaleString()}
                </td>
                <td className="px-5 py-3 text-neutral-700">
                  {course._count.enrollments}
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${course.isPublished ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"}`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <CourseRowActions course={course} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
