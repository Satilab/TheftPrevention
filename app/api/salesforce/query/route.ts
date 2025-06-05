import { type NextRequest, NextResponse } from "next/server"

let cachedAuth: { access_token: string; instance_url: string; expires_at: number } | null = null

async function getAuthToken() {
  // Check if we have a valid cached token
  if (cachedAuth && cachedAuth.expires_at > Date.now()) {
    return cachedAuth
  }

  console.log("🔐 Getting fresh auth token...")

  const loginUrl = process.env.SALESFORCE_LOGIN_URL || "https://login.salesforce.com"
  const tokenUrl = `${loginUrl}/services/oauth2/token`

  const params = new URLSearchParams({
    grant_type: "password",
    client_id: process.env.SALESFORCE_CLIENT_ID!,
    client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
    username: process.env.SALESFORCE_USERNAME!,
    password: process.env.SALESFORCE_PASSWORD! + process.env.SALESFORCE_SECURITY_TOKEN!,
  })

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("❌ Auth failed:", errorText)
    throw new Error(`Authentication failed: ${response.status} ${errorText}`)
  }

  const data = await response.json()

  // Cache the token for 1 hour
  cachedAuth = {
    access_token: data.access_token,
    instance_url: data.instance_url,
    expires_at: Date.now() + 3600000, // 1 hour
  }

  console.log("✅ Auth token obtained")
  return cachedAuth
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    console.log("🔍 Executing SOQL query:", query)

    // Get authentication token
    const auth = await getAuthToken()

    // Execute the query
    const queryUrl = `${auth.instance_url}/services/data/v58.0/query?q=${encodeURIComponent(query)}`
    console.log("🌐 Query URL:", queryUrl)

    const response = await fetch(queryUrl, {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        "Content-Type": "application/json",
      },
    })

    console.log("📥 Query response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Query failed:", errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }

      return NextResponse.json(
        {
          error: "Query failed",
          details: errorData,
          status: response.status,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("✅ Query successful, found", data.totalSize, "records")

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Query API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
