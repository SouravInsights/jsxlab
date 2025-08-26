"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useEditorStore } from "../../store/editorStore";
import { PropertySidebar } from "../sidebar/PropertySidebar";
import { ComponentCanvas } from "../editor/ComponentCanvas";
import { Header } from "./Header";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Upload,
  Trash,
  Search,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { sampleComponents } from "@/data/sampleComponents";

// const LOCAL_KEY_PREFIX = "rce:component:";

type SavedMeta = {
  name: string;
  raw: string;
  updatedAt?: number | null;
};

export const EditorLayout: React.FC = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    parseComponentCode,
    component,
    loadSavedComponent,
    isLoading,
    serverError,
  } = useEditorStore();

  const [showCodeInput, setShowCodeInput] = useState<boolean>(!component);
  const [codeInput, setCodeInput] = useState<string>("");
  const [isParsingCode, setIsParsingCode] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const [savedList, setSavedList] = useState<
    Array<{ id: string; name: string; updatedAt: string; type: string }>
  >([]);
  const [search, setSearch] = useState("");
  const [selectedSaved] = useState<string | null>(null);
  const [loadingSaved, setLoadingSaved] = useState(false);

  const loadSavedList = async () => {
    setLoadingSaved(true);
    try {
      const components = await useEditorStore.getState().listSavedComponents();
      setSavedList(components);
    } catch (error) {
      console.error("Failed to load saved components:", error);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    loadSavedList();
    setShowCodeInput(!component);
  }, [component]);

  const filtered = useMemo(() => {
    if (!search.trim()) return savedList;
    const q = search.toLowerCase();
    return savedList.filter((s) => s.name.toLowerCase().includes(q));
  }, [savedList, search]);

  // parse uploaded file
  const handleFile = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result ?? "");
      setCodeInput(text);
      setShowCodeInput(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    reader.readAsText(file);
  };

  const handleParseComponent = async () => {
    if (!codeInput.trim()) return;
    setIsParsingCode(true);
    setParseError(null);
    try {
      await parseComponentCode(codeInput);
      setShowCodeInput(false);
    } catch (err) {
      setParseError(
        err instanceof Error ? err.message : "Failed to parse component"
      );
    } finally {
      setIsParsingCode(false);
    }
  };

  const handleLoadSaved = async (artifactId: string) => {
    try {
      const success = await loadSavedComponent(artifactId);
      if (success) {
        setShowCodeInput(false);
      } else {
        alert(`Failed to load component - ${serverError || "unknown error"}`);
      }
    } catch (error) {
      alert("Failed to load component");
    }
  };

  const handleDeleteSaved = async (artifactId: string, name: string) => {
    const confirmed = window.confirm(
      `Delete component "${name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await useEditorStore.getState().deleteComponent(artifactId);
      await loadSavedList(); // Refresh the list
      alert(`Deleted "${name}" successfully`);
    } catch (error) {
      alert(`Failed to delete "${name}"`);
    }
  };

  // const handleRenameSaved = (oldName: string) => {
  //   const newName = window.prompt("Rename component to:", oldName);
  //   if (!newName || newName.trim() === "" || newName === oldName) return;
  //   const keyOld = LOCAL_KEY_PREFIX + oldName;
  //   const keyNew = LOCAL_KEY_PREFIX + newName;
  //   const raw = localStorage.getItem(keyOld);
  //   if (!raw) return;
  //   localStorage.setItem(keyNew, raw);
  //   localStorage.removeItem(keyOld);
  //   loadSavedList();
  // };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />

      {showCodeInput ? (
        <div className="flex-1 flex items-start justify-center p-8">
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 grid grid-cols-3 gap-6">
            <div className="col-span-1 border-r pr-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Saved Components
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={loadSavedList}
                  disabled={loadingSaved}
                  title="Refresh"
                >
                  <ArrowUpRight size={14} />
                </Button>
              </div>

              <div className="mb-3">
                <label className="text-xs text-gray-600 block mb-1">
                  Search
                </label>
                <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md border border-gray-200 w-full">
                  <Search size={14} className="text-gray-400 mr-2" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name"
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
              </div>

              <div className="max-h-[48vh] overflow-auto">
                {loadingSaved ? (
                  <div className="text-sm text-gray-500">Loading...</div>
                ) : filtered.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No saved components
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {filtered.map((s) => (
                      <li
                        key={s.id}
                        className={`p-3 border rounded-md bg-white flex flex-col gap-2 ${
                          selectedSaved === s.id ? "ring-2 ring-blue-200" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-2 flex-1">
                            <FileText size={12} className="mt-1" />
                            <div>
                              <span className="font-medium text-gray-800 block">
                                {s.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(s.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleLoadSaved(s.id)}
                              disabled={isLoading}
                              className="text-xs"
                            >
                              {isLoading ? "Loading..." : "Load"}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteSaved(s.id, s.name)}
                              className="text-xs"
                            >
                              <Trash size={10} />
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="col-span-2 pl-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Import React Component
                  </h2>
                  <p className="text-sm text-gray-600">
                    Paste code, upload a file, or load a sample to start
                    editing.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept=".js,.jsx,.ts,.tsx"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Upload size={14} />
                      Upload
                    </Button>
                  </label>

                  <select
                    onChange={(e) => {
                      const key = e.target.value;
                      if (key) setCodeInput(sampleComponents[key]);
                    }}
                    className="border rounded-md text-sm px-2 py-1"
                  >
                    <option value="">Load Sample</option>
                    {Object.keys(sampleComponents).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Component Code
                </label>
                <textarea
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Paste your React component here..."
                  className="w-full h-[52vh] p-4 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {(parseError || serverError) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">
                    {parseError || serverError}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleParseComponent}
                  disabled={!codeInput.trim() || isLoading}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  {isLoading ? "Parsing..." : "Parse Component"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setCodeInput("")}
                  disabled={!codeInput.trim()}
                >
                  Clear
                </Button>

                <div className="ml-auto text-sm text-gray-500">
                  Tip: you can also load a saved component on the left.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div
            className={`
              bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
              ${sidebarOpen ? "w-80" : "w-0"}
            `}
          >
            <div className={`w-80 ${sidebarOpen ? "block" : "hidden"}`}>
              <PropertySidebar />
            </div>
          </div>

          {/* Sidebar Toggle */}
          <div className="flex flex-col">
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 bg-white border border-gray-200 rounded-r-md shadow-sm hover:bg-gray-50 flex items-center justify-center"
              title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {sidebarOpen ? (
                <ChevronLeft size={16} className="text-gray-600" />
              ) : (
                <ChevronRight size={16} className="text-gray-600" />
              )}
            </button>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative">
            <ComponentCanvas />

            {/* Canvas Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCodeInput(true)}
                className="flex items-center gap-2"
              >
                <Code size={16} />
                Edit Code
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
