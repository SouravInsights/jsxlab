import type { StateCreator } from "zustand";
import type { EditorStore } from "../types";
import { parseComponent } from "../../lib/parser/componentParser";
import { generateCodeFromElements } from "../../lib/parser/codegen";
import { ArtifactsAPI } from "../../lib/api/artifacts";

export const createServerSlice: StateCreator<
  EditorStore,
  [],
  [],
  Pick<
    EditorStore,
    | "saveComponent"
    | "saveAsNewComponent"
    | "loadSavedComponent"
    | "listSavedComponents"
    | "deleteComponent"
  >
> = (set, get) => ({
  saveComponent: async () => {
    const state = get();
    if (!state.component) return;

    set({ isSaving: true, serverError: null });

    try {
      const code = generateCodeFromElements(
        state.component.elements,
        state.component.name
      );

      const meta = {
        dependencies: state.component.dependencies,
        updatedAt: Date.now(),
      };

      if (state.currentArtifactId) {
        // Update existing
        await ArtifactsAPI.update(state.currentArtifactId, {
          code,
          meta,
        });

        set({
          component: { ...state.component, code },
          isDirty: false,
          isSaving: false,
        });
      } else {
        // Create new
        const newArtifact = await ArtifactsAPI.create({
          type: "react-component",
          name: state.component.name,
          code,
          meta,
        });

        set({
          component: { ...state.component, code },
          currentArtifactId: newArtifact.id,
          isDirty: false,
          isSaving: false,
        });
      }

      console.log(`Saved component: ${state.component.name}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save component";
      set({
        serverError: errorMessage,
        isSaving: false,
      });
      console.error("Save failed:", error);
      throw error;
    }
  },

  saveAsNewComponent: async (name: string) => {
    const state = get();
    if (!state.component) return;

    set({ isSaving: true, serverError: null });

    try {
      const code = generateCodeFromElements(state.component.elements, name);

      const meta = {
        dependencies: state.component.dependencies,
        updatedAt: Date.now(),
      };

      const newArtifact = await ArtifactsAPI.create({
        type: "react-component",
        name,
        code,
        meta,
      });

      const updatedComponent = { ...state.component, name, code };

      set({
        component: updatedComponent,
        currentArtifactId: newArtifact.id,
        isDirty: false,
        isSaving: false,
      });

      console.log(`Saved as new component: ${name}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save component";
      set({
        serverError: errorMessage,
        isSaving: false,
      });
      console.error("Save as new failed:", error);
      throw error;
    }
  },

  loadSavedComponent: async (artifactId: string) => {
    set({ isLoading: true, serverError: null });

    try {
      const artifact = await ArtifactsAPI.getById(artifactId);

      // Parse the component from the stored code
      const parsedComponent = parseComponent(artifact.code);

      set({
        component: parsedComponent,
        currentArtifactId: artifact.id,
        selectedElementId: null,
        isDirty: false,
        isLoading: false,
      });

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load component";
      set({
        serverError: errorMessage,
        isLoading: false,
      });
      console.error("Load failed:", error);
      return false;
    }
  },

  listSavedComponents: async () => {
    try {
      const artifacts = await ArtifactsAPI.getAll();
      return artifacts.map((a) => ({
        id: a.id,
        name: a.name,
        updatedAt: a.updatedAt,
        type: a.type,
      }));
    } catch (error) {
      console.error("Failed to list components:", error);
      return [];
    }
  },

  deleteComponent: async (artifactId: string) => {
    try {
      await ArtifactsAPI.delete(artifactId);

      // If this was the current component, reset editor
      const state = get();
      if (state.currentArtifactId === artifactId) {
        set({
          component: null,
          currentArtifactId: null,
          selectedElementId: null,
          isDirty: false,
        });
      }
    } catch (error) {
      console.error("Failed to delete component:", error);
      throw error;
    }
  },
});
