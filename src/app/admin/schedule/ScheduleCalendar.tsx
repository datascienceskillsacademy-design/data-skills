"use client";

import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, DateSelectArg } from "@fullcalendar/core";
import { X, Trash2, Video, Loader2, CalendarPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  dhakaLocalToISOString,
  isoToDhakaLocalParts,
  toDhakaNaiveLocalString,
  formatClassDate,
  formatClassTimeRange,
} from "@/lib/scheduleTime";
import type { ClassSchedule, Course } from "@/generated/prisma/client";

type ClassScheduleWithCourse = ClassSchedule & {
  course: Pick<Course, "id" | "title" | "slug">;
};

const COLOR_PALETTE = [
  "#4f46e5",
  "#0891b2",
  "#d97706",
  "#dc2626",
  "#16a34a",
  "#9333ea",
  "#0284c7",
  "#db2777",
];

function colorForCourse(courseId: string, courses: { id: string }[]) {
  const idx = courses.findIndex((c) => c.id === courseId);
  return COLOR_PALETTE[idx % COLOR_PALETTE.length] ?? COLOR_PALETTE[0];
}

interface ScheduleCalendarProps {
  courses: { id: string; title: string }[];
  initialClasses: ClassScheduleWithCourse[];
}

interface FormState {
  id: string | null;
  courseId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string;
  notes: string;
}

function emptyForm(courseId: string, date: string): FormState {
  return {
    id: null,
    courseId,
    title: "",
    date,
    startTime: "19:00",
    endTime: "21:00",
    meetLink: "",
    notes: "",
  };
}

