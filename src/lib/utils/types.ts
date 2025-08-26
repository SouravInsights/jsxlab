/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ElementNode {
  id: string;
  type: string;
  tagName: string;
  props: Record<string, any>;
  children: ElementNode[];
  textContent?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface EditableProperty {
  key: string;
  type: "text" | "color" | "number" | "boolean" | "select";
  label: string;
  value: string | number | boolean | null;
  options?: (string | number)[];
  min?: number;
  max?: number;
}

export interface ParsedComponent {
  name: string;
  code: string;
  ast: any;
  dependencies: string[];
  elements: ElementNode[];
}

export interface EditorState {
  component: ParsedComponent | null;
  selectedElementId: string | null;
  sidebarOpen: boolean;
  canvasZoom: number;
  isDirty: boolean;
}

export interface ComponentError {
  type: "parse" | "compile" | "runtime";
  message: string;
  line?: number;
  column?: number;
}
