"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

export type DropdownOption = { value: string; label: string };

type FilterDropdownProps = {
  label: string; // button text when nothing is chosen ("Experience")
  anyLabel: string; // first option, clears the filter ("Any experience")
  options: DropdownOption[];
  value: string; // "" = any
  onChange: (value: string) => void;
};

// A filter button that opens a themed list (the browser's native <select> list can't be styled). Same height,
// border and dark active state as the filter tabs; keyboard: arrows, Home/End, Enter/Space, Escape, Tab.
export function FilterDropdown({ label, anyLabel, options, value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [alignRight, setAlignRight] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const items: DropdownOption[] = [{ value: "", label: anyLabel }, ...options];
  const selected = options.find((option) => option.value === value);

  const show = () => {
    setActive(Math.max(0, items.findIndex((item) => item.value === value)));
    setOpen(true);
  };
  const close = (focusButton = true) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  };
  const choose = (index: number) => {
    onChange(items[index].value);
    close();
  };

  // Close on outside click; keep the list on screen by opening it leftwards near the right edge.
  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const list = listRef.current?.getBoundingClientRect();
    const button = buttonRef.current?.getBoundingClientRect();
    if (list && button) setAlignRight(button.left + list.width > document.documentElement.clientWidth - 16);
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onButtonKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      show();
    }
  };

  const onListKey = (event: KeyboardEvent) => {
    const last = items.length - 1;
    if (event.key === "ArrowDown") setActive((index) => Math.min(last, index + 1));
    else if (event.key === "ArrowUp") setActive((index) => Math.max(0, index - 1));
    else if (event.key === "Home") setActive(0);
    else if (event.key === "End") setActive(last);
    else if (event.key === "Enter" || event.key === " ") choose(active);
    else if (event.key === "Escape") close();
    else if (event.key === "Tab") setOpen(false);
    else return;
    if (event.key !== "Tab") event.preventDefault();
  };

  const isSet = value !== "";

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={selected ? `${label}: ${selected.label}` : label}
        onClick={() => (open ? close(false) : show())}
        onKeyDown={onButtonKey}
        className={`inline-flex h-[2.3125rem] items-center gap-2.5 border pr-3.5 pl-[1.125rem] text-sm whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
          isSet || open ? "border-ink" : "border-[#dadada] hover:border-ink"
        } ${isSet ? "bg-ink text-white" : "text-ink"}`}
      >
        {selected?.label ?? label}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${listId}-${active}`}
          onKeyDown={onListKey}
          className={`absolute top-full z-30 mt-1.5 max-h-72 min-w-full overflow-y-auto border border-ink/15 bg-white py-1.5 shadow-[0_0.75rem_2rem_rgba(0,0,0,0.08)] focus:outline-none ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, index) => {
            const isSelected = item.value === value;
            return (
              <li
                key={item.value || "any"}
                id={`${listId}-${index}`}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                onPointerMove={() => setActive(index)}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center justify-between gap-6 px-4 py-2.5 text-sm whitespace-nowrap transition-colors duration-150 ${
                  index === active ? "bg-surface" : ""
                } ${isSelected ? "font-medium text-ink" : "text-ink/80"}`}
              >
                {item.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" className={`size-3.5 text-brand ${isSelected ? "" : "invisible"}`} aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
