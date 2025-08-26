import type { StateCreator } from "zustand";
import type { EditorStore } from "../types";
import { parseComponent } from "../../lib/parser/componentParser";
import { ArtifactsAPI } from "../../lib/api/artifacts";

export const createVersionSlice: StateCreator<
  EditorStore,
  [],
  [],
  Pick<EditorStore, "loadVersion" | "getVersionHistory">
> = (set) => ({
  loadVersion: async (artifactId: string, version: number) => {
    set({ isLoading: true, serverError: null });

    try {
      const versionData = await ArtifactsAPI.getVersion(artifactId, version);
      const parsedComponent = parseComponent(versionData.code);

      set({
        component: parsedComponent,
        currentArtifactId: artifactId,
        selectedElementId: null,
        isDirty: false,
        isLoading: false,
      });

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load version";
      set({
        serverError: errorMessage,
        isLoading: false,
      });
      console.error("Load version failed:", error);
      return false;
    }
  },

  getVersionHistory: async (artifactId: string) => {
    try {
      const versions = await ArtifactsAPI.getVersions(artifactId);
      return versions.map((v) => ({
        version: v.version,
        createdAt: v.createdAt,
      }));
    } catch (error) {
      console.error("Failed to get version history:", error);
      return [];
    }
  },
});
