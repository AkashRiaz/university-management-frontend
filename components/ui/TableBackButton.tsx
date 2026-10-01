"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const TableBackButton = () => {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={() => router.back()}
      aria-label="Go back"
      title="Go back"
      className="mr-2 inline-flex align-middle"
    >
      <ArrowLeft />
    </Button>
  );
};

export default TableBackButton;
