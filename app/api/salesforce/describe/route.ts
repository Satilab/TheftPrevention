import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { sobjectType } = await request.json()

    if (!sobjectType) {
      return NextResponse.json({ error: "sobjectType is required" }, { status: 400 })
    }

    // Check environment variables
    const loginUrl = process.env.SALESFORCE_LOGIN_URL
    const clientId = process.env.SALESFORCE_CLIENT_ID
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET
    const username = process.env.SALESFORCE_USERNAME
    const password = process.env.SALESFORCE_PASSWORD
    const securityToken = process.env.SALESFORCE_SECURITY_TOKEN

    if (!loginUrl || !clientId || !clientSecret || !username || !password || !securityToken) {
      return NextResponse.json(
        {
          error: "Missing Salesforce configuration",
          details: "Please check your environment variables",
        },
        { status: 500 },
      )
    }

    console.log("🔐 Authenticating for describe operation...")

    // Authenticate directly
    const authUrl = `${loginUrl}/services/oauth2/token`
    const authParams = new URLSearchParams({
      grant_type: "password",
      client_id: clientId,
      client_secret: clientSecret,
      username: username,
      password: password + securityToken,
    })

    const authResponse = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: authParams.toString(),
    })

    if (!authResponse.ok) {
      const authError = await authResponse.text()
      console.error("❌ Authentication failed:", authError)
      return NextResponse.json(
        {
          error: "Authentication failed",
          details: authError,
          status: authResponse.status,
        },
        { status: authResponse.status },
      )
    }

    const authData = await authResponse.json()
    console.log("✅ Authentication successful for describe")

    // Describe object
    const describeUrl = `${authData.instance_url}/services/data/v58.0/sobjects/${sobjectType}/describe`

    const describeResponse = await fetch(describeUrl, {
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
        "Content-Type": "application/json",
      },
    })

    if (!describeResponse.ok) {
      const errorText = await describeResponse.text()
      console.error("❌ Describe failed:", errorText)
      return NextResponse.json(
        {
          error: "Describe failed",
          details: errorText,
          status: describeResponse.status,
        },
        { status: describeResponse.status },
      )
    }

    const result = await describeResponse.json()
    console.log(`✅ Successfully described ${sobjectType}`)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Describe API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
