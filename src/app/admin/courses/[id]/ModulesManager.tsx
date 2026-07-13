"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Circle, ChevronUp, ChevronDown, Trash2, Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CourseModule } from "@/generated/prisma/client";

interface ModulesManagerProps {
  courseId: string;
  modules: CourseModule[];
}

export function ModulesManager({ courseId, modules }: ModulesManagerProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function addModule(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setError("");
    setAdding(true);

    const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim() }),
    });

    if (res.ok) {
      setTitle("");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to add module.");
    }
    setAdding(false);
  }

  async function toggleCompleted(mod: CourseModule) {
    setBusyId(mod.id);
    const res = await fetch(`/api/admin/courses/${courseId}/modules/${mod.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !mod.isCompleted }),
    });
    if (res.ok) router.refresh();
    setBusyId(null);
  }

  async function deleteModule(mod: CourseModule) {
    if (!confirm(`Delete module "${mod.title}"?`)) return;
    setBusyId(mod.id);
    const res = await fetch(`/api/admin/courses/${courseId}/modules/${mod.id}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
    setBusyId(null);
  }

  async function move(mod: CourseModule, direction: "up" | "down") {
    const sorted = [...modules].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((m) => m.id === mod.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    const swapWith = sorted[swapIndex];

    setBusyId(mod.id);
    await Promise.all([
      fetch(`/api/admin/courses/${courseId}/modules/${mod.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: swapWith.order }),
      }),
      fetch(`/api/admin/courses/${courseId}/modules/${swapWith.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: mod.order }),
      }),
    ]);
    router.refresh();
    setBusyId(null);
  }

  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Modules
        </h2>
        <span className="text-xs text-neutral-400">
          {modules.filter((m) => m.isCompleted).length}/{modules.length} completed
        </span>
      </div>

      <div className="mt-4 space-y-1.5">
        {sortedModules.map((mod, i) => {
          const busy = busyId === mod.id;
          return (
            <div
              key={mod.id}
              className="flex items-center gap-2 rounded-xl border border-neutral-100 px-3 py-2.5"
            >
              <button
                type="button"
                onClick={() => toggleCompleted(mod)}
                disabled={busy}
                title={mod.isCompleted ? "Mark as not completed" : "Mark as completed"}
                className="shrink-0 disabled:opacity-50"
              >
                {mod.isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-neutral-300" />
                )}
              </button>

              <span className="w-6 shrink-0 text-sm text-neutral-400">
                {String(mod.order).padStart(2, "0")}
              </span>

              <span
                className={`flex-1 text-sm font-medium ${
                  mod.isCompleted ? "text-neutral-900" : "text-neutral-600"
                }`}
              >
                {mod.title}
              </span>

              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => move(mod, "up")}
                  disabled={busy || i === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(mod, "down")}
                  disabled={busy || i === sortedModules.length - 1}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteModule(mod)}
                  disabled={busy}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                  aria-label="Delete module"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {modules.length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-200 px-3 py-6 text-center text-sm text-neutral-400">
            No modules yet. Add the first one below.
          </p>
        )}
      </div>

      <form onSubmit={addModule} className="mt-4 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New module title"
          className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
        <button
          type="submit"
          disabled={adding || !title.trim()}
          className="flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </Card>
  );
}
