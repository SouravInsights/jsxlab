import { useCallback, useEffect } from "react";
import { useEditorStore } from "../store/editorStore";

export const useElementSelection = () => {
  const { selectedElementId, selectElement, component } = useEditorStore();

  const selectElementById = useCallback(
    (elementId: string) => {
      if (component?.elements.find((el) => el.id === elementId)) {
        selectElement(elementId);
      }
    },
    [component, selectElement]
  );

  const selectNextElement = useCallback(() => {
    if (!component || !selectedElementId) return;

    const currentIndex = component.elements.findIndex(
      (el) => el.id === selectedElementId
    );
    const nextIndex = (currentIndex + 1) % component.elements.length;
    selectElement(component.elements[nextIndex].id);
  }, [component, selectedElementId, selectElement]);

  const selectPreviousElement = useCallback(() => {
    if (!component || !selectedElementId) return;

    const currentIndex = component.elements.findIndex(
      (el) => el.id === selectedElementId
    );
    const prevIndex =
      currentIndex === 0 ? component.elements.length - 1 : currentIndex - 1;
    selectElement(component.elements[prevIndex].id);
  }, [component, selectedElementId, selectElement]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!component) return;

      // Arrow key navigation
      if (e.key === "ArrowDown" && e.metaKey) {
        e.preventDefault();
        selectNextElement();
      } else if (e.key === "ArrowUp" && e.metaKey) {
        e.preventDefault();
        selectPreviousElement();
      } else if (e.key === "Escape") {
        e.preventDefault();
        selectElement(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [component, selectElement, selectNextElement, selectPreviousElement]);

  return {
    selectedElementId,
    selectElementById,
    selectNextElement,
    selectPreviousElement,
  };
};

// src/lib/utils/constants.ts
export const SUPPORTED_ELEMENTS = [
  "div",
  "span",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "button",
  "input",
  "textarea",
  "img",
  "a",
  "ul",
  "ol",
  "li",
  "section",
  "article",
  "header",
  "footer",
  "nav",
] as const;

export const EDITABLE_STYLE_PROPERTIES = {
  color: {
    type: "color",
    label: "Text Color",
    defaultValue: "#000000",
  },
  backgroundColor: {
    type: "color",
    label: "Background Color",
    defaultValue: "#ffffff",
  },
  fontSize: {
    type: "number",
    label: "Font Size",
    defaultValue: 16,
    min: 8,
    max: 72,
    unit: "px",
  },
  fontWeight: {
    type: "select",
    label: "Font Weight",
    defaultValue: "normal",
    options: [
      "normal",
      "bold",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
    ],
  },
  textAlign: {
    type: "select",
    label: "Text Align",
    defaultValue: "left",
    options: ["left", "center", "right", "justify"],
  },
  padding: {
    type: "number",
    label: "Padding",
    defaultValue: 0,
    min: 0,
    max: 100,
    unit: "px",
  },
  margin: {
    type: "number",
    label: "Margin",
    defaultValue: 0,
    min: 0,
    max: 100,
    unit: "px",
  },
  borderRadius: {
    type: "number",
    label: "Border Radius",
    defaultValue: 0,
    min: 0,
    max: 50,
    unit: "px",
  },
} as const;

export const COMMON_PROPS = {
  className: {
    type: "text",
    label: "CSS Classes",
  },
  id: {
    type: "text",
    label: "Element ID",
  },
  "aria-label": {
    type: "text",
    label: "Accessibility Label",
  },
} as const;
