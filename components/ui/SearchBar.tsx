"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";

const SEARCH_DEBOUNCE_MS = 500;

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Mutable, render-free values: the pending debounce timer and the input node.
  const debounceReference = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputReference = useRef<HTMLInputElement | null>(null);

  const currentSearchTerm = searchParams.get("searchTerm") || "";

  useEffect(() => {
    return () => {
      if (debounceReference.current) {
        clearTimeout(debounceReference.current);
      }
    };
  }, []);

  // Keep the uncontrolled input in sync when the URL changes from outside
  // (back/forward, tab links). Before, the input used `key={searchTerm}`, which
  // re-mounted it after every debounced search and threw away the focus and
  // cursor while the user was still typing.
  useEffect(() => {
    const input = inputReference.current;
    if (input && document.activeElement !== input && input.value !== currentSearchTerm) {
      input.value = currentSearchTerm;
    }
  }, [currentSearchTerm]);

  const updateURL = (params: URLSearchParams) => {
    const queryString = params.toString();

    // Low-priority navigation: typing is never blocked by the server re-render.
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  };

  const handleChange = (value: string) => {
    if (debounceReference.current) {
      clearTimeout(debounceReference.current);
    }

    debounceReference.current = setTimeout(() => {
      const trimmedValue = value.trim();

      // Skip the server round-trip when nothing actually changed (e.g. a trailing space).
      if (trimmedValue === currentSearchTerm) return;

      const params = new URLSearchParams(searchParams.toString());

      if (trimmedValue) {
        params.set("searchTerm", trimmedValue);
      } else {
        params.delete("searchTerm");
      }

      params.set("page", "1");

      updateURL(params);
    }, SEARCH_DEBOUNCE_MS);
  };

  const clearSearch = () => {
    if (debounceReference.current) {
      clearTimeout(debounceReference.current);
    }

    if (inputReference.current) {
      inputReference.current.value = "";
      inputReference.current.focus();
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
        ref={inputReference}
        defaultValue={currentSearchTerm}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Search here..."
        aria-label="Search"
        className={compact ? "h-8 pl-9 pr-10" : "pl-9 pr-10"}
      />

      {currentSearchTerm && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
