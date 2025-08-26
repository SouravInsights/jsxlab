/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementNode } from "../utils/types";

/**
 * Turns a tree of ElementNodes into JSX code.
 * - Wraps everything in a React component with the given name.
 * - Converts props into JSX attributes.
 * - Handles inline styles by turning them into a style={{ ... }} object.
 */
function escapeAttr(value: string) {
  // Replace " with &quot; so it doesn't break the JSX
  return value.replace(/"/g, "&quot;");
}

function propsToJSX(props: Record<string, any> = {}): string {
  const { style, ...rest } = props;
  const parts: string[] = [];

  // Go through each prop and turn it into JSX syntax
  for (const key of Object.keys(rest)) {
    const val = rest[key];
    if (typeof val === "boolean") {
      // For boolean props, only add if it's true (e.g. "disabled")
      if (val) parts.push(key);
    } else if (typeof val === "string") {
      // Strings become key="value"
      parts.push(`${key}="${escapeAttr(val)}"`);
    } else {
      // Numbers or other values: just turn into string
      parts.push(`${key}="${String(val)}"`);
    }
  }

  // Handle inline styles separately
  if (style && typeof style === "object" && Object.keys(style).length > 0) {
    // Turn style object into something React accepts: style={{ ... }}
    const pairs = Object.entries(style)
      .map(([k, v]) => {
        if (typeof v === "string") return `"${k}": "${v}"`;
        return `"${k}": ${v}`;
      })
      .join(", ");
    parts.push(`style={ { ${pairs} } }`);
  }

  return parts.length > 0 ? " " + parts.join(" ") : "";
}

function renderElement(el: ElementNode): string {
  const propsStr = propsToJSX(el.props as Record<string, any>);
  const tag = el.tagName || "div";

  // Render children and text inside the element
  const childrenStr =
    (el.textContent ? escapeJSXText(el.textContent) : "") +
    (el.children && el.children.length > 0
      ? el.children.map((c) => renderElement(c)).join("")
      : "");

  // If there are no children or text, make it a self-closing tag
  if (!childrenStr) {
    return `<${tag}${propsStr} />`;
  }
  return `<${tag}${propsStr}>${childrenStr}</${tag}>`;
}

function escapeJSXText(s: string) {
  // Escape < so it doesn’t break JSX text nodes
  return s.replace(/</g, "&lt;");
}

export function generateCodeFromElements(
  elements: ElementNode[],
  componentName = "Component"
): string {
  // Convert all root elements into JSX
  const jsx = elements.map((el) => renderElement(el)).join("\n");

  // Wrap everything inside a React component
  return `export default function ${componentName}() {
  return (
    <>
      ${jsx}
    </>
  );
}
`;
}
