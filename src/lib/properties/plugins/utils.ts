/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementNode } from "../../utils/types";

/**
 * Helper to determine if an element should have certain properties
 */
export const isTextElement = (element: ElementNode) =>
  ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "div"].includes(
    element.tagName.toLowerCase()
  );

export const isBlockElement = (element: ElementNode) =>
  ["div", "section", "article", "main", "aside", "header", "footer"].includes(
    element.tagName.toLowerCase()
  );

/**
 * Parse compound CSS values like "16px" or "0 8px 16px"
 */
export const parseSpacingValue = (value: any): number | null => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = value.match(/^(\d+)px/);
    if (match) return parseInt(match[1], 10);
  }
  return null;
};

/**
 * Get directional spacing values from element style
 */
export const getDirectionalSpacing = (
  element: ElementNode,
  type: "padding" | "margin"
) => {
  const style = (element.props?.style as Record<string, any>) || {};

  const top = parseSpacingValue(style[`${type}Top`]) ?? 0;
  const right = parseSpacingValue(style[`${type}Right`]) ?? 0;
  const bottom = parseSpacingValue(style[`${type}Bottom`]) ?? 0;
  const left = parseSpacingValue(style[`${type}Left`]) ?? 0;

  return { top, right, bottom, left };
};
