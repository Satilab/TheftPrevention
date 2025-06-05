"use client"

import { useState, useEffect } from "react"
import { SalesforceRestClient } from "@/lib/salesforce-rest"

// Updated interfaces to match your Salesforce objects
export interface SalesforceGuest {
  Id?: string
  Name: string
  Photo_URL__c?: string
  Room_No__c?: string
  ID_Proof__c?: string
  Checkin_Time__c?: string
  Checkout_Time__c?: string
  Voice_Log_URL__c?: string
}

export interface SalesforceStaff {
  Id?: string
  Name: string
  Role__c?: string
  Photo_URL__c?: string
  Shift_Start__c?: string
  Shift_End__c?: string
}

export interface SalesforceRoom {
  Id?: string
  Room_No__c: string
  Status__c?: string
  Guest__c?: string
}

export interface SalesforceFaceLog {
  Id?: string
  Timestamp__c: string
  Room__c?: string
  Match_Type__c?: string
  Confidence__c?: number
  Face_Image_URL__c?: string
}

export interface SalesforceAlert {
  Id?: string
  Alert_Type__c?: string
  Face_Log__c?: string
  Status__c?: string
  Assigned_To__c?: string
  Receptionist_Comment__c?: string
  Owner_Review__c?: string
  CreatedDate?: string
}

export interface SalesforceAudioLog {
  Id?: string
  Linked_Guest__c?: string
  Recording_URL__c?: string
  Timestamp__c?: string
  Duration__c?: number
}

export interface SalesforceLinenStock {
  Id?: string
  Type__c?: string
  Room__c?: string
  Status__c?: string
  Issue_Date__c?: string
  Return_Date__c?: string
}

