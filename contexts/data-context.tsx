"use client"
import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { useSalesforceReal } from "@/hooks/use-salesforce-real"

// Define interfaces for our data types
export interface Guest {
  id: string
  name: string
  email?: string
  phone?: string
  roomNumber?: string
  checkInDate?: string
  checkOutDate?: string
  status: "checked-in" | "checked-out" | "not-arrived" | "vip" | "blacklisted"
  salesforceId?: string
  photoUrl?: string
  idProof?: string
  voiceLogUrl?: string
}

export interface Staff {
  id: string
  name: string
  role: "Security" | "Receptionist" | "Cleaner"
  photoUrl?: string
  shiftStart?: string
  shiftEnd?: string
  salesforceId?: string
}

export interface Room {
  id: string
  roomNumber: string
  status: "Vacant" | "Occupied" | "Alerted"
  guestId?: string
  salesforceId?: string
}

export interface FaceLog {
  id: string
  timestamp: Date
  roomId?: string
  matchType: "Guest" | "Staff" | "Unknown"
  confidence: number
  faceImageUrl?: string
  salesforceId?: string
  unauthorized?: boolean
}

export interface SecurityAlert {
  id: string
  type: "Intruder" | "Mismatch" | "Tailgating"
  severity: "low" | "medium" | "high" | "critical"
  timestamp: Date
  location: string
  description: string
  status: "Open" | "Responded" | "Resolved" | "Escalated"
  assignedTo?: string
  confidence: number
  faceLogId?: string
  salesforceId?: string
  receptionistComment?: string
  ownerReview?: string
  faceImageUrl?: string
}

export interface AudioLog {
  id: string
  guestId?: string
  guestName?: string
  receptionist?: string
  recordingUrl?: string
  timestamp: Date
  duration?: number
  salesforceId?: string
  flagged?: boolean
  escalated?: boolean
  resolved?: boolean
  sentiment?: "positive" | "neutral" | "negative"
  keywords?: string[]
  comments?: string[]
  status?: "pending" | "escalated" | "resolved"
}

export interface LinenStock {
  id: string
  type: "Bedsheet" | "Towel" | "Pillow Cover"
  roomId?: string
  status: "Issued" | "Returned" | "Damaged"
  issueDate?: string
  returnDate?: string
  salesforceId?: string
}

// Define the context type
interface DataContextType {
  guests: Guest[]
  staff: Staff[]
  rooms: Room[]
  faceLogs: FaceLog[]
  alerts: SecurityAlert[]
  audioLogs: AudioLog[]
  linenStock: LinenStock[]
  isLoading: boolean
  isInitialLoad: boolean
  lastRefresh: Date | null
  isConnectedToSalesforce: boolean
  salesforceError: string | null
  checkSalesforceConnection: () => Promise<void>
  refreshAllData: () => Promise<void>
  addGuest: (guest: Omit<Guest, "id">) => Promise<void>
  updateGuest: (id: string, updates: Partial<Guest>) => Promise<void>
  addStaff: (staff: Omit<Staff, "id">) => Promise<void>
  addRoom: (room: Omit<Room, "id">) => Promise<void>
  createFaceLog: (faceLog: Omit<FaceLog, "id">) => Promise<void>
  createSecurityAlert: (alert: Omit<SecurityAlert, "id" | "timestamp">) => Promise<void>
  updateAlert: (alertId: string, updates: Partial<SecurityAlert>) => Promise<void>
  resolveAlert: (alertId: string, comment?: string) => Promise<void>
  createAudioLog: (audioLog: Omit<AudioLog, "id">) => Promise<void>
  addLinenStock: (linen: Omit<LinenStock, "id">) => Promise<void>
  updateLinenStock: (id: string, updates: Partial<LinenStock>) => Promise<void>
}

// Create the context with default values
const DataContext = createContext<DataContextType>({
  guests: [],
  staff: [],
  rooms: [],
  faceLogs: [],
  alerts: [],
  audioLogs: [],
  linenStock: [],
  isLoading: false,
  isInitialLoad: true,
  lastRefresh: null,
  isConnectedToSalesforce: false,
  salesforceError: null,
  checkSalesforceConnection: async () => {},
  refreshAllData: async () => {},
  addGuest: async () => {},
  updateGuest: async () => {},
  addStaff: async () => {},
  addRoom: async () => {},
  createFaceLog: async () => {},
  createSecurityAlert: async () => {},
  updateAlert: async () => {},
  resolveAlert: async () => {},
  createAudioLog: async () => {},
  addLinenStock: async () => {},
  updateLinenStock: async () => {},
})

