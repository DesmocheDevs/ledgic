import { NextResponse } from "next/server";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const apiFolder = path.resolve(process.cwd(), "src/app/api");
    const apis = [
      path.join(apiFolder, "**/*.ts"),
      path.join(apiFolder, "**/*.tsx"),
      path.join(apiFolder, "**/*.js"),
      // Exclude this route handler file
      "!" + path.join(apiFolder, "openapi.json/**"),
    ];

    const spec = swaggerJsdoc({
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Ledgic API",
          version: "1.0.0",
          description:
            "Documentación de APIs para Inventory, Materials, Products, Purchasing, Production, BOM, Ledger y Companies.",
        },
        servers: [
          { url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" },
        ],
        tags: [
          { name: "Inventory" },
          { name: "Materials" },
          { name: "Products" },
          { name: "Purchasing" },
          { name: "Production" },
          { name: "BOM" },
          { name: "Ledger" },
          { name: "Companies" },
        ],
        components: {},
      },
      apis,
    });

    return NextResponse.json(spec);
  } catch (err) {
    console.error("/api/openapi.json generation error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
