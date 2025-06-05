"use client"

// Salesforce REST API client that works through our unified API route
export class SalesforceRestClient {
  private lastError: string | null = null

  get error() {
    return this.lastError
  }

  async authenticate() {
    try {
      this.lastError = null
      console.log("🔐 Testing Salesforce connection...")

      const response = await fetch("/api/salesforce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "test" }),
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
        }

        this.lastError = errorData.error || `Authentication failed: ${response.statusText}`
        console.error("❌ Auth failed:", this.lastError)
        return false
      }

      const data = await response.json()
      console.log("✅ Authentication successful:", data.message)
      return true
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Unknown authentication error"
      console.error("❌ Salesforce authentication error:", error)
      return false
    }
  }

  async query(soql: string) {
    try {
      this.lastError = null
      console.log("🔍 Executing query:", soql)

      const response = await fetch("/api/salesforce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "query", query: soql }),
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
        }

        this.lastError = errorData.error || `Query failed: ${response.statusText}`
        console.error("❌ Query failed:", this.lastError)
        throw new Error(this.lastError)
      }

      const data = await response.json()
      console.log("✅ Query successful, records:", data.totalSize || 0)
      return data
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Unknown query error"
      console.error("❌ Query error:", error)
      throw error
    }
  }

  async create(sobjectType: string, data: any) {
    try {
      this.lastError = null
      console.log("➕ Creating record:", sobjectType, data)

      const response = await fetch("/api/salesforce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "create", sobjectType, data }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        this.lastError = errorData.error || `Create failed: ${response.statusText}`
        console.error("❌ Create failed:", this.lastError)
        throw new Error(this.lastError)
      }

      const result = await response.json()
      console.log("✅ Record created with ID:", result.id)
      return result
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Unknown create error"
      console.error("❌ Create error:", error)
      throw error
    }
  }

  async update(sobjectType: string, id: string, data: any) {
    try {
      this.lastError = null
      console.log("✏️ Updating record:", sobjectType, id, data)

      const response = await fetch("/api/salesforce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "update", sobjectType, id, data }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        this.lastError = errorData.error || `Update failed: ${response.statusText}`
        console.error("❌ Update failed:", this.lastError)
        throw new Error(this.lastError)
      }

      console.log("✅ Record updated successfully")
      return true
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : "Unknown update error"
      console.error("❌ Update error:", error)
      throw error
    }
  }

  async describeObject(sobjectType: string) {
    // For now, just return a basic structure since describe was causing issues
    return {
      name: sobjectType,
      fields: [{ name: "Id" }, { name: "Name" }],
    }
  }
}
