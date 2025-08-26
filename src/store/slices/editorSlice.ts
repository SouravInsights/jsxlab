/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StateCreator } from "zustand";
import type { EditorStore } from "../types";
import { parseComponent } from "../../lib/parser/componentParser";
import { generateCodeFromElements } from "../../lib/parser/codegen";
import { getPropertyRegistry } from "../../lib/properties";
import { findElementById, updateElementById } from "../utils/elementUtils";

export const createEditorSlice: StateCreator<
  EditorStore,
  [],
  [],
  Pick<
    EditorStore,
    | "parseComponentCode"
    | "selectElement"
    | "updateElementProperty"
    | "toggleSidebar"
    | "setCanvasZoom"
    | "updateElementPosition"
    | "clearSelection"
    | "resetEditor"
    | "getSelectedElement"
  >
> = (set, get) => ({
  parseComponentCode: async (code: string) => {
    try {
      const parsedComponent = parseComponent(code);
      set({
        component: parsedComponent,
        selectedElementId: null,
        isDirty: false,
        currentArtifactId: null,
      });
    } catch (error) {
      console.error("Failed to parse component:", error);
      throw error;
    }
  },

  selectElement: (elementId: string | null) => {
    set({ selectedElementId: elementId });
  },

  updateElementProperty: (elementId: string, property: string, value: any) => {
    const state = get();
    if (!state.component) return;

    const registry = getPropertyRegistry();

    const updatedElements = updateElementById(
      state.component.elements,
      elementId,
      (element) => {
        // Find the property configuration from registry
        const properties = registry.extractProperties(element);
        const propertyConfig = properties.find((p) => p.key === property);

        if (propertyConfig) {
          // Use registry's transform logic
          const transformedValue = registry.transformProperty(
            propertyConfig,
            value
          );

          // Apply property based on its nature (from plugin metadata)
          if (property === "textContent") {
            const text =
              transformedValue == null ? undefined : String(transformedValue);
            return { ...element, textContent: text };
          } else {
            // Most properties go to style, but this could be configurable per plugin
            const updatedProps = { ...element.props };
            if (!updatedProps.style) updatedProps.style = {};
            updatedProps.style[property] = transformedValue;
            return { ...element, props: updatedProps };
          }
        }

        // Fallback for unknown properties
        return element;
      }
    );

    // Regenerate code so export/save includes changes
    const newCode = generateCodeFromElements(
      updatedElements,
      state.component.name
    );

    set({
      component: {
        ...state.component,
        elements: updatedElements,
        code: newCode,
      },
      isDirty: true,
    });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setCanvasZoom: (zoom: number) => {
    set({ canvasZoom: Math.max(0.25, Math.min(4, zoom)) });
  },

  updateElementPosition: (
    elementId: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const state = get();
    if (!state.component) return;

    const updatedElements = updateElementById(
      state.component.elements,
      elementId,
      (element) => ({
        ...element,
        position: { x, y, width, height },
      })
    );

    const newCode = generateCodeFromElements(
      updatedElements,
      state.component.name
    );

    set({
      component: {
        ...state.component,
        elements: updatedElements,
        code: newCode,
      },
    });
  },

  clearSelection: () => {
    set({ selectedElementId: null });
  },

  resetEditor: () => {
    set({
      component: null,
      selectedElementId: null,
      isDirty: false,
      canvasZoom: 1,
      currentArtifactId: null,
    });
  },

  getSelectedElement: () => {
    const state = get();
    if (!state.component || !state.selectedElementId) return null;
    return findElementById(state.component.elements, state.selectedElementId);
  },
});
