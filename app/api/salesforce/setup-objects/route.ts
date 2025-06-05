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
    return authCache
  }

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

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: params.toString(),
  })

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status}`)
  }

  const data = await response.json()

  authCache = {
    access_token: data.access_token,
    instance_url: data.instance_url,
    expires_at: Date.now() + 3000000, // 50 minutes
  }

  return authCache
}

// Custom object definitions
const customObjects = {
  Guest__c: {
    label: "Guest",
    pluralLabel: "Guests",
    fields: {
      Room_No__c: { type: "Text", length: 10, label: "Room Number" },
      ID_Proof__c: { type: "Text", length: 255, label: "ID Proof" },
      Checkin_Time__c: { type: "DateTime", label: "Check-in Time" },
      Checkout_Time__c: { type: "DateTime", label: "Check-out Time" },
      Photo_URL__c: { type: "Url", label: "Photo URL" },
      Voice_Log_URL__c: { type: "Url", label: "Voice Log URL" },
    },
  },
  Staff__c: {
    label: "Staff",
    pluralLabel: "Staff",
    fields: {
      Role__c: {
        type: "Picklist",
        label: "Role",
        values: ["Security", "Receptionist", "Cleaner", "Manager"],
      },
      Photo_URL__c: { type: "Url", label: "Photo URL" },
      Shift_Start__c: { type: "Text", length: 10, label: "Shift Start" },
      Shift_End__c: { type: "Text", length: 10, label: "Shift End" },
    },
  },
  Room__c: {
    label: "Room",
    pluralLabel: "Rooms",
    fields: {
      Room_No__c: { type: "Text", length: 10, label: "Room Number", required: true },
      Status__c: {
        type: "Picklist",
        label: "Status",
        values: ["Vacant", "Occupied", "Alerted", "Maintenance"],
      },
      Guest__c: { type: "Text", length: 255, label: "Guest ID" },
    },
  },
  Face_Log__c: {
    label: "Face Log",
    pluralLabel: "Face Logs",
    fields: {
      Timestamp__c: { type: "DateTime", label: "Timestamp", required: true },
      Room__c: { type: "Text", length: 50, label: "Room" },
      Match_Type__c: {
        type: "Picklist",
        label: "Match Type",
        values: ["Guest", "Staff", "Unknown"],
      },
      Confidence__c: { type: "Number", label: "Confidence", precision: 5, scale: 2 },
      Face_Image_URL__c: { type: "Url", label: "Face Image URL" },
    },
  },
  Alert__c: {
    label: "Alert",
    pluralLabel: "Alerts",
    fields: {
      Alert_Type__c: {
        type: "Picklist",
        label: "Alert Type",
        values: ["Intruder", "Mismatch", "Tailgating"],
      },
      Status__c: {
        type: "Picklist",
        label: "Status",
        values: ["Open", "Responded", "Resolved", "Escalated"],
      },
      Face_Log__c: { type: "Text", length: 255, label: "Face Log ID" },
      Assigned_To__c: { type: "Text", length: 255, label: "Assigned To" },
      Receptionist_Comment__c: { type: "LongTextArea", length: 32768, label: "Receptionist Comment" },
      Owner_Review__c: { type: "LongTextArea", length: 32768, label: "Owner Review" },
    },
  },
  Audio_Log__c: {
    label: "Audio Log",
    pluralLabel: "Audio Logs",
    fields: {
      Linked_Guest__c: { type: "Text", length: 255, label: "Linked Guest" },
      Recording_URL__c: { type: "Url", label: "Recording URL" },
      Timestamp__c: { type: "DateTime", label: "Timestamp", required: true },
      Duration__c: { type: "Number", label: "Duration (seconds)", precision: 8, scale: 0 },
    },
  },
  Linen_Stock__c: {
    label: "Linen Stock",
    pluralLabel: "Linen Stock",
    fields: {
      Type__c: {
        type: "Picklist",
        label: "Type",
        values: ["Bedsheet", "Towel", "Pillow Cover", "Blanket"],
      },
      Room__c: { type: "Text", length: 50, label: "Room" },
      Status__c: {
        type: "Picklist",
        label: "Status",
        values: ["Issued", "Returned", "Damaged"],
      },
      Issue_Date__c: { type: "Date", label: "Issue Date" },
      Return_Date__c: { type: "Date", label: "Return Date" },
    },
  },
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    switch (action) {
      case "check-objects": {
        const auth = await getAuthToken()
        const status: { [key: string]: boolean } = {}

        for (const objectName of Object.keys(customObjects)) {
          try {
            const describeUrl = `${auth.instance_url}/services/data/v58.0/sobjects/${objectName}/describe`
            const response = await fetch(describeUrl, {
              headers: {
                Authorization: `Bearer ${auth.access_token}`,
                "Content-Type": "application/json",
              },
            })

            status[objectName] = response.ok
          } catch (error) {
            status[objectName] = false
          }
        }

        return NextResponse.json({ status })
      }

      case "create-objects": {
        const auth = await getAuthToken()
        const results: any[] = []

        for (const [objectName, objectDef] of Object.entries(customObjects)) {
          try {
            // Create the custom object
            const createObjectUrl = `${auth.instance_url}/services/data/v58.0/tooling/sobjects/CustomObject`
            const objectPayload = {
              FullName: objectName,
              Label: objectDef.label,
              PluralLabel: objectDef.pluralLabel,
              NameField: {
                Type: "AutoNumber",
                Label: `${objectDef.label} Number`,
                DisplayFormat: `${objectName.replace("__c", "")}-{0000}`,
                StartingNumber: 1,
              },
              DeploymentStatus: "Deployed",
              SharingModel: "ReadWrite",
            }

            const objectResponse = await fetch(createObjectUrl, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${auth.access_token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(objectPayload),
            })

            if (objectResponse.ok) {
              results.push({ object: objectName, status: "created" })

              // Wait a bit for object creation to complete
              await new Promise((resolve) => setTimeout(resolve, 2000))

              // Create fields for this object
              for (const [fieldName, fieldDef] of Object.entries(objectDef.fields)) {
                try {
                  const createFieldUrl = `${auth.instance_url}/services/data/v58.0/tooling/sobjects/CustomField`
                  const fieldPayload = {
                    FullName: `${objectName}.${fieldName}`,
                    Label: fieldDef.label,
                    Type: fieldDef.type,
                    Required: fieldDef.required || false,
                    ...(fieldDef.length && { Length: fieldDef.length }),
                    ...(fieldDef.precision && { Precision: fieldDef.precision }),
                    ...(fieldDef.scale && { Scale: fieldDef.scale }),
                    ...(fieldDef.values && {
                      ValueSet: {
                        ValueSetDefinition: {
                          Value: fieldDef.values.map((value: string) => ({
                            FullName: value,
                            Label: value,
                          })),
                        },
                      },
                    }),
                  }

                  const fieldResponse = await fetch(createFieldUrl, {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${auth.access_token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(fieldPayload),
                  })

                  if (fieldResponse.ok) {
                    results.push({ object: objectName, field: fieldName, status: "created" })
                  } else {
                    const errorText = await fieldResponse.text()
                    results.push({
                      object: objectName,
                      field: fieldName,
                      status: "failed",
                      error: errorText,
                    })
                  }

                  // Wait between field creations
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                } catch (error) {
                  results.push({
                    object: objectName,
                    field: fieldName,
                    status: "failed",
                    error: error instanceof Error ? error.message : "Unknown error",
                  })
                }
              }
            } else {
              const errorText = await objectResponse.text()
              results.push({ object: objectName, status: "failed", error: errorText })
            }
          } catch (error) {
            results.push({
              object: objectName,
              status: "failed",
              error: error instanceof Error ? error.message : "Unknown error",
            })
          }
        }

        return NextResponse.json({ results })
      }

      case "create-sample-data": {
        const auth = await getAuthToken()
        const results: any[] = []

        // Sample data for each object
        const sampleData = {
          Guest__c: [
            {
              Name: "John Smith",
              Room_No__c: "101",
              ID_Proof__c: "Passport: AB123456",
              Checkin_Time__c: new Date().toISOString(),
              Photo_URL__c: "https://example.com/photos/john-smith.jpg",
            },
            {
              Name: "Sarah Johnson",
              Room_No__c: "205",
              ID_Proof__c: "Driver License: DL789012",
              Checkin_Time__c: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              Photo_URL__c: "https://example.com/photos/sarah-johnson.jpg",
            },
            {
              Name: "Mike Wilson",
              Room_No__c: "302",
              ID_Proof__c: "National ID: NID345678",
              Photo_URL__c: "https://example.com/photos/mike-wilson.jpg",
            },
          ],
          Staff__c: [
            {
              Name: "Alice Security",
              Role__c: "Security",
              Shift_Start__c: "08:00",
              Shift_End__c: "16:00",
              Photo_URL__c: "https://example.com/photos/alice-security.jpg",
            },
            {
              Name: "Bob Reception",
              Role__c: "Receptionist",
              Shift_Start__c: "09:00",
              Shift_End__c: "17:00",
              Photo_URL__c: "https://example.com/photos/bob-reception.jpg",
            },
            {
              Name: "Carol Cleaner",
              Role__c: "Cleaner",
              Shift_Start__c: "06:00",
              Shift_End__c: "14:00",
              Photo_URL__c: "https://example.com/photos/carol-cleaner.jpg",
            },
          ],
          Room__c: [
            { Name: "Room 101", Room_No__c: "101", Status__c: "Occupied", Guest__c: "John Smith" },
            { Name: "Room 102", Room_No__c: "102", Status__c: "Vacant" },
            { Name: "Room 103", Room_No__c: "103", Status__c: "Alerted" },
            { Name: "Room 201", Room_No__c: "201", Status__c: "Vacant" },
            { Name: "Room 202", Room_No__c: "202", Status__c: "Occupied", Guest__c: "Sarah Johnson" },
            { Name: "Room 301", Room_No__c: "301", Status__c: "Vacant" },
            { Name: "Room 302", Room_No__c: "302", Status__c: "Occupied", Guest__c: "Mike Wilson" },
          ],
          Face_Log__c: [
            {
              Name: "Face Detection 1",
              Timestamp__c: new Date().toISOString(),
              Room__c: "101",
              Match_Type__c: "Guest",
              Confidence__c: 95.5,
              Face_Image_URL__c: "https://example.com/faces/face1.jpg",
            },
            {
              Name: "Face Detection 2",
              Timestamp__c: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              Room__c: "205",
              Match_Type__c: "Unknown",
              Confidence__c: 87.2,
              Face_Image_URL__c: "https://example.com/faces/face2.jpg",
            },
            {
              Name: "Face Detection 3",
              Timestamp__c: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
              Room__c: "Lobby",
              Match_Type__c: "Staff",
              Confidence__c: 92.8,
              Face_Image_URL__c: "https://example.com/faces/face3.jpg",
            },
          ],
          Alert__c: [
            {
              Name: "Security Alert 1",
              Alert_Type__c: "Intruder",
              Status__c: "Open",
              Assigned_To__c: "Bob Reception",
            },
            {
              Name: "Security Alert 2",
              Alert_Type__c: "Mismatch",
              Status__c: "Resolved",
              Assigned_To__c: "Alice Security",
              Receptionist_Comment__c: "False alarm - guest was wearing sunglasses",
              Owner_Review__c: "Confirmed resolution, no further action needed",
            },
          ],
          Audio_Log__c: [
            {
              Name: "Voice Recording 1",
              Timestamp__c: new Date().toISOString(),
              Duration__c: 120,
              Recording_URL__c: "https://example.com/audio/recording1.mp3",
            },
            {
              Name: "Voice Recording 2",
              Timestamp__c: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              Duration__c: 85,
              Recording_URL__c: "https://example.com/audio/recording2.mp3",
            },
          ],
          Linen_Stock__c: [
            {
              Name: "Bedsheet Set 1",
              Type__c: "Bedsheet",
              Room__c: "101",
              Status__c: "Issued",
              Issue_Date__c: new Date().toISOString().split("T")[0],
            },
            {
              Name: "Towel Set 1",
              Type__c: "Towel",
              Room__c: "205",
              Status__c: "Returned",
              Issue_Date__c: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              Return_Date__c: new Date().toISOString().split("T")[0],
            },
            {
              Name: "Pillow Cover 1",
              Type__c: "Pillow Cover",
              Status__c: "Damaged",
              Issue_Date__c: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
          ],
        }

        for (const [objectName, records] of Object.entries(sampleData)) {
          for (const record of records) {
            try {
              const createUrl = `${auth.instance_url}/services/data/v58.0/sobjects/${objectName}`
              const response = await fetch(createUrl, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${auth.access_token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(record),
              })

              if (response.ok) {
                const result = await response.json()
                results.push({
                  type: objectName,
                  name: record.Name,
                  status: "created",
                  id: result.id,
                })
              } else {
                const errorText = await response.text()
                results.push({
                  type: objectName,
                  name: record.Name,
                  status: "failed",
                  error: errorText,
                })
              }
            } catch (error) {
              results.push({
                type: objectName,
                name: record.Name,
                status: "failed",
                error: error instanceof Error ? error.message : "Unknown error",
              })
            }
          }
        }

        return NextResponse.json({ results })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ Salesforce setup error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
