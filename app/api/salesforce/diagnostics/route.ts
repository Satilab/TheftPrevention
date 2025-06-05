import { NextResponse } from "next/server"

export async function POST() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
      },
      environmentVariables: {
        SALESFORCE_LOGIN_URL: {
          value: process.env.SALESFORCE_LOGIN_URL || null,
          isSet: !!process.env.SALESFORCE_LOGIN_URL,
          length: process.env.SALESFORCE_LOGIN_URL?.length || 0,
        },
        SALESFORCE_CLIENT_ID: {
          value: process.env.SALESFORCE_CLIENT_ID ? `${process.env.SALESFORCE_CLIENT_ID.substring(0, 10)}...` : null,
          isSet: !!process.env.SALESFORCE_CLIENT_ID,
          length: process.env.SALESFORCE_CLIENT_ID?.length || 0,
        },
        SALESFORCE_CLIENT_SECRET: {
          value: process.env.SALESFORCE_CLIENT_SECRET ? "***HIDDEN***" : null,
          isSet: !!process.env.SALESFORCE_CLIENT_SECRET,
          length: process.env.SALESFORCE_CLIENT_SECRET?.length || 0,
        },
        SALESFORCE_USERNAME: {
          value: process.env.SALESFORCE_USERNAME || null,
          isSet: !!process.env.SALESFORCE_USERNAME,
          length: process.env.SALESFORCE_USERNAME?.length || 0,
        },
        SALESFORCE_PASSWORD: {
          value: process.env.SALESFORCE_PASSWORD ? "***HIDDEN***" : null,
          isSet: !!process.env.SALESFORCE_PASSWORD,
          length: process.env.SALESFORCE_PASSWORD?.length || 0,
        },
        SALESFORCE_SECURITY_TOKEN: {
          value: process.env.SALESFORCE_SECURITY_TOKEN ? "***HIDDEN***" : null,
          isSet: !!process.env.SALESFORCE_SECURITY_TOKEN,
          length: process.env.SALESFORCE_SECURITY_TOKEN?.length || 0,
        },
        NEXT_PUBLIC_SALESFORCE_LOGIN_URL: {
          value: process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL || null,
          isSet: !!process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL,
          length: process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL?.length || 0,
        },
      },
      connectionTest: null as any,
    }

    // Test connection if all variables are present
    const requiredVars = [
      "SALESFORCE_LOGIN_URL",
      "SALESFORCE_CLIENT_ID",
      "SALESFORCE_CLIENT_SECRET",
      "SALESFORCE_USERNAME",
      "SALESFORCE_PASSWORD",
    ]

    const missingVars = requiredVars.filter((varName) => !process.env[varName])

    if (missingVars.length === 0) {
      try {
        const loginUrl = process.env.SALESFORCE_LOGIN_URL || "https://login.salesforce.com"
        const tokenUrl = `${loginUrl}/services/oauth2/token`

        const params = new URLSearchParams({
          grant_type: "password",
          client_id: process.env.SALESFORCE_CLIENT_ID!,
          client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
          username: process.env.SALESFORCE_USERNAME!,
          password: process.env.SALESFORCE_PASSWORD! + (process.env.SALESFORCE_SECURITY_TOKEN || ""),
        })

        const response = await fetch(tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: params.toString(),
        })

        const responseText = await response.text()

        diagnostics.connectionTest = {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          url: tokenUrl,
          responseLength: responseText.length,
          response: response.ok ? "Authentication successful" : responseText,
        }
      } catch (error) {
        diagnostics.connectionTest = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        }
      }
    } else {
      diagnostics.connectionTest = {
        success: false,
        error: `Missing required environment variables: ${missingVars.join(", ")}`,
        missingVars,
      }
    }

    return NextResponse.json({
      success: diagnostics.connectionTest?.success || false,
      diagnostics,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Diagnostics failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
