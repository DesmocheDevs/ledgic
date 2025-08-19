import { NextResponse } from "next/server";

export function createErrorResponse(message: string, status: number = 500) {
  console.log(`Enviando error response: ${message} (status: ${status})`);
  return NextResponse.json({ error: message }, { status });
}

export function createSuccessResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}
