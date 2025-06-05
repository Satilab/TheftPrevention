import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { sobjectType, data } = await request.json()

    if (!sobjectType || !data) {
      return NextResponse.json({ error: "sobjectType and data are required" }, { status: 400 })
    }

    // First authenticate
    const authResponse = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}/api/salesforce/auth`, {
      method: "POST",
    })

    if (!authResponse.ok) {
      const authError = await authResponse.json()
      return NextResponse.json({ error: "Authentication failed", details: authError }, { status: 401 })
    }

    const authData = await authResponse.json()

    // Create record
    const createUrl = `${authData.instance_url}/services/data/v58.0/sobjects/${sobjectType}`

    const createResponse = await fetch(createUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      return NextResponse.json(
        {
          error: "Create failed",
          details: errorText,
          status: createResponse.status,
        },
        { status: createResponse.status },
      )
    }

    const result = await createResponse.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Create API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
