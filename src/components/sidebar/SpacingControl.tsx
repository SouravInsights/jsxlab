import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@radix-ui/react-slider";
import { Input } from "../ui/input";

interface SpacingControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onDirectionalChange?: (values: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }) => void;
  directionalValues?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  min?: number;
  max?: number;
}

type DirectionalValues = NonNullable<SpacingControlProps["directionalValues"]>;

export const SpacingControl: React.FC<SpacingControlProps> = ({
  label,
  value,
  onChange,
  onDirectionalChange,
  directionalValues,
  min = 0,
  max = 100,
}) => {
  const [isIndividualMode, setIsIndividualMode] = useState(false);

  const hasDirectionalValues = directionalValues && onDirectionalChange;

  const [localUniform, setLocalUniform] = useState<string>(String(value));
  const [localSides, setLocalSides] = useState<{
    top: string;
    right: string;
    bottom: string;
    left: string;
  }>(() => ({
    top: String(directionalValues?.top ?? value),
    right: String(directionalValues?.right ?? value),
    bottom: String(directionalValues?.bottom ?? value),
    left: String(directionalValues?.left ?? value),
  }));

  // Sync local states when props change
  useEffect(() => {
    setLocalUniform(String(value));
  }, [value]);

  useEffect(() => {
    if (directionalValues) {
      setLocalSides({
        top: String(directionalValues.top),
        right: String(directionalValues.right),
        bottom: String(directionalValues.bottom),
        left: String(directionalValues.left),
      });
    }
  }, [
    directionalValues?.top,
    directionalValues?.right,
    directionalValues?.bottom,
    directionalValues?.left,
  ]);

  const clamp = (n: number) => Math.min(Math.max(n, min), max);
  const parseOr = (s: string, fallback = 0) => {
    const n = Number.parseFloat(s);
    return Number.isNaN(n) ? fallback : n;
  };

  // Uniform: commit only on blur (Enter triggers blur)
  const commitUniform = () => {
    const num = clamp(parseOr(localUniform, 0));
    setLocalUniform(String(num));
    onChange(num);
    if (hasDirectionalValues) {
      onDirectionalChange!({ top: num, right: num, bottom: num, left: num });
    }
  };

  // Individual: commit a single side on blur/Enter
  const commitSide = (side: keyof DirectionalValues) => {
    if (!hasDirectionalValues || !directionalValues) return;
    const updated = {
      top: clamp(parseOr(localSides.top)),
      right: clamp(parseOr(localSides.right)),
      bottom: clamp(parseOr(localSides.bottom)),
      left: clamp(parseOr(localSides.left)),
    };
    // Ensure local mirrors clamped values
    setLocalSides({
      top: String(updated.top),
      right: String(updated.right),
      bottom: String(updated.bottom),
      left: String(updated.left),
    });

    onDirectionalChange!(updated);
    const avg = Math.round(
      (updated.top + updated.right + updated.bottom + updated.left) / 4
    );
    onChange(avg);
  };

  const allSidesEqual =
    hasDirectionalValues && directionalValues
      ? directionalValues.top === directionalValues.right &&
        directionalValues.right === directionalValues.bottom &&
        directionalValues.bottom === directionalValues.left
      : true;

  // Auto-switch if incoming values are not equal
  useEffect(() => {
    if (hasDirectionalValues && !allSidesEqual && !isIndividualMode) {
      setIsIndividualMode(true);
    }
  }, [hasDirectionalValues, allSidesEqual, isIndividualMode]);

  const switchToIndividual = () => {
    setIsIndividualMode(true);

    if (hasDirectionalValues) {
      if (allSidesEqual) {
        // If all sides were equal, sync them with the current uniform value
        const uniform = {
          top: value,
          right: value,
          bottom: value,
          left: value,
        };
        setLocalSides({
          top: String(uniform.top),
          right: String(uniform.right),
          bottom: String(uniform.bottom),
          left: String(uniform.left),
        });
        onDirectionalChange!(uniform);
      } else {
        // Otherwise, just reflect whatever values we already have
        setLocalSides({
          top: String(directionalValues!.top),
          right: String(directionalValues!.right),
          bottom: String(directionalValues!.bottom),
          left: String(directionalValues!.left),
        });
      }
    }
  };

  const switchToUniform = () => {
    setIsIndividualMode(false);
    if (hasDirectionalValues) {
      onDirectionalChange!({
        top: value,
        right: value,
        bottom: value,
        left: value,
      });
    }
  };

  return (
    <div className="space-y-3">
      {hasDirectionalValues && (
        <div className="flex rounded-md border border-gray-200 bg-gray-50 p-1">
          <button
            type="button"
            onClick={switchToUniform}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-all ${
              !isIndividualMode
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Sides
          </button>
          <button
            type="button"
            onClick={switchToIndividual}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-all ${
              isIndividualMode
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Individual
          </button>
        </div>
      )}

      {/* Uniform controls */}
      {!isIndividualMode && (
        <div className="space-y-2">
          <Slider
            value={[value]}
            onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
            min={min}
            max={max}
            step={1}
            aria-label={`${label} slider`}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <Input
              aria-label={`${label} input`}
              type="number"
              value={localUniform}
              onChange={(e) => setLocalUniform(e.target.value)}
              onBlur={commitUniform}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  (e.currentTarget as HTMLInputElement).blur();
              }}
              min={min}
              max={max}
              className="flex-1 h-9"
            />
            <span className="text-xs text-gray-500 min-w-8">px</span>
          </div>
        </div>
      )}

      {/* Individual controls */}
      {isIndividualMode && hasDirectionalValues && directionalValues && (
        <div className="space-y-4">
          <div className="relative bg-gray-50 rounded-lg p-8">
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-md h-20 relative mx-10 my-8">
              {/* Top */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                <label className="text-xs text-gray-500 font-medium">Top</label>
                <Input
                  type="number"
                  value={localSides.top}
                  onChange={(e) =>
                    setLocalSides((s) => ({ ...s, top: e.target.value }))
                  }
                  onBlur={() => commitSide("top")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      (e.currentTarget as HTMLInputElement).blur();
                  }}
                  min={min}
                  max={max}
                  className="w-16 h-8 text-xs text-center"
                  aria-label="Top spacing"
                />
              </div>

              {/* Right */}
              <div className="absolute top-1/2 -right-10 -translate-y-1/2 flex flex-col items-center gap-1">
                <label className="text-xs text-gray-500 font-medium">
                  Right
                </label>
                <Input
                  type="number"
                  value={localSides.right}
                  onChange={(e) =>
                    setLocalSides((s) => ({ ...s, right: e.target.value }))
                  }
                  onBlur={() => commitSide("right")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      (e.currentTarget as HTMLInputElement).blur();
                  }}
                  min={min}
                  max={max}
                  className="w-16 h-8 text-xs text-center"
                  aria-label="Right spacing"
                />
              </div>

              {/* Bottom */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                <Input
                  type="number"
                  value={localSides.bottom}
                  onChange={(e) =>
                    setLocalSides((s) => ({ ...s, bottom: e.target.value }))
                  }
                  onBlur={() => commitSide("bottom")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      (e.currentTarget as HTMLInputElement).blur();
                  }}
                  min={min}
                  max={max}
                  className="w-16 h-8 text-xs text-center"
                  aria-label="Bottom spacing"
                />
                <label className="text-xs text-gray-500 font-medium">
                  Bottom
                </label>
              </div>

              {/* Left */}
              <div className="absolute top-1/2 -left-10 -translate-y-1/2 flex flex-col items-center gap-1">
                <label className="text-xs text-gray-500 font-medium">
                  Left
                </label>
                <Input
                  type="number"
                  value={localSides.left}
                  onChange={(e) =>
                    setLocalSides((s) => ({ ...s, left: e.target.value }))
                  }
                  onBlur={() => commitSide("left")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      (e.currentTarget as HTMLInputElement).blur();
                  }}
                  min={min}
                  max={max}
                  className="w-16 h-8 text-xs text-center"
                  aria-label="Left spacing"
                />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded">
                  Element
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (!hasDirectionalValues) return;
                const reset = { top: 0, right: 0, bottom: 0, left: 0 };
                setLocalSides({
                  top: "0",
                  right: "0",
                  bottom: "0",
                  left: "0",
                });
                onDirectionalChange!(reset);
                onChange(0);
              }}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              Reset All
            </button>
            <button
              type="button"
              onClick={() => {
                if (!hasDirectionalValues) return;

                // Parse local sides first
                const parsed = {
                  top: parseOr(localSides.top, 0),
                  right: parseOr(localSides.right, 0),
                  bottom: parseOr(localSides.bottom, 0),
                  left: parseOr(localSides.left, 0),
                };

                const maxValue = Math.max(
                  parsed.top,
                  parsed.right,
                  parsed.bottom,
                  parsed.left
                );

                const uniform = {
                  top: maxValue,
                  right: maxValue,
                  bottom: maxValue,
                  left: maxValue,
                };

                // Update both local + store
                setLocalSides({
                  top: String(maxValue),
                  right: String(maxValue),
                  bottom: String(maxValue),
                  left: String(maxValue),
                });
                onDirectionalChange!(uniform);
                onChange(maxValue);
              }}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              Make Equal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
