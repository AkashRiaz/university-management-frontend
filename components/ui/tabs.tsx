import Link from "next/link";
import { cn } from "@/lib/utils";

export function Tabs({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function TabsList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  active = false,
  className,
  ...props
}: React.ComponentProps<typeof Link> & { active?: boolean }) {
  return (
    <Link
      role="tab"
      aria-selected={active}
      data-state={active ? "active" : "inactive"}
      className={cn(
        "inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-all",
        "hover:bg-background/60 hover:text-foreground",
        active && "bg-background text-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
