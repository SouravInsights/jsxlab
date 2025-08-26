/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EditorState, ElementNode } from "../lib/utils/types";

// Core editor actions
export interface EditorActions {
  parseComponentCode: (code: string) => Promise<void>;
  selectElement: (elementId: string | null) => void;
  updateElementProperty: (
    elementId: string,
    property: string,
    value: any
  ) => void;
  toggleSidebar: () => void;
  setCanvasZoom: (zoom: number) => void;
  updateElementPosition: (
    elementId: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
  clearSelection: () => void;
  resetEditor: () => void;
  getSelectedElement: () => ElementNode | null;
}

// Server sync actions
export interface ServerActions {
  saveComponent: () => Promise<void>;
  saveAsNewComponent: (name: string) => Promise<void>;
  loadSavedComponent: (artifactId: string) => Promise<boolean>;
  listSavedComponents: () => Promise<
    Array<{ id: string; name: string; updatedAt: string; type: string }>
  >;
  deleteComponent: (artifactId: string) => Promise<void>;
}

// Version management actions
export interface VersionActions {
  loadVersion: (artifactId: string, version: number) => Promise<boolean>;
  getVersionHistory: (
    artifactId: string
  ) => Promise<Array<{ version: number; createdAt: string }>>;
}

// Server sync state
export interface ServerState {
  currentArtifactId: string | null;
  isSaving: boolean;
  isLoading: boolean;
  serverError: string | null;
}

// Complete store interface
export interface EditorStore
  extends EditorState,
    ServerState,
    EditorActions,
    ServerActions,
    VersionActions {}
