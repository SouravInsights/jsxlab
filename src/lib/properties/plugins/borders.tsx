import React from "react";
import { PropertyPlugin } from "../types";
import { ElementNode } from "../../utils/types";
import { Input } from "../../../components/ui/input";
import { ColorPicker } from "../../../components/ui/color-picker";
import { isBlockElement } from "./utils";

export const borderPropertiesPlugin: PropertyPlugin = {
  id: "core.borders",
  name: "Borders",
  version: "1.0.0",

  extractors: [
    {
      id: "borderWidth",
      categories: ["Borders"],
      priority: 80,
      canExtract: (el: ElementNode) => isBlockElement(el),
      extract: (el: ElementNode) => {
        const style = (el.props?.style as Record<string, any>) || {};
        const val = style.borderWidth || 0;
        return {
          key: "borderWidth",
          type: "slider",
          label: "Border Width",
          value: Number(val),
          category: "Borders",
          min: 0,
          max: 20,
        };
      },
    },
    {
      id: "borderStyle",
      categories: ["Borders"],
      priority: 75,
      canExtract: (el: ElementNode) => isBlockElement(el),
      extract: () => ({
        key: "borderStyle",
        type: "select",
        label: "Border Style",
        value: "solid",
        category: "Borders",
        options: ["solid", "dashed", "dotted", "double", "none"],
      }),
    },
    {
      id: "borderColor",
      categories: ["Borders"],
      priority: 70,
      canExtract: (el: ElementNode) => isBlockElement(el),
      extract: (el: ElementNode) => {
        const style = (el.props?.style as Record<string, any>) || {};
        return {
          key: "borderColor",
          type: "color",
          label: "Border Color",
          value: style.borderColor || "#000000",
          category: "Borders",
        };
      },
    },
  ],

  renderers: [
    {
      type: "slider",
      render: (property, onChange) => (
        <Input
          type="number"
          value={String(property.value || 0)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-9"
        />
      ),
      validate: (v) => !Number.isNaN(Number(v)),
      transform: (v) => Number(v),
    },
    {
      type: "select",
      render: (property, onChange) => (
        <select
          value={String(property.value || "")}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-9 px-3 border rounded-md"
        >
          {property.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ),
      validate: (v) => typeof v === "string",
      transform: (v) => String(v),
    },
    {
      type: "color",
      render: (property, onChange) => (
        <ColorPicker value={String(property.value)} onChange={onChange} />
      ),
      validate: (v) => typeof v === "string",
      transform: (v) => String(v),
    },
  ],
};
