import React from "react";
import { PropertyPlugin } from "../types";
import { ElementNode } from "../../utils/types";
import { ColorPicker } from "../../../components/ui/color-picker";
import { isTextElement, isBlockElement } from "./utils";

export const colorPropertiesPlugin: PropertyPlugin = {
  id: "core.colors",
  name: "Colors",
  version: "1.0.0",

  extractors: [
    {
      id: "textColor",
      categories: ["Colors"],
      priority: 80,
      canExtract: (element: ElementNode) => isTextElement(element),
      extract: (element: ElementNode) => {
        const style = (element.props?.style as Record<string, any>) || {};
        const color = style.color || "#000000";
        return {
          key: "color",
          type: "color",
          label: "Text Color",
          value: String(color),
          category: "Colors",
        };
      },
    },
    {
      id: "backgroundColor",
      categories: ["Colors"],
      priority: 70,
      canExtract: (element: ElementNode) =>
        isBlockElement(element) || element.tagName === "span",
      extract: (element: ElementNode) => {
        const style = (element.props?.style as Record<string, any>) || {};
        const backgroundColor = style.backgroundColor || "transparent";
        return {
          key: "backgroundColor",
          type: "color",
          label: "Background Color",
          value:
            backgroundColor === "transparent"
              ? "#ffffff"
              : String(backgroundColor),
          category: "Colors",
        };
      },
    },
  ],

  renderers: [
    {
      type: "color",
      render: (property, onChange) => (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ColorPicker
              value={String(property.value || "#000000")}
              onChange={onChange}
            />
          </div>
          <div className="text-xs text-gray-500 font-mono min-w-16">
            {String(property.value || "")}
          </div>
        </div>
      ),
      validate: (value) =>
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(String(value)),
      transform: (value) => String(value || "#000000"),
    },
  ],
};
