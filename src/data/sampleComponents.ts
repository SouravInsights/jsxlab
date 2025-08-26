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
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        backgroundColor: "white"
      }}
    >
      <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "600", color: "#1f2937" }}>
        {title}
      </h3>
      <div style={{ color: "#6b7280", fontSize: "14px" }}>
        {children || "This is a sample card with some descriptive text."}
      </div>
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

  Hero: `import React from 'react';

export default function Hero() {
  return (
    <div
      style={{
        padding: "80px 24px",
        textAlign: "center",
        backgroundColor: "#f8fafc",
        borderRadius: "12px"
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          fontWeight: "800",
          color: "#1e293b",
          margin: "0 0 16px",
          lineHeight: "1.1"
        }}
      >
        Welcome to Our Platform
      </h1>
      <p
        style={{
          fontSize: "20px",
          color: "#64748b",
          margin: "0 0 32px",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        Build amazing products with our comprehensive suite of tools and services.
      </p>
      <button
        style={{
          padding: "16px 32px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >
        Get Started
      </button>
    </div>
  );
}
`,

  FeatureCard: `import React from 'react';

export default function FeatureCard() {
  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        textAlign: "center",
        maxWidth: "320px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          backgroundColor: "#dbeafe",
          borderRadius: "12px",
          margin: "0 auto 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: "#3b82f6",
            borderRadius: "6px"
          }}
        />
      </div>
      <h3
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#1e293b",
          margin: "0 0 12px"
        }}
      >
        Fast Performance
      </h3>
      <p
        style={{
          color: "#64748b",
          fontSize: "16px",
          lineHeight: "1.6",
          margin: "0"
        }}
      >
        Lightning-fast loading times and optimized performance for the best user experience.
      </p>
    </div>
  );
}
`,

  Testimonial: `import React from 'react';

export default function Testimonial() {
  return (
    <div
      style={{
        padding: "32px",
        backgroundColor: "#f1f5f9",
        borderRadius: "16px",
        maxWidth: "500px",
        border: "1px solid #e2e8f0"
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "24px",
            color: "#f59e0b",
            marginBottom: "12px"
          }}
        >
          ★★★★★
        </div>
        <p
          style={{
            fontSize: "18px",
            color: "#334155",
            fontStyle: "italic",
            lineHeight: "1.6",
            margin: "0"
          }}
        >
          "This product has completely transformed how we work. The interface is intuitive and the results are outstanding."
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "#94a3b8",
            borderRadius: "50%"
          }}
        />
        <div>
          <div
            style={{
              fontWeight: "600",
              color: "#1e293b",
              fontSize: "16px"
            }}
          >
            Sarah Johnson
          </div>
          <div
            style={{
              color: "#64748b",
              fontSize: "14px"
            }}
          >
            Product Manager
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  PricingCard: `import React from 'react';

export default function PricingCard() {
  return (
    <div
      style={{
        padding: "32px 24px",
        backgroundColor: "white",
        border: "2px solid #e2e8f0",
        borderRadius: "16px",
        textAlign: "center",
        maxWidth: "300px",
        position: "relative"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-12px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#10b981",
          color: "white",
          padding: "4px 16px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600"
        }}
      >
        Popular
      </div>
      <h3
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#1e293b",
          margin: "16px 0 8px"
        }}
      >
        Pro Plan
      </h3>
      <div
        style={{
          fontSize: "48px",
          fontWeight: "800",
          color: "#3b82f6",
          margin: "0 0 24px"
        }}
      >
        $29
        <span style={{ fontSize: "16px", color: "#64748b", fontWeight: "400" }}>
          /month
        </span>
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: "0",
          margin: "0 0 32px",
          textAlign: "left"
        }}
      >
        <li style={{ padding: "8px 0", color: "#475569" }}>✓ Unlimited projects</li>
        <li style={{ padding: "8px 0", color: "#475569" }}>✓ Priority support</li>
        <li style={{ padding: "8px 0", color: "#475569" }}>✓ Advanced analytics</li>
      </ul>
      <button
        style={{
          width: "100%",
          padding: "12px 24px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >
        Choose Plan
      </button>
    </div>
  );
}
`,

  Newsletter: `import React from 'react';

export default function Newsletter() {
  return (
    <div
      style={{
        padding: "40px 32px",
        backgroundColor: "#1e293b",
        borderRadius: "12px",
        textAlign: "center",
        maxWidth: "500px"
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "white",
          margin: "0 0 12px"
        }}
      >
        Stay Updated
      </h2>
      <p
        style={{
          color: "#94a3b8",
          fontSize: "16px",
          margin: "0 0 24px"
        }}
      >
        Get the latest updates and exclusive content delivered to your inbox.
      </p>
      <div
        style={{
          display: "flex",
          gap: "12px",
          maxWidth: "400px",
          margin: "0 auto"
        }}
      >
        <input
          type="email"
          placeholder="Enter your email"
          style={{
            flex: "1",
            padding: "12px 16px",
            border: "1px solid #475569",
            borderRadius: "8px",
            backgroundColor: "#334155",
            color: "white",
            fontSize: "14px"
          }}
        />
        <button
          style={{
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}
`,

  StatsCard: `import React from 'react';

export default function StatsCard() {
  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        textAlign: "center",
        minWidth: "200px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}
    >
      <div
        style={{
          fontSize: "36px",
          fontWeight: "800",
          color: "#059669",
          margin: "0 0 8px"
        }}
      >
        10,000+
      </div>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#1e293b",
          margin: "0 0 4px"
        }}
      >
        Happy Customers
      </div>
      <div
        style={{
          fontSize: "14px",
          color: "#64748b"
        }}
      >
        Across 50+ countries
      </div>
    </div>
  );
}
`,

  Alert: `import React from 'react';

export default function Alert() {
  return (
    <div
      style={{
        padding: "16px 20px",
        backgroundColor: "#dbeafe",
        border: "1px solid #93c5fd",
        borderRadius: "8px",
        maxWidth: "400px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "#3b82f6",
          borderRadius: "50%",
          flexShrink: "0",
          marginTop: "2px"
        }}
      />
      <div>
        <div
          style={{
            fontWeight: "600",
            color: "#1e40af",
            fontSize: "16px",
            margin: "0 0 4px"
          }}
        >
          New Feature Available
        </div>
        <div
          style={{
            color: "#1e40af",
            fontSize: "14px",
            lineHeight: "1.5"
          }}
        >
          Check out our latest feature that helps you work more efficiently.
        </div>
      </div>
    </div>
  );
}
`,
};
