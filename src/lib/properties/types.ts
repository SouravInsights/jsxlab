/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { ElementNode } from "../utils/types";

export interface EditableProperty {
  key: string;
  type: PropertyType;
  label: string;
  value: PropertyValue;
  category?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  // Allow for additional metadata (like directional values)
  [key: string]: any;
}

export type PropertyType =
  | "text"
  | "number"
  | "color"
  | "boolean"
  | "select"
  | "slider"
  | "dimension"
  | "spacing"
  | "spacing-directional";

export type PropertyValue = string | number | boolean | null | undefined;

export interface PropertyExtractorConfig {
  /** Unique identifier for this property type */
  id: string;

  /** Categories this property belongs to */
  categories: string[];

  /** Priority for ordering (higher = first) */
  priority: number;

  /** Extract property from element if applicable */
  extract: (element: ElementNode) => EditableProperty | null;

  /** Determine if this extractor applies to the element */
  canExtract: (element: ElementNode) => boolean;
}

/**
 * Extra context that the editor can provide to property renderers
 * for advanced behaviors (e.g. directional spacing updates).
 */
export interface PropertyRenderContext {
  directionalUpdate?: (values: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }) => void;
}

export interface PropertyRendererConfig {
  /** Property type this renderer handles */
  type: PropertyType;

  /** Render the property control */
  render: (
    property: EditableProperty,
    onChange: (value: PropertyValue) => void,
    ctx?: PropertyRenderContext
  ) => ReactNode;

  /** Validate property value */
  validate?: (value: PropertyValue) => boolean;

  /** Transform value before saving */
  transform?: (value: PropertyValue) => PropertyValue;
}

export interface PropertyUpdateContext {
  elementId: string;
  property: EditableProperty;
  newValue: PropertyValue;
  oldValue: PropertyValue;
}

export interface PropertyPlugin {
  /** Plugin identifier */
  id: string;

  /** Display name */
  name: string;

  /** Plugin version */
  version: string;

  /** Property extractors this plugin provides */
  extractors: PropertyExtractorConfig[];

  /** Property renderers this plugin provides */
  renderers: PropertyRendererConfig[];

  /** Initialize plugin (optional) */
  initialize?: () => void | Promise<void>;

  /** Cleanup plugin (optional) */
  cleanup?: () => void;
}