export function ScheduleCalendar({ courses, initialClasses }: ScheduleCalendarProps) {
  const [classes, setClasses] = useState(initialClasses);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const events = useMemo(
    () =>
      classes.map((c) => ({
        id: c.id,
        title: `${c.course.title}: ${c.title}`,
        // Pre-shifted to Dhaka wall-clock time and fed as a naive (no 'Z'/offset)
        // string — FullCalendar's default 'local' mode displays these verbatim,
        // so every admin sees the same Bangladesh-local time regardless of their
        // own browser timezone. See toDhakaNaiveLocalString for why.
        start: toDhakaNaiveLocalString(c.startsAt),
        end: toDhakaNaiveLocalString(c.endsAt),
        backgroundColor: colorForCourse(c.courseId, courses),
        borderColor: colorForCourse(c.courseId, courses),
      })),
    [classes, courses]
  );

  const upcoming = useMemo(() => {
    const now = new Date();
    return classes
      .filter((c) => new Date(c.startsAt) >= now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .slice(0, 8);
  }, [classes]);

  function openCreate(dateStr: string) {
    setError("");
    setForm(emptyForm(courses[0]?.id ?? "", dateStr));
  }

  function openEdit(classItem: ClassScheduleWithCourse) {
    setError("");
    const { dateStr, timeStr: startTime } = isoToDhakaLocalParts(classItem.startsAt);
    const { timeStr: endTime } = isoToDhakaLocalParts(classItem.endsAt);
    setForm({
      id: classItem.id,
      courseId: classItem.courseId,
      title: classItem.title,
      date: dateStr,
      startTime,
      endTime,
      meetLink: classItem.meetLink ?? "",
      notes: classItem.notes ?? "",
    });
  }

  function handleSelect(info: DateSelectArg) {
    openCreate(info.startStr.slice(0, 10));
  }

  function handleEventClick(info: EventClickArg) {
    const classItem = classes.find((c) => c.id === info.event.id);
    if (classItem) openEdit(classItem);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError("");

    if (!form.courseId || !form.title.trim() || !form.date || !form.startTime || !form.endTime) {
      setError("Please fill in course, title, date, and start/end time.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        courseId: form.courseId,
        title: form.title.trim(),
        startsAt: dhakaLocalToISOString(form.date, form.startTime),
        endsAt: dhakaLocalToISOString(form.date, form.endTime),
        meetLink: form.meetLink.trim() || undefined,
        notes: form.notes.trim() || undefined,
      };

      const url = form.id ? `/api/admin/schedule/${form.id}` : "/api/admin/schedule";
      const method = form.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save class.");
        return;
      }

      setClasses((prev) =>
        form.id ? prev.map((c) => (c.id === data.id ? data : c)) : [...prev, data]
      );
      setForm(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!form?.id) return;
    if (!confirm("Delete this class?")) return;
    setSaving(true);
    const res = await fetch(`/api/admin/schedule/${form.id}`, { method: "DELETE" });
    if (res.ok) {
      setClasses((prev) => prev.filter((c) => c.id !== form.id));
      setForm(null);
    }
    setSaving(false);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
      <Card className="overflow-hidden p-4 sm:p-6">
        {courses.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5">
            {courses.map((course) => (
              <span
                key={course.id}
                className="flex items-center gap-1.5 text-xs font-medium text-neutral-600"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: colorForCourse(course.id, courses) }}
                />
                {course.title}
              </span>
            ))}
          </div>
        )}

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,listMonth",
          }}
          height="auto"
          selectable
          select={handleSelect}
          eventClick={handleEventClick}
          events={events}
          dayMaxEvents={3}
          eventTimeFormat={{ hour: "numeric", minute: "2-digit", meridiem: "short" }}
        />
      </Card>

      {/* Upcoming list sidebar */}
      <Card className="h-fit p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
            Upcoming
          </h2>
          <button
            type="button"
            onClick={() => openCreate(new Date().toISOString().slice(0, 10))}
            className="flex items-center gap-1.5 rounded-full bg-primary-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-800"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            New
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {upcoming.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => openEdit(c)}
              className="block w-full rounded-xl border border-neutral-100 p-3 text-left transition hover:border-neutral-200 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: colorForCourse(c.courseId, courses) }}
                />
                <p className="truncate text-xs font-semibold text-primary-700">
                  {c.course.title}
                </p>
              </div>
              <p className="mt-1 text-sm font-medium text-neutral-900">{c.title}</p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {formatClassDate(c.startsAt)} · {formatClassTimeRange(c.startsAt, c.endsAt)}
              </p>
            </button>
          ))}
          {upcoming.length === 0 && (
            <p className="text-sm text-neutral-400">No upcoming classes scheduled.</p>
          )}
        </div>
      </Card>

      {/* Create / Edit modal */}
      {form && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && setForm(null)}
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <form onSubmit={handleSubmit}>
              <div className="sticky top-0 flex items-center justify-between border-b border-neutral-100 bg-white px-6 py-5">
                <h2 className="font-display text-lg font-bold text-neutral-900">
                  {form.id ? "Edit Class" : "New Class"}
                </h2>
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 px-6 py-5">
                {error && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                    {error}
                  </p>
                )}

                {courses.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
                    Create a course first before scheduling classes.
                  </p>
                ) : (
                  <>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        Course
                      </label>
                      <select
                        value={form.courseId}
                        onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      >
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        Class Title
                      </label>
                      <input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. Module 3: Dashboard & Reporting"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        Date
                      </label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          Start Time (BDT)
                        </label>
                        <input
                          type="time"
                          value={form.startTime}
                          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                          className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          End Time (BDT)
                        </label>
                        <input
                          type="time"
                          value={form.endTime}
                          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                          className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-neutral-700">
                        <Video className="h-3.5 w-3.5" />
                        Google Meet Link
                      </label>
                      <input
                        value={form.meetLink}
                        onChange={(e) => setForm({ ...form, meetLink: e.target.value })}
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        Notes <span className="font-normal text-neutral-400">(optional)</span>
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={2}
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="sticky bottom-0 flex items-center justify-between border-t border-neutral-100 bg-white px-6 py-4">
                {form.id ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(null)}
                    className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  {courses.length > 0 && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60"
                    >
                      {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                      {form.id ? "Save Changes" : "Create Class"}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
