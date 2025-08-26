"use client";

import React, { useEffect, useRef } from "react";
import { ElementNode } from "../../lib/utils/types";

interface ElementSelectorProps {
  elements: ElementNode[];
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  zoom: number;
}

export const ElementSelector: React.FC<ElementSelectorProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
  zoom,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.querySelector(
      "[data-preview-root]"
    ) as HTMLElement | null;
    if (!root) return;

    // Keep track of currently hovered element to remove styles cleanly
    let lastHovered: HTMLElement | null = null;

    const getElementIdFromTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return null;
      const el = (target as HTMLElement).closest(
        "[data-element-id]"
      ) as HTMLElement | null;
      return el ? el.getAttribute("data-element-id") : null;
    };

    const applyHover = (el: HTMLElement | null) => {
      if (
        lastHovered &&
        lastHovered !== el &&
        lastHovered.getAttribute("data-element-id") !== selectedElementId
      ) {
        lastHovered.style.outline = "";
        lastHovered.style.outlineOffset = "";
      }
      if (el && el.getAttribute("data-element-id") !== selectedElementId) {
        el.style.outline = "2px solid rgba(59, 130, 246, 0.5)";
        el.style.outlineOffset = "2px";
      }
      lastHovered = el;
    };

    const handleClick = (e: Event) => {
      const id = getElementIdFromTarget(e.target);
      if (id) {
        e.stopPropagation();
        onSelectElement(id);
        return;
      }
      // If clicked inside preview root but not on a data-element-id, clear selection
      onSelectElement(null);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const id = getElementIdFromTarget(e.target);
      const el = id
        ? (document.querySelector(
            `[data-element-id="${id}"]`
          ) as HTMLElement | null)
        : null;
      applyHover(el);
    };

    const handlePointerLeave = (e: Event) => {
      const id = getElementIdFromTarget(e.target);
      const el = id
        ? (document.querySelector(
            `[data-element-id="${id}"]`
          ) as HTMLElement | null)
        : null;
      if (el && el.getAttribute("data-element-id") !== selectedElementId) {
        el.style.outline = "";
        el.style.outlineOffset = "";
      }
      lastHovered = null;
    };

    root.addEventListener("click", handleClick);
    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);

      // cleanup hover style
      if (
        lastHovered &&
        lastHovered.getAttribute("data-element-id") !== selectedElementId
      ) {
        lastHovered.style.outline = "";
        lastHovered.style.outlineOffset = "";
      }
    };
    // Intentionally omit 'elements' from deps to avoid reattaching repeatedly.
    // If there's a need to re-scan for structural changes, we can observe mutations instead.
  }, [selectedElementId, onSelectElement]);

  useEffect(() => {
    // Remove previous selection styles
    document.querySelectorAll("[data-element-id]").forEach((element) => {
      (element as HTMLElement).style.outline = "";
      (element as HTMLElement).style.outlineOffset = "";
    });

    // Apply selection style to current selected element
    if (selectedElementId) {
      const selectedElement = document.querySelector(
        `[data-element-id="${selectedElementId}"]`
      );
      if (selectedElement) {
        (selectedElement as HTMLElement).style.outline = "2px solid #3b82f6";
        (selectedElement as HTMLElement).style.outlineOffset = "2px";
      }
    }
  }, [selectedElementId]);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 pointer-events-none"
      style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
    >
      {selectedElementId && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium pointer-events-auto">
          {elements.find((el) => el.id === selectedElementId)?.tagName ||
            "Selected"}
        </div>
      )}
    </div>
  );
};