// Create the provider component
export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize with empty arrays
  const [guests, setGuests] = useState<Guest[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [faceLogs, setFaceLogs] = useState<FaceLog[]>([])
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [audioLogs, setAudioLogs] = useState<AudioLog[]>([])
  const [linenStock, setLinenStock] = useState<LinenStock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const salesforce = useSalesforceReal()
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Function to refresh all data - using useRef to avoid dependency issues
  const refreshAllDataRef = useRef<() => Promise<void>>()

  refreshAllDataRef.current = async () => {
    setIsLoading(true)
    console.log("🔄 Refreshing all data from Salesforce...")

    try {
      // Check connection first
      if (!salesforce.isConnected && !salesforce.isLoading) {
        console.log("🔄 Not connected, attempting to connect...")
        await salesforce.checkConnection()
      }

      if (salesforce.isConnected) {
        console.log("✅ Connected to Salesforce, fetching data...")

        // Fetch data with individual error handling
        try {
          const salesforceGuests = await salesforce.getGuests()
          if (salesforceGuests && salesforceGuests.length > 0) {
            const mappedGuests: Guest[] = salesforceGuests.map((guest) => ({
              id: guest.Id || `temp_${Date.now()}_${Math.random()}`,
              name: guest.Name || "Unknown Guest",
              roomNumber: guest.Room_No__c,
              checkInDate: guest.Checkin_Time__c
                ? new Date(guest.Checkin_Time__c).toISOString().split("T")[0]
                : undefined,
              checkOutDate: guest.Checkout_Time__c
                ? new Date(guest.Checkout_Time__c).toISOString().split("T")[0]
                : undefined,
              status: guest.Checkout_Time__c ? "checked-out" : guest.Checkin_Time__c ? "checked-in" : "not-arrived",
              salesforceId: guest.Id,
              photoUrl: guest.Photo_URL__c,
              idProof: guest.ID_Proof__c,
              voiceLogUrl: guest.Voice_Log_URL__c,
            }))
            setGuests(mappedGuests)
            console.log(`✅ Loaded ${mappedGuests.length} guests`)
          }
        } catch (error) {
          console.warn("⚠️ Failed to load guests:", error)
        }

        try {
          const salesforceStaff = await salesforce.getStaff()
          if (salesforceStaff && salesforceStaff.length > 0) {
            const mappedStaff: Staff[] = salesforceStaff.map((staff) => ({
              id: staff.Id || `temp_${Date.now()}_${Math.random()}`,
              name: staff.Name || "Unknown Staff",
              role: (staff.Role__c as any) || "Receptionist",
              photoUrl: staff.Photo_URL__c,
              shiftStart: staff.Shift_Start__c,
              shiftEnd: staff.Shift_End__c,
              salesforceId: staff.Id,
            }))
            setStaff(mappedStaff)
            console.log(`✅ Loaded ${mappedStaff.length} staff`)
          }
        } catch (error) {
          console.warn("⚠️ Failed to load staff:", error)
        }

        try {
          const salesforceRooms = await salesforce.getRooms()
          if (salesforceRooms && salesforceRooms.length > 0) {
            const mappedRooms: Room[] = salesforceRooms.map((room) => ({
              id: room.Id || `temp_${Date.now()}_${Math.random()}`,
              roomNumber: room.Room_No__c || "Unknown",
              status: (room.Status__c as any) || "Vacant",
              guestId: room.Guest__c,
              salesforceId: room.Id,
            }))
            setRooms(mappedRooms)
            console.log(`✅ Loaded ${mappedRooms.length} rooms`)
          }
        } catch (error) {
          console.warn("⚠️ Failed to load rooms:", error)
        }

        try {
          const salesforceFaceLogs = await salesforce.getFaceLogs()
          if (salesforceFaceLogs && salesforceFaceLogs.length > 0) {
            const mappedFaceLogs: FaceLog[] = salesforceFaceLogs.map((faceLog) => ({
              id: faceLog.Id || `temp_${Date.now()}_${Math.random()}`,
              timestamp: new Date(faceLog.Timestamp__c || Date.now()),
              roomId: faceLog.Room__c,
              matchType: (faceLog.Match_Type__c as any) || "Unknown",
              confidence: faceLog.Confidence__c || 0,
              faceImageUrl: faceLog.Face_Image_URL__c,
              salesforceId: faceLog.Id,
              unauthorized: false,
            }))
            setFaceLogs(mappedFaceLogs)
            console.log(`✅ Loaded ${mappedFaceLogs.length} face logs`)
          }
        } catch (error) {
          console.warn("⚠️ Failed to load face logs:", error)
        }

        try {
          const salesforceAlerts = await salesforce.getAlerts()
          if (salesforceAlerts && salesforceAlerts.length > 0) {
            const mappedAlerts: SecurityAlert[] = salesforceAlerts.map((alert) => ({
              id: alert.Id || `temp_${Date.now()}_${Math.random()}`,
              type: (alert.Alert_Type__c as any) || "Intruder",
              severity: "medium",
              timestamp: new Date(alert.CreatedDate || Date.now()),
              location: "Unknown",
              description: `${alert.Alert_Type__c || "Security"} alert`,
              status: (alert.Status__c as any) || "Open",
              assignedTo: alert.Assigned_To__c,
              confidence: 85,
              faceLogId: alert.Face_Log__c,
              salesforceId: alert.Id,
              receptionistComment: alert.Receptionist_Comment__c,
              ownerReview: alert.Owner_Review__c,
              faceImageUrl: undefined,
            }))
            setAlerts(mappedAlerts)
            console.log(`✅ Loaded ${mappedAlerts.length} alerts`)
          }
        } catch (error) {
          console.warn("⚠️ Failed to load alerts:", error)
        }

        try {
          const salesforceAudioLogs = await salesforce.getAudioLogs()
          if (salesforceAudioLogs && salesforceAudioLogs.length > 0) {
            const mappedAudioLogs: AudioLog[] = salesforceAudioLogs.map((audioLog) => ({
              id: audioLog.Id || `temp_${Date.now()}_${Math.random()}`,
              guestId: audioLog.Linked_Guest__c,
              guestName: "Unknown Guest",
              receptionist: "Unknown",
              recordingUrl: audioLog.Recording_URL__c,
              timestamp: new Date(audioLog.Timestamp__c || Date.now()),
              duration: audioLog.Duration__c || 0,
              salesforceId: audioLog.Id,
              flagged: false,
              escalated: false,
              resolved: false,
              sentiment: "neutral",
              keywords: [],
              comments: [],
              status: "pending",
            }))
            setAudioLogs(mappedAudioLogs)
            console.log(`✅ Loaded ${mappedAudioLogs.length} audio logs`)
          }
        } catch (error) {
          console.warn("⚠️ Failed to load audio logs:", error)
        }

        try {
          const salesforceLinenStock = await salesforce.getLinenStock()
          if (salesforceLinenStock && salesforceLinenStock.length > 0) {
            const mappedLinenStock: LinenStock[] = salesforceLinenStock.map((linen) => ({
              id: linen.Id || `temp_${Date.now()}_${Math.random()}`,
              type: (linen.Type__c as any) || "Bedsheet",
              roomId: linen.Room__c,
              status: (linen.Status__c as any) || "Issued",
              issueDate: linen.Issue_Date__c,
              returnDate: linen.Return_Date__c,
              salesforceId: linen.Id,
            }))
            setLinenStock(mappedLinenStock)
            console.log(`✅ Loaded ${mappedLinenStock.length} linen stock`)
          }
        } catch (error) {
          console.warn("⚠️ Failed to load linen stock:", error)
        }

        console.log("✅ Data refresh completed successfully")
      } else {
        console.log("⚠️ Not connected to Salesforce - data remains empty")
        console.log("Salesforce error:", salesforce.error)
      }

      setLastRefresh(new Date())
    } catch (error) {
      console.error("❌ Failed to refresh data from Salesforce:", error)
    } finally {
      setIsLoading(false)
      setIsInitialLoad(false)
    }
  }

  // Wrapper function for external calls
  const refreshAllData = async () => {
    if (refreshAllDataRef.current) {
      await refreshAllDataRef.current()
    }
  }

  // Auto-refresh on mount and set up periodic refresh
  useEffect(() => {
    console.log("🚀 Data context initialized - starting auto-refresh")

    // Initial data load
    if (refreshAllDataRef.current) {
      refreshAllDataRef.current()
    }

    // Set up periodic refresh every 30 seconds for real-time updates
    refreshIntervalRef.current = setInterval(() => {
      console.log("⏰ Periodic refresh triggered")
      if (refreshAllDataRef.current) {
        refreshAllDataRef.current()
      }
    }, 30000) // 30 seconds

    // Cleanup interval on unmount
    return () => {
      console.log("🧹 Cleaning up refresh interval")
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, []) // Empty dependency array - only run once on mount

  // CRUD operations (simplified for brevity)
  const addGuest = async (guestData: Omit<Guest, "id">) => {
    const newGuest: Guest = { ...guestData, id: `G${Date.now()}` }
    setGuests((prev) => [...prev, newGuest])
    // Trigger refresh to get updated data
    setTimeout(() => {
      if (refreshAllDataRef.current) {
        refreshAllDataRef.current()
      }
    }, 1000)
  }

  const updateGuest = async (id: string, updates: Partial<Guest>) => {
    setGuests((prev) => prev.map((guest) => (guest.id === id ? { ...guest, ...updates } : guest)))
    // Trigger refresh to get updated data
    setTimeout(() => {
      if (refreshAllDataRef.current) {
        refreshAllDataRef.current()
      }
    }, 1000)
  }

  const addStaff = async (staffData: Omit<Staff, "id">) => {
    const newStaff: Staff = { ...staffData, id: `S${Date.now()}` }
    setStaff((prev) => [...prev, newStaff])
    setTimeout(() => {
      if (refreshAllDataRef.current) {
        refreshAllDataRef.current()
      }
    }, 1000)
  }

  const addRoom = async (roomData: Omit<Room, "id">) => {
    const newRoom: Room = { ...roomData, id: `R${Date.now()}` }
    setRooms((prev) => [...prev, newRoom])
    setTimeout(() => {
      if (refreshAllDataRef.current) {
        refreshAllDataRef.current()
      }
    }, 1000)
  }

  const createFaceLog = async (faceLogData: Omit<FaceLog, "id">) => {
    const newFaceLog: FaceLog = { ...faceLogData, id: `FL${Date.now()}` }
    setFaceLogs((prev) => [...prev, newFaceLog])
    setTimeout(() => {
      if (refreshAllDataRef.current) {
        refreshAllDataRef.current()
      }
    }, 1000)
  }

  const createSecurityAlert = async (alertData: Omit<SecurityAlert, "id" | "timestamp">) => {
    const newAlert: SecurityAlert = { ...alertData, id: `A${Date.now()}`, timestamp: new Date() }
    setAlerts((prev) => [...prev, newAlert])
    setTimeout(() => {
      if (refreshAllDataRef.current) {
        refreshAllDataRef.current()
      }
    }, 1000)
  }

  const updateAlert = async (alertId: string, updates: Partial<SecurityAlert>) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, ...updates } : a)))
    setTimeout(() => {
      if (refreshAllDataRef.current) {
        refreshAllDataRef.current()
      }
    }, 1000)
  }

  const resolveAlert = async (alertId: string, comment?: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "Resolved" as const, ownerReview: comment } : alert,
      ),
    )
    setTimeout(() => {
      if (refreshAllDataRef.current) {
        refreshAllDataRef.current()
      }
    }, 1000)
  }

  const createAudioLog = async (audioLogData: Omit<AudioLog, "id">) => {
    const newAudioLog: AudioLog = { ...audioLogData, id: `AL${Date.now()}` }
    setAudioLogs((prev) => [...prev, newAudioLog])
    setTimeout(() => {
      if (refreshAllDataRef.current) {
        refreshAllDataRef.current()
      }
    }, 1000)
  }

  const addLinenStock = async (linenData: Omit<LinenStock, "id">) => {
    const newLinen: LinenStock = { ...linenData, id: `L${Date.now()}` }
    setLinenStock((prev) => [...prev, newLinen])
    setTimeout(() => {
      if (refreshAllDataRef.current) {
        refreshAllDataRef.current()
      }
    }, 1000)
  }

  const updateLinenStock = async (id: string, updates: Partial<LinenStock>) => {
    setLinenStock((prev) => prev.map((linen) => (linen.id === id ? { ...linen, ...updates } : linen)))
    setTimeout(() => {
      if (refreshAllDataRef.current) {
        refreshAllDataRef.current()
      }
    }, 1000)
  }

  return (
    <DataContext.Provider
      value={{
        guests,
        staff,
        rooms,
        faceLogs,
        alerts,
        audioLogs,
        linenStock,
        isLoading,
        isInitialLoad,
        lastRefresh,
        isConnectedToSalesforce: salesforce.isConnected,
        salesforceError: salesforce.error,
        checkSalesforceConnection: salesforce.checkConnection,
        refreshAllData,
        addGuest,
        updateGuest,
        addStaff,
        addRoom,
        createFaceLog,
        createSecurityAlert,
        updateAlert,
        resolveAlert,
        createAudioLog,
        addLinenStock,
        updateLinenStock,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
