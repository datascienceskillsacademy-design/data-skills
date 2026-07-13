export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Plus, User } from "lucide-react";
import { InstructorRowActions } from "./InstructorRowActions";

export default async function AdminInstructorsPage() {
  const instructors = await prisma.instructor.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Instructors</h1>
          <p className="mt-1 text-neutral-500">Manage instructor profiles.</p>
        </div>
        <Link
          href="/admin/instructors/new"
          className="flex items-center gap-2 rounded-full bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
        >
          <Plus className="h-4 w-4" />
          New Instructor
        </Link>
      </div>

      <Card className="mt-8 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Instructor</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Role</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Status</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                      {instructor.avatar ? (
                        <Image
                          src={instructor.avatar}
                          alt={instructor.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-300">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="font-medium text-neutral-900">{instructor.name}</div>
                  </div>
                </td>
                <td className="px-5 py-3 text-neutral-700">{instructor.role}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        instructor.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {instructor.isPublished ? "Visible" : "Hidden"}
                    </span>
                    {instructor.isFeatured && (
                      <span className="inline-flex rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-700">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <InstructorRowActions instructor={instructor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {instructors.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-neutral-400">
            No instructors yet.
          </p>
        )}
      </Card>
    </div>
  );
}
