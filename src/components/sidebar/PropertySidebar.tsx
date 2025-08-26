"use client";

import React from "react";
import { useEditorStore } from "../../store/editorStore";
import { PropertyEditor } from "./PropertyEditor";
import { extractElementProperties } from "../../lib/properties";
import { Settings } from "lucide-react";

export const PropertySidebar: React.FC = () => {
  const { component, selectedElementId, getSelectedElement } = useEditorStore();

  const selectedElement = getSelectedElement();
  const elementProperties = selectedElement
    ? extractElementProperties(selectedElement)
    : [];

  if (!component) {
    return (
      <div className="h-full flex flex-col bg-white border-l border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
              <Settings size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No component loaded</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        {selectedElement && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
              {selectedElement.tagName}
              {selectedElement.textContent && (
                <span className="ml-1 opacity-75">
                  &quot;{selectedElement.textContent.slice(0, 10)}
                  {selectedElement.textContent.length > 10 ? "..." : ""}&quot;
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Property Editor */}
      <div className="flex-1 overflow-y-auto">
        {selectedElement ? (
          <div className="p-2">
            <PropertyEditor
              elementId={selectedElementId!}
              properties={elementProperties}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium">Select an element</p>
              <p className="text-gray-500 text-sm mt-1">
                Click any element to edit its properties
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
