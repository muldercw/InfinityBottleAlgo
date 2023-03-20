import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import type { Pour, Drink } from "@/lib/bottle";

export const dynamic = "force-dynamic";

const DATA_DIR = process.env.DATA_DIR ?? path.join(/* turbopackIgnore: true */ process.cwd(), "data");
const BOTTLE_FILE = path.join(DATA_DIR, "bottle.json");

interface BottleData {
  pours: Pour[];
  drinks: Drink[];
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readBottle(): BottleData {
  ensureDataDir();
  if (!fs.existsSync(BOTTLE_FILE)) return { pours: [], drinks: [] };
  const raw = fs.readFileSync(BOTTLE_FILE, "utf-8");
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    return { pours: parsed, drinks: [] };
  }
  return { pours: parsed.pours ?? [], drinks: parsed.drinks ?? [] };
}

function writeBottle(data: BottleData) {
  ensureDataDir();
  fs.writeFileSync(BOTTLE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const data = readBottle();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = readBottle();

  if (body.type === "drink") {
    const { volumeOz, note } = body;
    if (typeof volumeOz !== "number" || volumeOz <= 0) {
      return NextResponse.json({ error: "Volume must be positive" }, { status: 400 });
    }
    const totalPoured = data.pours.reduce((s, p) => s + p.volumeOz, 0);
    const totalDrunk = data.drinks.reduce((s, d) => s + d.volumeOz, 0);
    const remaining = totalPoured - totalDrunk;
    if (volumeOz > remaining + 0.001) {
      return NextResponse.json(
        { error: `Only ${remaining.toFixed(2)} oz remaining in the bottle` },
        { status: 400 },
      );
    }
    const drink: Drink = {
      id: crypto.randomUUID(),
      volumeOz,
      note: (note ?? "").trim(),
      drankAt: new Date().toISOString(),
    };
    data.drinks.push(drink);
    writeBottle(data);
    return NextResponse.json(drink, { status: 201 });
  }

  const { name, age, proof, volumeOz } = body;
  if (!name || typeof age !== "number" || typeof proof !== "number" || typeof volumeOz !== "number") {
    return NextResponse.json({ error: "Invalid pour data" }, { status: 400 });
  }
  if (proof <= 0 || volumeOz <= 0 || age < 0) {
    return NextResponse.json({ error: "Values must be positive" }, { status: 400 });
  }
  const pour: Pour = {
    id: crypto.randomUUID(),
    name: name.trim(),
    age,
    proof,
    volumeOz,
    addedAt: new Date().toISOString(),
  };
  data.pours.push(pour);
  writeBottle(data);
  return NextResponse.json(pour, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const data = readBottle();
  const poursBefore = data.pours.length;
  const drinksBefore = data.drinks.length;

  data.pours = data.pours.filter((p) => p.id !== id);
  data.drinks = data.drinks.filter((d) => d.id !== id);

  if (data.pours.length === poursBefore && data.drinks.length === drinksBefore) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  writeBottle(data);
  return NextResponse.json({ ok: true });
}
