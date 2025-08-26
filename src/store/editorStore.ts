import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { EditorStore } from "./types";
import { createEditorSlice } from "./slices/editorSlice";
import { createServerSlice } from "./slices/serverSlice";
import { createVersionSlice } from "./slices/versionSlice";

export const useEditorStore = create<EditorStore>()(
  devtools(
    persist(
      (...a) => ({
        // Initial state
        component: null,
        selectedElementId: null,
        sidebarOpen: true,
        canvasZoom: 1,
        isDirty: false,
        currentArtifactId: null,
        isSaving: false,
        isLoading: false,
        serverError: null,

        // Combine all slices
        ...createEditorSlice(...a),
        ...createServerSlice(...a),
        ...createVersionSlice(...a),
      }),
      {
        name: "react-component-editor",
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          canvasZoom: state.canvasZoom,
          currentArtifactId: state.currentArtifactId,
        }),
      }
    ),
    { name: "editor-store" }
  )
);
