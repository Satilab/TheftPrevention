import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("🔐 Starting Salesforce authentication...")

    // Check if all required environment variables are present
    const requiredVars = {
      SALESFORCE_LOGIN_URL: process.env.SALESFORCE_LOGIN_URL,
      SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID,
      SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET,
      SALESFORCE_USERNAME: process.env.SALESFORCE_USERNAME,
      SALESFORCE_PASSWORD: process.env.SALESFORCE_PASSWORD,
      SALESFORCE_SECURITY_TOKEN: process.env.SALESFORCE_SECURITY_TOKEN,
    }

    const missingVars = Object.entries(requiredVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      console.error("❌ Missing environment variables:", missingVars)
      return NextResponse.json(
        {
          error: "Missing required environment variables",
          missing: missingVars,
        },
        { status: 500 },
      )
    }

    const loginUrl = process.env.SALESFORCE_LOGIN_URL || "https://login.salesforce.com"
    const tokenUrl = `${loginUrl}/services/oauth2/token`

    console.log("🌐 Token URL:", tokenUrl)
    console.log("👤 Username:", process.env.SALESFORCE_USERNAME)

    const params = new URLSearchParams({
      grant_type: "password",
      client_id: process.env.SALESFORCE_CLIENT_ID!,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
      username: process.env.SALESFORCE_USERNAME!,
      password: process.env.SALESFORCE_PASSWORD! + process.env.SALESFORCE_SECURITY_TOKEN!,
    })

    console.log("📤 Sending auth request...")

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    console.log("📥 Auth response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Auth error response:", errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: "Invalid response", details: errorText }
      }

      return NextResponse.json(
        {
          error: "Authentication failed",
          details: errorData,
          status: response.status,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("✅ Authentication successful!")
    console.log("🏢 Instance URL:", data.instance_url)

    return NextResponse.json({
      access_token: data.access_token,
      instance_url: data.instance_url,
      id: data.id,
      token_type: data.token_type,
      issued_at: data.issued_at,
      signature: data.signature,
    })
  } catch (error) {
    console.error("❌ Authentication error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
