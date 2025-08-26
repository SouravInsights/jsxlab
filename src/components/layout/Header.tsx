import React, { useState } from "react";
import { useEditorStore } from "../../store/editorStore";
import { Button } from "../ui/button";
import { Save, Download, Upload, RotateCcw, SaveAll } from "lucide-react";

export const Header: React.FC = () => {
  const {
    component,
    isDirty,
    isSaving,
    currentArtifactId,
    serverError,
    resetEditor,
    saveComponent,
    saveAsNewComponent,
  } = useEditorStore();

  const [showSaveAs, setShowSaveAs] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");

  const handleSave = async () => {
    if (!component) return;
    try {
      await saveComponent();
      // To be replaced with a toast notification
      alert(`Saved ${component.name} successfully`);
    } catch (err) {
      console.error("Save failed:", err);
      alert(`Save failed: ${serverError || "Unknown error"}`);
    }
  };

  const handleSaveAs = async () => {
    if (!component || !saveAsName.trim()) return;
    try {
      await saveAsNewComponent(saveAsName.trim());
      setShowSaveAs(false);
      setSaveAsName("");
      alert(`Saved as ${saveAsName} successfully`);
    } catch (err) {
      console.error("Save as failed:", err);
      alert(`Save as failed: ${serverError || "Unknown error"}`);
    }
  };

  const handleExport = () => {
    if (component) {
      const blob = new Blob([component.code], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${component.name}.jsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">
            React Component Editor
          </h1>
          {component && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>•</span>
              <span>{component.name}</span>
              {currentArtifactId && (
                <span className="text-blue-600 font-medium">Server Saved</span>
              )}
              {isDirty && (
                <span className="text-orange-600 font-medium">
                  Unsaved changes
                </span>
              )}
              {isSaving && (
                <span className="text-blue-600 font-medium">Saving...</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {component && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveAs(true)}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <SaveAll size={16} />
                Save As
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={resetEditor}
                className="flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      {showSaveAs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Save Component As</h3>
            <input
              type="text"
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              placeholder="Enter new component name"
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSaveAs(false);
                  setSaveAsName("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAs}
                disabled={!saveAsName.trim() || isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
