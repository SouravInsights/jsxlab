import React from "react";
import { PropertyPlugin } from "../types";
import { ElementNode } from "../../utils/types";
import { Input } from "../../../components/ui/input";
import { Slider } from "@radix-ui/react-slider";
import { isTextElement } from "./utils";

/**
 * Text Properties Plugin - Handles text content, font size, font weight
 */
export const textPropertiesPlugin: PropertyPlugin = {
  id: "core.text",
  name: "Text Properties",
  version: "1.1.0",

  extractors: [
    {
      id: "textContent",
      categories: ["Typography"],
      priority: 100,
      canExtract: (element: ElementNode) =>
        Boolean(element.textContent?.trim()),
      extract: (element: ElementNode) => {
        if (!element.textContent?.trim()) return null;
        return {
          key: "textContent",
          type: "text",
          label: "Text Content",
          value: element.textContent,
          category: "Typography",
        };
      },
    },
    {
      id: "fontSize",
      categories: ["Typography"],
      priority: 90,
      canExtract: (element: ElementNode) => isTextElement(element),
      extract: (element: ElementNode) => {
        const style = (element.props?.style as Record<string, any>) || {};
        const fontSize = style.fontSize;

        let fontSizeValue = 16;
        if (fontSize != null) {
          if (typeof fontSize === "string") {
            fontSizeValue = parseInt(fontSize.replace("px", ""), 10) || 16;
          } else if (typeof fontSize === "number") {
            fontSizeValue = fontSize;
          }
        }

        return {
          key: "fontSize",
          type: "slider",
          label: "Font Size",
          value: fontSizeValue,
          category: "Typography",
          min: 8,
          max: 72,
          step: 1,
        };
      },
    },
    {
      id: "fontWeight",
      categories: ["Typography"],
      priority: 85,
      canExtract: (element: ElementNode) => isTextElement(element),
      extract: (element: ElementNode) => {
        const style = (element.props?.style as Record<string, any>) || {};
        const fontWeight = style.fontWeight || "400";

        return {
          key: "fontWeight",
          type: "select",
          label: "Font Weight",
          value: String(fontWeight),
          category: "Typography",
          options: ["300", "400", "500", "600", "700", "800"],
        };
      },
    },
  ],

  renderers: [
    {
      type: "text",
      render: (property, onChange) => (
        <Input
          value={String(property.value || "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${property.label?.toLowerCase() || "text"}`}
          className="h-9"
        />
      ),
      validate: (value) => typeof value === "string",
      transform: (value) => String(value || ""),
    },
    {
      type: "slider",
      render: (property, onChange) => {
        const numVal =
          typeof property.value === "number"
            ? property.value
            : Number(property.value || 0);
        const min = property.min || 0;
        const max = property.max || 100;
        const step = property.step || 1;

        return (
          <div className="space-y-3">
            <Slider
              value={[numVal]}
              onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
              min={min}
              max={max}
              step={step}
              className="w-full"
            />
            <Input
              type="number"
              value={numVal}
              onChange={(e) => {
                const n = parseFloat(e.target.value || "0");
                onChange(
                  Number.isNaN(n) ? min : Math.max(min, Math.min(max, n))
                );
              }}
              min={min}
              max={max}
              step={step}
              className="h-9"
            />
          </div>
        );
      },
      validate: (value) => {
        const num = Number(value);
        return !Number.isNaN(num) && num >= 0;
      },
      transform: (value) => Number(value) || 0,
    },
    {
      type: "select",
      render: (property, onChange) => (
        <select
          value={String(property.value || "")}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-9 px-3 border border-gray-200 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {property.options?.map((option) => (
            <option key={String(option)} value={String(option)}>
              {property.key === "fontWeight" && option === "300"
                ? "Light"
                : property.key === "fontWeight" && option === "400"
                ? "Regular"
                : property.key === "fontWeight" && option === "500"
                ? "Medium"
                : property.key === "fontWeight" && option === "600"
                ? "Semibold"
                : property.key === "fontWeight" && option === "700"
                ? "Bold"
                : property.key === "fontWeight" && option === "800"
                ? "Extra Bold"
                : String(option)}
            </option>
          ))}
        </select>
      ),
      validate: (value) => typeof value === "string",
      transform: (value) => String(value || ""),
    },
  ],
};
