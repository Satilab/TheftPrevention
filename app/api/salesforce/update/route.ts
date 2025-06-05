import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { sobjectType, id, data } = await request.json()

    if (!sobjectType || !id || !data) {
      return NextResponse.json({ error: "sobjectType, id, and data are required" }, { status: 400 })
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

    // Update record
    const updateUrl = `${authData.instance_url}/services/data/v58.0/sobjects/${sobjectType}/${id}`

    const updateResponse = await fetch(updateUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      return NextResponse.json(
        {
          error: "Update failed",
          details: errorText,
          status: updateResponse.status,
        },
        { status: updateResponse.status },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
