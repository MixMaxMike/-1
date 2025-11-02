import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PipelineCardProps {
  title: string;
  icon: LucideIcon;
  status: "idle" | "running" | "success" | "error";
  progress?: number;
  itemsProcessed?: number;
  totalItems?: number;
  lastRun?: string;
  className?: string;
}

export function PipelineCard({
  title,
  icon: Icon,
  status,
  progress,
  itemsProcessed,
  totalItems,
  lastRun,
  className,
}: PipelineCardProps) {
  const statusConfig = {
    idle: { color: "bg-muted", text: "Ожидание", textColor: "text-muted-foreground" },
    running: { color: "bg-primary", text: "Выполняется", textColor: "text-primary" },
    success: { color: "bg-success", text: "Завершено", textColor: "text-success" },
    error: { color: "bg-destructive", text: "Ошибка", textColor: "text-destructive" },
  };

  const config = statusConfig[status];

  return (
    <Card
      className={cn(
        "p-6 gradient-card shadow-card border-border/50 transition-smooth hover:shadow-glow hover:scale-[1.02]",
        status === "running" && "animate-pulse-glow",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-3 rounded-lg", status === "running" ? "gradient-primary" : "bg-muted")}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{lastRun}</p>
          </div>
        </div>
        <Badge variant="secondary" className={cn("text-xs", config.textColor)}>
          <div className={cn("w-2 h-2 rounded-full mr-2", config.color)} />
          {config.text}
        </Badge>
      </div>

      {progress !== undefined && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          {itemsProcessed !== undefined && totalItems !== undefined && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {itemsProcessed} / {totalItems} элементов
              </span>
              <span>{progress}%</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
