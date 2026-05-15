import { NextRequest, NextResponse } from "next/server";
import { inscriptionPayloadSchema } from "@/lib/inscription-schema";

function getAllowedOrigins(): string[] | null {
  const explicit = process.env.INSCRIPTION_ALLOWED_ORIGINS?.trim();
  if (explicit) {
    const list = explicit.split(",").map((s) => s.trim()).filter(Boolean);
    return list.length ? list : null;
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!site) return null;

  try {
    return [new URL(site).origin];
  } catch {
    return null;
  }
}

function isOriginAllowed(request: NextRequest): boolean {
  const allowed = getAllowedOrigins();
  if (!allowed?.length) return true;

  const origin = request.headers.get("origin");
  return !!origin && allowed.includes(origin);
}

function honeypotTriggered(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const raw = (body as Record<string, unknown>).organizationWebsite;

  if (raw === undefined || raw === null) return false;
  if (typeof raw !== "string") return true;

  return raw.trim() !== "";
}

export async function POST(request: NextRequest) {
  if (!isOriginAllowed(request)) {
    return NextResponse.json({ ok: false, error: "Cerere respinsă." }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Format invalid." }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Format invalid." }, { status: 400 });
  }

  if (honeypotTriggered(body)) {
    return NextResponse.json({ ok: true });
  }

  const parsed = inscriptionPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Date invalide sau incomplete." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
