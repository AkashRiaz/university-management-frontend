"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const debounceReference = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSearchTerm = searchParams.get("searchTerm") || "";

  useEffect(() => {
    return () => {
      if (debounceReference.current) {
        clearTimeout(debounceReference.current);
      }
    };
  }, []);

  const updateURL = (params: URLSearchParams) => {
    const queryString = params.toString();

    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleChange = (value: string) => {
    if (debounceReference.current) {
      clearTimeout(debounceReference.current);
    }

    debounceReference.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      const trimmedValue = value.trim();

      if (trimmedValue) {
        params.set("searchTerm", trimmedValue);
      } else {
        params.delete("searchTerm");
      }

      params.set("page", "1");

      updateURL(params);
    }, 500);
  };

  const clearSearch = () => {
    if (debounceReference.current) {
      clearTimeout(debounceReference.current);
    }

    const params = new URLSearchParams(searchParams.toString());

    params.delete("searchTerm");
    params.set("page", "1");

    updateURL(params);
  };

  return (
    <div
      className={
        compact
          ? "relative min-w-0 flex-1 sm:w-52 sm:flex-none"
          : "relative w-full lg:max-w-md"
      }
    >
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        key={currentSearchTerm}
        defaultValue={currentSearchTerm}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Search here..."
        className={compact ? "h-8 pl-9 pr-10" : "pl-9 pr-10"}
      />

      {currentSearchTerm && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear service search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
