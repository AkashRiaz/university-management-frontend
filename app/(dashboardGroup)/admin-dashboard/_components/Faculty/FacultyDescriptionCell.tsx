"use client";

import { useState } from "react";

type FacultyDescriptionCellProps = {
  description?: string;
  limit?: number;
};

const FacultyDescriptionCell = ({
  description,
  limit = 50,
}: FacultyDescriptionCellProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const value = description?.trim() || "No description";
  const canExpand = value.length > limit;
  const visibleValue =
    !canExpand || isExpanded ? value : `${value.slice(0, limit).trimEnd()}...`;

  return (
    <div className="max-w-[280px] whitespace-normal break-words text-[13px] text-muted-foreground">
      <span>{visibleValue}</span>
      {canExpand && (
        <button
          type="button"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="ml-1 font-medium text-primary hover:underline"
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default FacultyDescriptionCell;
