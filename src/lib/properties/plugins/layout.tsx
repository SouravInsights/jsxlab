import React from "react";
import { PropertyPlugin } from "../types";
import { ElementNode } from "../../utils/types";
import { SpacingControl } from "../../../components/sidebar/SpacingControl";
import { parseSpacingValue, getDirectionalSpacing } from "./utils";

export const layoutPropertiesPlugin: PropertyPlugin = {
  id: "core.layout",
  name: "Layout",
  version: "1.2.0",

  extractors: [
    {
      id: "padding",
      categories: ["Layout"],
      priority: 90,
      canExtract: () => true,
      extract: (element: ElementNode) => {
        const style = (element.props?.style as Record<string, any>) || {};
        const baseValue = parseSpacingValue(style.padding) || 0;
        const directional = getDirectionalSpacing(element, "padding");

        return {
          key: "padding",
          type: "spacing-directional",
          label: "Padding",
          value: baseValue,
          category: "Layout",
          min: 0,
          max: 100,
          _directionalValues: directional,
        };
      },
    },
    {
      id: "margin",
      categories: ["Layout"],
      priority: 85,
      canExtract: () => true,
      extract: (element: ElementNode) => {
        const style = (element.props?.style as Record<string, any>) || {};
        const baseValue = parseSpacingValue(style.margin) || 0;
        const directional = getDirectionalSpacing(element, "margin");

        return {
          key: "margin",
          type: "spacing-directional",
          label: "Margin",
          value: baseValue,
          category: "Layout",
          min: 0,
          max: 100,
          _directionalValues: directional,
        };
      },
    },
  ],

  renderers: [
    {
      type: "spacing-directional",
      render: (property, onChange, ctx) => {
        const numVal = Number(property.value) || 0;
        const min = property.min || 0;
        const max = property.max || 200;
        const directionalValues = (property as any)._directionalValues || {
          top: numVal,
          right: numVal,
          bottom: numVal,
          left: numVal,
        };

        const handleDirectionalChange = (values: {
          top: number;
          right: number;
          bottom: number;
          left: number;
        }) => {
          if (ctx?.directionalUpdate) {
            ctx.directionalUpdate(values);
          } else {
            console.warn(
              "No directionalUpdate handler provided for spacing property"
            );
          }
        };

        return (
          <SpacingControl
            label=""
            value={numVal}
            onChange={onChange}
            onDirectionalChange={handleDirectionalChange}
            directionalValues={directionalValues}
            min={min}
            max={max}
          />
        );
      },
      validate: (value) => !Number.isNaN(Number(value)),
      transform: (value) => Number(value) || 0,
    },
  ],
};
