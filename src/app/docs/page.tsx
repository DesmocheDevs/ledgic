"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function DocsPage() {
  const specUrl = "/api/openapi.json";
  return (
    <main style={{ padding: 16 }}>
      <SwaggerUI url={specUrl} docExpansion="none" defaultModelsExpandDepth={1} />
    </main>
  );
}
