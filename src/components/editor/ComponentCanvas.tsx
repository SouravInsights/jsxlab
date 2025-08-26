"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { useEditorStore } from "../../store/editorStore";
import { ComponentPreview } from "./ComponentPreview";
import { ElementSelector } from "./ElementSelector";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";

export const ComponentCanvas: React.FC = () => {
  const {
    component,
    canvasZoom,
    setCanvasZoom,
    selectedElementId,
    selectElement,
    clearSelection,
  } = useEditorStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const { clientWidth, clientHeight } = canvasRef.current;
        setCanvasSize({ width: clientWidth, height: clientHeight });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Clear selection when clicking on canvas background
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  const handleZoomIn = () => {
    setCanvasZoom(canvasZoom * 1.2);
  };

  const handleZoomOut = () => {
    setCanvasZoom(canvasZoom / 1.2);
  };

  const handleResetZoom = () => {
    setCanvasZoom(1);
  };

  if (!component) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Component Loaded
          </h3>
          <p className="text-gray-500">
            Import a React component to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-gray-100 overflow-hidden">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full overflow-auto p-4"
        onClick={handleCanvasClick}
      >
        <div
          className="mx-auto bg-white rounded-lg shadow-lg min-h-96 relative "
          style={{
            transform: `scale(${canvasZoom})`,
            transformOrigin: "top center",
            width: `${Math.max(800, canvasSize.width * 0.85)}px`,
            maxWidth: "none",
          }}
        >
          <ComponentPreview component={component} />

          <ElementSelector
            elements={component.elements}
            selectedElementId={selectedElementId}
            onSelectElement={selectElement}
            zoom={canvasZoom}
          />
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={canvasZoom <= 0.25}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </Button>

        <span className="px-2 text-sm font-medium text-gray-600 min-w-16 text-center">
          {Math.round(canvasZoom * 100)}%
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={canvasZoom >= 4}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </Button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetZoom}
          title="Reset Zoom"
        >
          <RotateCcw size={16} />
        </Button>
      </div>

      {/* Selection Info */}
      {selectedElementId && (
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
          Selected:{" "}
          {
            component.elements.find((el) => el.id === selectedElementId)
              ?.tagName
          }
        </div>
      )}
    </div>
  );
};
