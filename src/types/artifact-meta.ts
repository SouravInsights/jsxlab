export type ArtifactType = "component" | "page" | "hook" | "style" | "template";

export interface ComponentMeta {
  props: string[];
  styleKeys: string[];
}

export interface PageMeta {
  route: string;
  components: string[];
}

export interface HookMeta {
  params: string[];
}

export interface StyleMeta {
  variables: Record<string, string>;
}

export interface TemplateMeta {
  placeholders: string[];
}

export type ArtifactMeta =
  | { type: "component"; meta: ComponentMeta }
  | { type: "page"; meta: PageMeta }
  | { type: "hook"; meta: HookMeta }
  | { type: "style"; meta: StyleMeta }
  | { type: "template"; meta: TemplateMeta };
