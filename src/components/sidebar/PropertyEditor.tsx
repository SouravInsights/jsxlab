"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useEditorStore } from "../../store/editorStore";
import { EditableProperty } from "../../lib/properties/types";
import { getPropertyRegistry } from "../../lib/properties";

interface PropertyEditorProps {
  elementId: string;
  properties: EditableProperty[];
}

const CollapsibleSection: React.FC<{
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}> = ({ title, children, defaultOpen = true, count }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-md border border-gray-100">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="uppercase tracking-wider text-xs text-gray-700">
            {title}
          </span>
          {typeof count === "number" && (
            <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
              {count}
            </span>
          )}
        </div>

        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-150 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`pb-4 transition-[max-height,opacity] duration-200 overflow-hidden ${
          open ? "pt-2 max-h-[2000px] opacity-100" : "pt-0 max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  elementId,
  properties,
}) => {
  const { updateElementProperty } = useEditorStore();
  const registry = getPropertyRegistry();

  const groupedProperties = useMemo(() => {
    const groups: Record<string, EditableProperty[]> = {};

    properties.forEach((prop) => {
      const category = prop.category || "Other"; // fallback
      if (!groups[category]) groups[category] = [];
      groups[category].push(prop);
    });

    return groups;
  }, [properties]);

  const handleChange = (property: EditableProperty, value: any) => {
    const transformedValue = registry.transformProperty(property, value);
    updateElementProperty(elementId, property.key, transformedValue);
  };

  const handleDirectionalChange = (
    basePropertyKey: string,
    values: { top: number; right: number; bottom: number; left: number }
  ) => {
    updateElementProperty(elementId, `${basePropertyKey}Top`, values.top);
    updateElementProperty(elementId, `${basePropertyKey}Right`, values.right);
    updateElementProperty(elementId, `${basePropertyKey}Bottom`, values.bottom);
    updateElementProperty(elementId, `${basePropertyKey}Left`, values.left);

    const average =
      (values.top + values.right + values.bottom + values.left) / 4;
    updateElementProperty(elementId, basePropertyKey, Math.round(average));
  };

  const renderProperty = (property: EditableProperty) => {
    const rendererConfig = registry.getRenderer(property.type);

    if (!rendererConfig) {
      console.warn(`No renderer found for property type: ${property.type}`);
      return (
        <div
          key={property.key}
          className="p-3 rounded-md bg-red-50 border border-red-200"
        >
          <div className="text-sm text-red-600">
            No renderer available for type: {property.type}
          </div>
        </div>
      );
    }

    const onChange = (value: any) => {
      if (!registry.validateProperty(property, value)) {
        console.warn(`Invalid value for property ${property.key}:`, value);
        return;
      }
      handleChange(property, value);
    };

    try {
      const renderedControl = rendererConfig.render(property, onChange, {
        directionalUpdate: (values) =>
          handleDirectionalChange(property.key, values),
      });

      return (
        <div
          key={property.key}
          className="p-3 rounded-md border border-transparent hover:border-gray-100 transition"
        >
          <label className="block text-sm font-medium text-gray-800 mb-2">
            {property.label || property.key}
          </label>
          <div className="text-sm">{renderedControl}</div>
        </div>
      );
    } catch (error) {
      console.error(`Error rendering property ${property.key}:`, error);
      return (
        <div
          key={property.key}
          className="p-3 rounded-md bg-red-50 border border-red-200"
        >
          <div className="text-sm text-red-600">
            Error rendering {property.key}
          </div>
        </div>
      );
    }
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        Select an element to edit its properties
      </div>
    );
  }

  const sortedCategories = Object.keys(groupedProperties).sort((a, b) => {
    if (a === "Typography") return -1;
    if (b === "Typography") return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
      {sortedCategories.map((category) => (
        <CollapsibleSection
          key={category}
          title={category}
          count={groupedProperties[category].length}
          defaultOpen={category === "Typography"}
        >
          <div className="space-y-2">
            {groupedProperties[category].map(renderProperty)}
          </div>
        </CollapsibleSection>
      ))}
    </div>
  );
};
