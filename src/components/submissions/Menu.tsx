"use client";

import { useEffect, useRef, useState } from "react";

/** Minimal click-outside dropdown. Shared by the toolbar and column menus. */
export function Menu({
  label,
  align = "left",
  children,
}: {
  label: (open: boolean) => React.ReactNode;
  align?: "left" | "right";
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="block"
      >
        {label(open)}
      </button>
      {open && (
        <div
          role="menu"
          className={
            "absolute z-50 mt-1.5 min-w-[180px] overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg " +
            (align === "right" ? "right-0" : "left-0")
          }
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  onClick,
  children,
  danger = false,
  disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={
        "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm font-medium transition-colors disabled:opacity-40 " +
        (danger
          ? "text-destructive hover:bg-destructive-subtle"
          : "text-foreground hover:bg-muted")
      }
    >
      {children}
    </button>
  );
}
