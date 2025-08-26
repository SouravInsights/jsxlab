"use client";

import { useEffect } from "react";
import { EditorLayout } from "../components/layout/EditorLayout";
import { initializePropertySystem } from "../lib/properties";

export default function Home() {
  useEffect(() => {
    initializePropertySystem().catch(console.error);
  }, []);

  return <EditorLayout />;
}
