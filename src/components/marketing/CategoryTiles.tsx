import { BarChart3, Brain, Code2, LineChart, Network, Sigma } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";
import type { CourseCategory } from "@/lib/types";

const categories: { name: CourseCategory; icon: typeof Code2; desc: string }[] = [
  { name: "Python", icon: Code2, desc: "Programming fundamentals" },
  { name: "Machine Learning", icon: Brain, desc: "Predictive modeling" },
  { name: "Data Visualization", icon: LineChart, desc: "Tell stories with data" },
  { name: "Deep Learning", icon: Network, desc: "Neural networks & AI" },
  { name: "Statistics", icon: Sigma, desc: "Rigorous foundations" },
  { name: "Data Analysis", icon: BarChart3, desc: "SQL & business insight" },
];

export function CategoryTiles() {
  return (
    <StaggerList className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <StaggerItem key={cat.name}>
            <Card className="flex h-full flex-col items-center gap-3 px-4 py-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-neutral-800">{cat.name}</p>
              <p className="text-xs text-neutral-500">{cat.desc}</p>
            </Card>
          </StaggerItem>
        );
      })}
    </StaggerList>
  );
}
