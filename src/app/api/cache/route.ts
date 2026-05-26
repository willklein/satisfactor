import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const cachePath = path.join(process.cwd(), "public", "cache", "calculated-totals.json")
    const dir = path.dirname(cachePath)

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2), "utf-8")
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