export function useSalesforceReal() {
  const [client] = useState(() => new SalesforceRestClient())
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastConnectionAttempt, setLastConnectionAttempt] = useState<Date | null>(null)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setIsLoading(true)
    setError(null)
    setLastConnectionAttempt(new Date())

    try {
      console.log("🔐 Checking Salesforce connection...")
      const connected = await client.authenticate()
      setIsConnected(connected)

      if (!connected) {
        const errorMsg = client.error || "Failed to connect to Salesforce"
        setError(errorMsg)
        console.warn("⚠️ Salesforce connection failed:", errorMsg)
      } else {
        console.log("✅ Salesforce connection successful")
        setError(null)
      }
    } catch (err) {
      setIsConnected(false)
      const errorMsg = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMsg)
      console.error("❌ Salesforce connection failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced safe query helper with better error handling
  const safeQuery = async (query: string, objectName: string): Promise<any[]> => {
    try {
      // Don't attempt queries if we're not connected
      if (!isConnected) {
        console.warn(`Not connected to Salesforce, returning empty ${objectName} array`)
        return []
      }

      console.log(`🔍 Querying ${objectName}:`, query)
      const result = await client.query(query)

      if (result && result.records) {
        console.log(`✅ Successfully fetched ${result.records.length} ${objectName} records`)
        return result.records
      } else {
        console.log(`📭 No ${objectName} records found`)
        return []
      }
    } catch (err) {
      console.error(`❌ Failed to fetch ${objectName}:`, err)

      // Handle specific error types
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase()

        // If object doesn't exist, return empty array
        if (
          errorMessage.includes("invalid sobject type") ||
          errorMessage.includes("no such column") ||
          errorMessage.includes("doesn't exist") ||
          errorMessage.includes("invalid field") ||
          errorMessage.includes("malformed query")
        ) {
          console.warn(`⚠️ ${objectName} object/fields don't exist in Salesforce, returning empty array`)
          return []
        }

        // If it's an auth error, try to reconnect
        if (
          errorMessage.includes("invalid_grant") ||
          errorMessage.includes("authentication") ||
          errorMessage.includes("unauthorized") ||
          errorMessage.includes("session expired")
        ) {
          console.warn(`🔄 Authentication issue detected, marking as disconnected`)
          setIsConnected(false)
          setError("Authentication expired, please reconnect")
          return []
        }

        // If it's a permission error
        if (
          errorMessage.includes("insufficient access") ||
          errorMessage.includes("permission") ||
          errorMessage.includes("access denied")
        ) {
          console.warn(`🔒 Permission issue for ${objectName}, returning empty array`)
          return []
        }
      }

      // For any other error, just return empty array and continue
      console.warn(`⚠️ Returning empty array for ${objectName} due to error:`, err)
      return []
    }
  }

  // Helper to check if we should attempt queries
  const shouldAttemptQuery = (): boolean => {
    if (!isConnected) {
      console.warn("⚠️ Not connected to Salesforce, skipping queries")
      return false
    }
    return true
  }

  // Guest operations with simplified queries
  const createGuest = async (guestData: SalesforceGuest): Promise<string | null> => {
    try {
      if (!isConnected) {
        await checkConnection()
        if (!isConnected) {
          throw new Error("Not connected to Salesforce")
        }
      }

      console.log("Creating guest:", guestData)
      const result = await client.create("Guest__c", guestData)
      console.log("Guest created with ID:", result.id)
      return result.id
    } catch (err) {
      console.error("Failed to create guest:", err)
      setError(err instanceof Error ? err.message : "Failed to create guest")
      return null
    }
  }

  const getGuests = async (): Promise<SalesforceGuest[]> => {
    if (!shouldAttemptQuery()) return []

    // Start with basic fields and add more if they exist
    return safeQuery(`SELECT Id, Name FROM Guest__c ORDER BY CreatedDate DESC LIMIT 100`, "guests")
  }

  const updateGuest = async (guestId: string, updates: Partial<SalesforceGuest>): Promise<boolean> => {
    try {
      if (!isConnected) {
        await checkConnection()
        if (!isConnected) {
          throw new Error("Not connected to Salesforce")
        }
      }

      console.log("Updating guest:", guestId, updates)
      const result = await client.update("Guest__c", guestId, updates)
      console.log("Guest updated successfully")
      return result
    } catch (err) {
      console.error("Failed to update guest:", err)
      setError(err instanceof Error ? err.message : "Failed to update guest")
      return false
    }
  }

  // Staff operations with simplified queries
  const createStaff = async (staffData: SalesforceStaff): Promise<string | null> => {
    try {
      if (!isConnected) {
        await checkConnection()
        if (!isConnected) {
          throw new Error("Not connected to Salesforce")
        }
      }

      console.log("Creating staff:", staffData)
      const result = await client.create("Staff__c", staffData)
      console.log("Staff created with ID:", result.id)
      return result.id
    } catch (err) {
      console.error("Failed to create staff:", err)
      setError(err instanceof Error ? err.message : "Failed to create staff")
      return null
    }
  }

  const getStaff = async (): Promise<SalesforceStaff[]> => {
    if (!shouldAttemptQuery()) return []

    return safeQuery(`SELECT Id, Name FROM Staff__c ORDER BY CreatedDate DESC LIMIT 100`, "staff")
  }

  // Room operations with simplified queries
  const createRoom = async (roomData: SalesforceRoom): Promise<string | null> => {
    try {
      if (!isConnected) {
        await checkConnection()
        if (!isConnected) {
          throw new Error("Not connected to Salesforce")
        }
      }

      console.log("Creating room:", roomData)
      const result = await client.create("Room__c", roomData)
      console.log("Room created with ID:", result.id)
      return result.id
    } catch (err) {
      console.error("Failed to create room:", err)
      setError(err instanceof Error ? err.message : "Failed to create room")
      return null
    }
  }

  const getRooms = async (): Promise<SalesforceRoom[]> => {
    if (!shouldAttemptQuery()) return []

    return safeQuery(`SELECT Id, Name FROM Room__c ORDER BY Name ASC LIMIT 200`, "rooms")
  }

  // Face Log operations with simplified queries
  const createFaceLog = async (faceLogData: SalesforceFaceLog): Promise<string | null> => {
    try {
      if (!isConnected) {
        await checkConnection()
        if (!isConnected) {
          throw new Error("Not connected to Salesforce")
        }
      }

      console.log("Creating face log:", faceLogData)
      const result = await client.create("Face_Log__c", faceLogData)
      console.log("Face log created with ID:", result.id)
      return result.id
    } catch (err) {
      console.error("Failed to create face log:", err)
      setError(err instanceof Error ? err.message : "Failed to create face log")
      return null
    }
  }

  const getFaceLogs = async (): Promise<SalesforceFaceLog[]> => {
    if (!shouldAttemptQuery()) return []

    return safeQuery(`SELECT Id, Name FROM Face_Log__c ORDER BY CreatedDate DESC LIMIT 100`, "face logs")
  }

  // Alert operations with simplified queries
  const createAlert = async (alertData: SalesforceAlert): Promise<string | null> => {
    try {
      if (!isConnected) {
        await checkConnection()
        if (!isConnected) {
          throw new Error("Not connected to Salesforce")
        }
      }

      console.log("Creating alert:", alertData)
      const result = await client.create("Alert__c", alertData)
      console.log("Alert created with ID:", result.id)
      return result.id
    } catch (err) {
      console.error("Failed to create alert:", err)
      setError(err instanceof Error ? err.message : "Failed to create alert")
      return null
    }
  }

  const getAlerts = async (): Promise<SalesforceAlert[]> => {
    if (!shouldAttemptQuery()) return []

    return safeQuery(`SELECT Id, Name FROM Alert__c ORDER BY CreatedDate DESC LIMIT 100`, "alerts")
  }

  const updateAlert = async (alertId: string, updates: Partial<SalesforceAlert>): Promise<boolean> => {
    try {
      if (!isConnected) {
        await checkConnection()
        if (!isConnected) {
          throw new Error("Not connected to Salesforce")
        }
      }

      console.log("Updating alert:", alertId, updates)
      const result = await client.update("Alert__c", alertId, updates)
      console.log("Alert updated successfully")
      return result
    } catch (err) {
      console.error("Failed to update alert:", err)
      setError(err instanceof Error ? err.message : "Failed to update alert")
      return false
    }
  }

  // Audio Log operations with simplified queries
  const createAudioLog = async (audioLogData: SalesforceAudioLog): Promise<string | null> => {
    try {
      if (!isConnected) {
        await checkConnection()
        if (!isConnected) {
          throw new Error("Not connected to Salesforce")
        }
      }

      console.log("Creating audio log:", audioLogData)
      const result = await client.create("Audio_Log__c", audioLogData)
      console.log("Audio log created with ID:", result.id)
      return result.id
    } catch (err) {
      console.error("Failed to create audio log:", err)
      setError(err instanceof Error ? err.message : "Failed to create audio log")
      return null
    }
  }

  const getAudioLogs = async (): Promise<SalesforceAudioLog[]> => {
    if (!shouldAttemptQuery()) return []

    return safeQuery(`SELECT Id, Name FROM Audio_Log__c ORDER BY CreatedDate DESC LIMIT 100`, "audio logs")
  }

  // Linen Stock operations with simplified queries
  const createLinenStock = async (linenData: SalesforceLinenStock): Promise<string | null> => {
    try {
      if (!isConnected) {
        await checkConnection()
        if (!isConnected) {
          throw new Error("Not connected to Salesforce")
        }
      }

      console.log("Creating linen stock:", linenData)
      const result = await client.create("Linen_Stock__c", linenData)
      console.log("Linen stock created with ID:", result.id)
      return result.id
    } catch (err) {
      console.error("Failed to create linen stock:", err)
      setError(err instanceof Error ? err.message : "Failed to create linen stock")
      return null
    }
  }

  const getLinenStock = async (): Promise<SalesforceLinenStock[]> => {
    if (!shouldAttemptQuery()) return []

    return safeQuery(`SELECT Id, Name FROM Linen_Stock__c ORDER BY CreatedDate DESC LIMIT 100`, "linen stock")
  }

  const updateLinenStock = async (linenId: string, updates: Partial<SalesforceLinenStock>): Promise<boolean> => {
    try {
      if (!isConnected) {
        await checkConnection()
        if (!isConnected) {
          throw new Error("Not connected to Salesforce")
        }
      }

      console.log("Updating linen stock:", linenId, updates)
      const result = await client.update("Linen_Stock__c", linenId, updates)
      console.log("Linen stock updated successfully")
      return result
    } catch (err) {
      console.error("Failed to update linen stock:", err)
      setError(err instanceof Error ? err.message : "Failed to update linen stock")
      return false
    }
  }

  return {
    isConnected,
    isLoading,
    error,
    lastConnectionAttempt,
    checkConnection,

    // Guest operations
    createGuest,
    getGuests,
    updateGuest,

    // Staff operations
    createStaff,
    getStaff,

    // Room operations
    createRoom,
    getRooms,

    // Face Log operations
    createFaceLog,
    getFaceLogs,

    // Alert operations
    createAlert,
    getAlerts,
    updateAlert,

    // Audio Log operations
    createAudioLog,
    getAudioLogs,

    // Linen Stock operations
    createLinenStock,
    getLinenStock,
    updateLinenStock,
  }
}
