export const sampleComponents: Record<string, string> = {
  Button: `import React from 'react';

export default function Button({ label = "Click Me" }) {
  return (
    <button
      style={{
        padding: "12px 24px",
        backgroundColor: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "500",
        cursor: "pointer"
      }}
    >
      {label}
    </button>
  );
}
`,

  Card: `import React from 'react';

export default function Card({ title = "Card Title", children }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        maxWidth: "300px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "600" }}>
        {title}
      </h3>
      <div>{children || "This is a sample card."}</div>
    </div>
  );
}
`,

  Modal: `import React, { useState } from 'react';

export default function Modal() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        style={{
          padding: "10px 16px",
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
        onClick={() => setOpen(true)}
      >
        Open Modal
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "300px"
            }}
          >
            <h2 style={{ marginTop: 0 }}>Modal Title</h2>
            <p>This is a modal content.</p>
            <button
              onClick={() => setOpen(false)}
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#ef4444",
                color: "white",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
`,

  Tabs: `import React, { useState } from 'react';

export default function Tabs() {
  const [active, setActive] = useState("Tab 1");

  const tabs = ["Tab 1", "Tab 2", "Tab 3"];

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            style={{
              padding: "8px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: active === tab ? "#3b82f6" : "white",
              color: active === tab ? "white" : "black",
              cursor: "pointer"
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>
        <p>Content of {active}</p>
      </div>
    </div>
  );
}
`,

  Accordion: `import React, { useState } from 'react';

export default function Accordion() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        maxWidth: "300px"
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "12px",
          textAlign: "left",
          border: "none",
          background: "#f9fafb",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        Accordion Title
      </button>
      {open && (
        <div style={{ padding: "12px" }}>
          <p>This is the accordion content.</p>
        </div>
      )}
    </div>
  );
}
`,

  Badge: `import React from 'react';

export default function Badge({ text = "New" }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: "9999px",
        backgroundColor: "#f59e0b",
        color: "white",
        fontSize: "12px",
        fontWeight: "600"
      }}
    >
      {text}
    </span>
  );
}
`,

  ProgressBar: `import React from 'react';

export default function ProgressBar({ value = 50 }) {
  return (
    <div style={{ width: "100%", backgroundColor: "#e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
      <div
        style={{
          width: value + "%",
          height: "16px",
          backgroundColor: "#3b82f6"
        }}
      />
    </div>
  );
}
`,
};
