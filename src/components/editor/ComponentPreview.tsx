"use client";

import React, { useMemo } from "react";
import type { ParsedComponent, ElementNode } from "../../lib/utils/types";

interface ComponentPreviewProps {
  component: ParsedComponent;
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  component,
}) => {
  const DynamicComponent = useMemo(() => {
    // recursive renderer
    const renderElement = (element: ElementNode): React.ReactNode => {
      const { tagName, props = {}, textContent, id, children = [] } = element;

      // Ensure style is a plain object (parser may have produced it)
      const style =
        props.style &&
        typeof props.style === "object" &&
        props.style.constructor === Object
          ? { ...props.style }
          : {};

      // Element props forwarded to React element
      const elementProps: React.HTMLAttributes<HTMLElement> & {
        [key: string]: unknown;
      } = {
        ...props,
        key: id,
        "data-element-id": id,
        style: {
          ...style,
          position: style.position || "relative",
        },
      };

      // Build children nodes: prefer explicit children array; fallback to textContent or props.children
      const childNodes: React.ReactNode[] = [];

      if (children && children.length > 0) {
        children.forEach((c: ElementNode) => {
          childNodes.push(renderElement(c));
        });
      } else if (textContent) {
        childNodes.push(textContent);
      } else if (props.children) {
        // If parser left a children string or code in props.children, render it as text
        childNodes.push(String(props.children));
      }

      const tag = tagName ? tagName.toLowerCase() : "div";

      // element-specific handling (img/input/textarea) while preserving className/style
      if (tag === "img") {
        return React.createElement("img", {
          ...elementProps,
          alt: props.alt || "Image",
        });
      }

      if (tag === "input") {
        return React.createElement("input", {
          ...elementProps,
          defaultValue: props.value ?? "",
          readOnly: true,
        });
      }

      if (tag === "textarea") {
        return React.createElement("textarea", {
          ...elementProps,
          defaultValue: textContent || props.value || "",
          readOnly: true,
        });
      }

      // Normal element creation (div, span, p, h1..h6, button, a, etc.)
      return React.createElement(tag, elementProps, ...childNodes);
    };

    // Render top-level roots
    return function RenderedComponent() {
      return React.createElement(
        "div",
        { className: "component-preview" },
        ...(component.elements.map((root) =>
          renderElement(root)
        ) as React.ReactNode[])
      );
    };
  }, [component.elements]);

  return (
    <div className="w-full">
      <div className="p-4 mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{component.name}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded">
            {component.elements.length} elements
          </span>
          {component.dependencies.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
              {component.dependencies.length} deps
            </span>
          )}
        </div>
      </div>

      {component.dependencies.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">
                Dependencies detected
              </h4>
              <div className="mt-1 text-sm text-yellow-700">
                <p>
                  This component imports: {component.dependencies.join(", ")}
                </p>
                <p className="mt-1">
                  Some features may not work correctly in preview mode.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-white overflow-auto max-h-[70vh]" data-preview-root>
          <div className="p-6">
            <DynamicComponent />
          </div>
        </div>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          View Source Code
        </summary>
        <div className="mt-2 p-4 bg-gray-50 rounded-md">
          <pre className="text-xs text-gray-600 overflow-x-auto">
            <code>{component.code}</code>
          </pre>
        </div>
      </details>
    </div>
  );
};
