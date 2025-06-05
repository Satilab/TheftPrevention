import { NextResponse } from "next/server"

// Hardcoded credentials
const CREDENTIALS = {
  CLIENT_ID: "3MVG9rZjd7MXFdLh0O_TSAasg5IJ9jOumiIN8MsPieHSbw0ldm.gk1aWDXQKVfmE9sG6z6D1u7BLfwxG0BxzX",
  CLIENT_SECRET: "898FEF39D51297B928AB2AD668981CFEEA124DA6A1D6B5A9C1BB85DEAF3D3049",
  USERNAME: "suriraja822@agentforce.com",
  PASSWORD: "Sati@1010",
  SECURITY_TOKEN: "B9nS0HEyBE7YmWllqXCyiOJpY",
  LOGIN_URL: "https://login.salesforce.com",
}

// Cache for auth token
let authCache: {
  access_token: string
  instance_url: string
  expires_at: number
} | null = null

async function getAuthToken() {
  if (authCache && authCache.expires_at > Date.now()) {
    console.log("✅ Using cached auth token")
    return authCache
  }

  console.log("🔐 Getting fresh Salesforce auth token...")

  const clientId = process.env.SALESFORCE_CLIENT_ID || CREDENTIALS.CLIENT_ID
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET || CREDENTIALS.CLIENT_SECRET
  const username = process.env.SALESFORCE_USERNAME || CREDENTIALS.USERNAME
  const password = process.env.SALESFORCE_PASSWORD || CREDENTIALS.PASSWORD
  const securityToken = process.env.SALESFORCE_SECURITY_TOKEN || CREDENTIALS.SECURITY_TOKEN
  const loginUrl = process.env.SALESFORCE_LOGIN_URL || CREDENTIALS.LOGIN_URL

  const tokenUrl = `${loginUrl}/services/oauth2/token`

  const params = new URLSearchParams({
    grant_type: "password",
    client_id: clientId,
    client_secret: clientSecret,
    username: username,
    password: password + securityToken,
  })

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Salesforce auth failed:", errorText)
      throw new Error(`Authentication failed: ${response.status}`)
    }

    const data = await response.json()
    console.log("✅ Auth successful")

    authCache = {
      access_token: data.access_token,
      instance_url: data.instance_url,
      expires_at: Date.now() + 3000000, // 50 minutes
    }

    return authCache
  } catch (error) {
    console.error("❌ Auth error:", error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const { action, ...params } = await request.json()

    switch (action) {
      case "test": {
        try {
          const auth = await getAuthToken()

          // Test only your custom objects
          const testQueries = [
            "SELECT Id, Name FROM Guest__c LIMIT 1",
            "SELECT Id, Name FROM Staff__c LIMIT 1",
            "SELECT Id, Name FROM Room__c LIMIT 1",
            "SELECT Id, Name FROM Face_Log__c LIMIT 1",
            "SELECT Id, Name FROM Alert__c LIMIT 1",
            "SELECT Id, Name FROM Audio_Log__c LIMIT 1",
            "SELECT Id, Name FROM Linen_Stock__c LIMIT 1",
          ]

          const results = []

          for (const query of testQueries) {
            const objectName = query.match(/FROM (\w+__c)/)?.[1] || "Unknown"

            try {
              const queryUrl = `${auth.instance_url}/services/data/v58.0/query?q=${encodeURIComponent(query)}`

              const response = await fetch(queryUrl, {
                headers: {
                  Authorization: `Bearer ${auth.access_token}`,
                  "Content-Type": "application/json",
                },
              })

              if (response.ok) {
                const data = await response.json()
                results.push({
                  object: objectName,
                  status: "✅ Available",
                  records: data.totalSize || 0,
                })
              } else {
                results.push({
                  object: objectName,
                  status: "❌ Not found",
                })
              }
            } catch (err) {
              results.push({
                object: objectName,
                status: "❌ Error",
              })
            }
          }

          return NextResponse.json({
            success: true,
            message: "Connection test completed",
            instance_url: auth.instance_url,
            custom_objects: results,
            available_objects: results.filter((r) => r.status.includes("✅")).length,
            total_objects: results.length,
          })
        } catch (authError) {
          return NextResponse.json(
            {
              error: authError instanceof Error ? authError.message : "Authentication failed",
              auth_success: false,
            },
            { status: 401 },
          )
        }
      }

      case "query": {
        const { query } = params
        if (!query) {
          return NextResponse.json({ error: "Query is required" }, { status: 400 })
        }

        const auth = await getAuthToken()
        const queryUrl = `${auth.instance_url}/services/data/v58.0/query?q=${encodeURIComponent(query)}`

        const response = await fetch(queryUrl, {
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          return NextResponse.json(
            {
              error: "Query failed",
              details: errorText,
            },
            { status: response.status },
          )
        }

        const data = await response.json()
        return NextResponse.json(data)
      }

      case "create": {
        const { sobjectType, data } = params
        if (!sobjectType || !data) {
          return NextResponse.json({ error: "sobjectType and data are required" }, { status: 400 })
        }

        const auth = await getAuthToken()
        const createUrl = `${auth.instance_url}/services/data/v58.0/sobjects/${sobjectType}`

        const response = await fetch(createUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorText = await response.text()
          return NextResponse.json(
            {
              error: "Create failed",
              details: errorText,
            },
            { status: response.status },
          )
        }

        const result = await response.json()
        return NextResponse.json(result)
      }

      case "update": {
        const { sobjectType, id, data } = params
        if (!sobjectType || !id || !data) {
          return NextResponse.json({ error: "sobjectType, id, and data are required" }, { status: 400 })
        }

        const auth = await getAuthToken()
        const updateUrl = `${auth.instance_url}/services/data/v58.0/sobjects/${sobjectType}/${id}`

        const response = await fetch(updateUrl, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorText = await response.text()
          return NextResponse.json(
            {
              error: "Update failed",
              details: errorText,
            },
            { status: response.status },
          )
        }

        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ Salesforce API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
