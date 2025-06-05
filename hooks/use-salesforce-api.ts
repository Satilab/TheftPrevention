"use client"

import { useState } from "react"

export interface SalesforceContact {
  Id?: string
  FirstName: string
  LastName: string
  Email: string
  Phone?: string
  Hotel_Guest_ID__c?: string
  Room_Number__c?: string
  Check_In_Date__c?: string
  Check_Out_Date__c?: string
  Guest_Status__c?: string
}

export interface SecurityCase {
  Id?: string
  Subject: string
  Description: string
  Status: string
  Priority: string
  Type: string
  ContactId?: string
  Room_Number__c?: string
  Incident_Time__c?: string
  Alert_Type__c?: string
  Confidence_Score__c?: number
  Evidence_URL__c?: string
  Assigned_Staff__c?: string
}

export function useSalesforceApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkConnection = async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/salesforce?action=check-connection")
      const data = await response.json()

      if (!data.connected) {
        setError(data.error || "Failed to connect to Salesforce")
        return false
      }

      return true
    } catch (err) {
      setError("Failed to check Salesforce connection")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getSecurityCases = async (): Promise<SecurityCase[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/salesforce?action=get-cases")
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return []
      }

      return data.cases || []
    } catch (err) {
      setError("Failed to fetch security cases")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const findContactByEmail = async (email: string): Promise<SalesforceContact | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/salesforce?action=find-contact&email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return null
      }

      return data.contact || null
    } catch (err) {
      setError("Failed to find contact")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const createContact = async (contact: SalesforceContact): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/salesforce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create-contact",
          data: contact,
        }),
      })

      const data = await response.json()

      if (data.error || !data.success) {
        setError(data.error || "Failed to create contact")
        return null
      }

      return data.id || null
    } catch (err) {
      setError("Failed to create contact")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const createSecurityCase = async (caseData: SecurityCase): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/salesforce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create-case",
          data: caseData,
        }),
      })

      const data = await response.json()

      if (data.error || !data.success) {
        setError(data.error || "Failed to create security case")
        return null
      }

      return data.id || null
    } catch (err) {
      setError("Failed to create security case")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    checkConnection,
    getSecurityCases,
    findContactByEmail,
    createContact,
    createSecurityCase,
  }
}
