import { PropertyPlugin } from "../types";
import { ElementNode } from "../../utils/types";
import { Slider } from "@radix-ui/react-slider";
import { Input } from "../../../components/ui/input";
import { isBlockElement } from "./utils";

export const appearancePropertiesPlugin: PropertyPlugin = {
  id: "core.appearance",
  name: "Appearance",
  version: "1.0.0",

  extractors: [
    {
      id: "opacity",
      categories: ["Appearance"],
      priority: 80,
      canExtract: (el: ElementNode) => true,
      extract: (el: ElementNode) => {
        const style = (el.props?.style as Record<string, any>) || {};
        const opacity = style.opacity ?? 1;
        return {
          key: "opacity",
          type: "slider",
          label: "Opacity",
          value: Number(opacity),
          category: "Appearance",
          min: 0,
          max: 1,
          step: 0.05,
        };
      },
    },
    {
      id: "borderRadius",
      categories: ["Appearance"],
      priority: 75,
      canExtract: (el: ElementNode) => isBlockElement(el),
      extract: (el: ElementNode) => {
        const style = (el.props?.style as Record<string, any>) || {};
        let val = 0;
        if (style.borderRadius != null) {
          val =
            typeof style.borderRadius === "string"
              ? parseInt(style.borderRadius.replace("px", ""), 10) || 0
              : style.borderRadius;
        }
        return {
          key: "borderRadius",
          type: "slider",
          label: "Corner Radius",
          value: val,
          category: "Appearance",
          min: 0,
          max: 50,
        };
      },
    },
    {
      id: "boxShadow",
      categories: ["Appearance"],
      priority: 70,
      canExtract: (el: ElementNode) => isBlockElement(el),
      extract: (el: ElementNode) => {
        const style = (el.props?.style as Record<string, any>) || {};
        return {
          key: "boxShadow",
          type: "text",
          label: "Box Shadow",
          value: String(style.boxShadow || ""),
          category: "Appearance",
        };
      },
    },
  ],

  renderers: [
    {
      type: "slider",
      render: (property, onChange) => {
        const numVal = Number(property.value) || 0;
        const min = property.min || 0;
        const max = property.max || 100;
        const step = property.step || 1;
        return (
          <div className="space-y-2">
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
              onChange={(e) => onChange(Number(e.target.value))}
              min={min}
              max={max}
              step={step}
              className="h-9"
            />
          </div>
        );
      },
      validate: (v) => !Number.isNaN(Number(v)),
      transform: (v) => Number(v),
    },
    {
      type: "text",
      render: (property, onChange) => (
        <Input
          value={String(property.value || "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={property.label}
          className="h-9"
        />
      ),
      validate: (v) => typeof v === "string",
      transform: (v) => String(v),
    },
  ],
};
