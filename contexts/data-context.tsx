"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSalesforceReal } from "@/hooks/use-salesforce-real"

interface Guest {
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

interface Staff {
  id: string
  name: string
  role: "Security" | "Receptionist" | "Cleaner"
  photoUrl?: string
  shiftStart?: string
  shiftEnd?: string
  salesforceId?: string
}

interface Room {
  id: string
  roomNumber: string
  status: "Vacant" | "Occupied" | "Alerted"
  guestId?: string
  salesforceId?: string
}

interface FaceLog {
  id: string
  timestamp: Date
  roomId?: string
  matchType: "Guest" | "Staff" | "Unknown"
  confidence: number
  faceImageUrl?: string
  salesforceId?: string
  unauthorized?: boolean
}

interface SecurityAlert {
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

interface AudioLog {
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

interface LinenStock {
  id: string
  type: "Bedsheet" | "Towel" | "Pillow Cover"
  roomId?: string
  status: "Issued" | "Returned" | "Damaged"
  issueDate?: string
  returnDate?: string
  salesforceId?: string
}

interface DataContextType {
  // ONLY Custom Objects - NO standard objects
  guests: Guest[]
  staff: Staff[]
  rooms: Room[]
  faceLogs: FaceLog[]
  alerts: SecurityAlert[]
  audioLogs: AudioLog[]
  linenStock: LinenStock[]

  // Loading states
  isLoading: boolean
  lastRefresh: Date | null

  // Salesforce connection
  isConnectedToSalesforce: boolean
  salesforceError: string | null
  checkSalesforceConnection: () => Promise<void>
  refreshAllData: () => Promise<void>

  // Actions
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

const DataContext = createContext<DataContextType | undefined>(undefined)

// Generate sample data for development/demo purposes
const generateSampleData = () => {
  // Sample rooms
  const sampleRooms: Room[] = Array.from({ length: 20 }, (_, i) => ({
    id: `room_${i + 1}`,
    roomNumber: `${i + 101}`,
    status: i % 5 === 0 ? "Alerted" : i % 3 === 0 ? "Occupied" : "Vacant",
    salesforceId: `sf_room_${i + 1}`,
  }))

  // Sample guests
  const sampleGuests: Guest[] = Array.from({ length: 8 }, (_, i) => ({
    id: `guest_${i + 1}`,
    name: `Guest ${i + 1}`,
    roomNumber: `${i + 101}`,
    status: i % 3 === 0 ? "checked-out" : "checked-in",
    checkInDate: "2023-05-01",
    checkOutDate: i % 3 === 0 ? "2023-05-05" : undefined,
    salesforceId: `sf_guest_${i + 1}`,
  }))

  // Sample staff
  const sampleStaff: Staff[] = Array.from({ length: 5 }, (_, i) => ({
    id: `staff_${i + 1}`,
    name: `Staff ${i + 1}`,
    role: i === 0 ? "Security" : i === 1 ? "Cleaner" : "Receptionist",
    salesforceId: `sf_staff_${i + 1}`,
  }))

  // Sample face logs
  const sampleFaceLogs: FaceLog[] = Array.from({ length: 15 }, (_, i) => ({
    id: `facelog_${i + 1}`,
    timestamp: new Date(Date.now() - i * 3600000),
    roomId: `room_${(i % 10) + 1}`,
    matchType: i % 3 === 0 ? "Guest" : i % 3 === 1 ? "Staff" : "Unknown",
    confidence: 70 + Math.floor(Math.random() * 30),
    salesforceId: `sf_facelog_${i + 1}`,
  }))

  // Sample alerts
  const sampleAlerts: SecurityAlert[] = Array.from({ length: 10 }, (_, i) => ({
    id: `alert_${i + 1}`,
    type: i % 3 === 0 ? "Intruder" : i % 3 === 1 ? "Mismatch" : "Tailgating",
    severity: i % 4 === 0 ? "critical" : i % 4 === 1 ? "high" : i % 4 === 2 ? "medium" : "low",
    timestamp: new Date(Date.now() - i * 7200000),
    location: `Room ${i + 101}`,
    description: `Alert detected in Room ${i + 101}`,
    status: i % 4 === 0 ? "Open" : i % 4 === 1 ? "Responded" : i % 4 === 2 ? "Resolved" : "Escalated",
    confidence: 70 + Math.floor(Math.random() * 30),
    salesforceId: `sf_alert_${i + 1}`,
  }))

  // Sample audio logs
  const sampleAudioLogs: AudioLog[] = Array.from({ length: 8 }, (_, i) => ({
    id: `audiolog_${i + 1}`,
    timestamp: new Date(Date.now() - i * 5400000),
    duration: 30 + Math.floor(Math.random() * 120),
    salesforceId: `sf_audiolog_${i + 1}`,
  }))

  // Sample linen stock
  const sampleLinenStock: LinenStock[] = Array.from({ length: 12 }, (_, i) => ({
    id: `linen_${i + 1}`,
    type: i % 3 === 0 ? "Bedsheet" : i % 3 === 1 ? "Towel" : "Pillow Cover",
    roomId: `room_${(i % 10) + 1}`,
    status: i % 3 === 0 ? "Issued" : i % 3 === 1 ? "Returned" : "Damaged",
    issueDate: "2023-05-01",
    returnDate: i % 3 === 1 ? "2023-05-05" : undefined,
    salesforceId: `sf_linen_${i + 1}`,
  }))

  return {
    rooms: sampleRooms,
    guests: sampleGuests,
    staff: sampleStaff,
    faceLogs: sampleFaceLogs,
    alerts: sampleAlerts,
    audioLogs: sampleAudioLogs,
    linenStock: sampleLinenStock,
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Initialize with sample data for immediate rendering
  const sampleData = generateSampleData()

  const [guests, setGuests] = useState<Guest[]>(sampleData.guests)
  const [staff, setStaff] = useState<Staff[]>(sampleData.staff)
  const [rooms, setRooms] = useState<Room[]>(sampleData.rooms)
  const [faceLogs, setFaceLogs] = useState<FaceLog[]>(sampleData.faceLogs)
  const [alerts, setAlerts] = useState<SecurityAlert[]>(sampleData.alerts)
  const [audioLogs, setAudioLogs] = useState<AudioLog[]>(sampleData.audioLogs)
  const [linenStock, setLinenStock] = useState<LinenStock[]>(sampleData.linenStock)

  const [isLoading, setIsLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(new Date())
  const [usingSampleData, setUsingSampleData] = useState(true)

  const salesforce = useSalesforceReal()

  // Try to connect to Salesforce in the background, but don't block rendering
  useEffect(() => {
    const initializeSalesforce = async () => {
      try {
        // Don't set loading state to true here to avoid blocking UI
        console.log("🔄 Checking Salesforce connection in the background...")

        if (!salesforce.isConnected && !salesforce.isLoading) {
          await salesforce.checkConnection()
        }

        if (salesforce.isConnected) {
          console.log("✅ Connected to Salesforce, will attempt to fetch real data")
          // Only try to fetch real data if we're connected
          refreshAllData().catch((err) => {
            console.error("Failed to fetch Salesforce data:", err)
            console.log("⚠️ Using sample data due to Salesforce data fetch failure")
          })
        } else {
          console.log("⚠️ Not connected to Salesforce, using sample data")
        }
      } catch (error) {
        console.error("❌ Error initializing Salesforce:", error)
        console.log("⚠️ Using sample data due to Salesforce initialization failure")
      }
    }

    // Don't block rendering, just try to connect in the background
    initializeSalesforce()
  }, [])

  const refreshAllData = async () => {
    // Don't block UI rendering with this loading state
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
        let hasRealData = false

        // Try to fetch each data type independently
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
            hasRealData = true
            console.log(`✅ Loaded ${mappedGuests.length} guests from Salesforce`)
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
            hasRealData = true
            console.log(`✅ Loaded ${mappedStaff.length} staff from Salesforce`)
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
            hasRealData = true
            console.log(`✅ Loaded ${mappedRooms.length} rooms from Salesforce`)
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
            hasRealData = true
            console.log(`✅ Loaded ${mappedFaceLogs.length} face logs from Salesforce`)
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
              timestamp: new Date(),
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
            hasRealData = true
            console.log(`✅ Loaded ${mappedAlerts.length} alerts from Salesforce`)
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
            hasRealData = true
            console.log(`✅ Loaded ${mappedAudioLogs.length} audio logs from Salesforce`)
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
            hasRealData = true
            console.log(`✅ Loaded ${mappedLinenStock.length} linen stock from Salesforce`)
          }
        } catch (error) {
          console.warn("⚠️ Failed to load linen stock:", error)
        }

        setUsingSampleData(!hasRealData)
        if (!hasRealData) {
          console.log("⚠️ No real data found in Salesforce, using sample data")
        } else {
          console.log("✅ Using real data from Salesforce")
        }
      } else {
        console.log("⚠️ Not connected to Salesforce - using sample data")
        console.log("Salesforce error:", salesforce.error)
        setUsingSampleData(true)
      }

      setLastRefresh(new Date())
    } catch (error) {
      console.error("❌ Failed to refresh data from Salesforce:", error)
      // Don't throw the error, just log it and continue with sample data
      setUsingSampleData(true)
    } finally {
      setIsLoading(false)
    }
  }

  const addGuest = async (guestData: Omit<Guest, "id">) => {
    const newGuest: Guest = {
      ...guestData,
      id: `G${Date.now()}`,
    }

    // Add to local state immediately
    setGuests((prev) => [...prev, newGuest])

    // Sync to Salesforce if connected
    if (salesforce.isConnected) {
      try {
        const salesforceId = await salesforce.createGuest({
          Name: newGuest.name,
          Room_No__c: newGuest.roomNumber,
          ID_Proof__c: newGuest.idProof,
          Checkin_Time__c: newGuest.checkInDate ? new Date(newGuest.checkInDate).toISOString() : undefined,
          Checkout_Time__c: newGuest.checkOutDate ? new Date(newGuest.checkOutDate).toISOString() : undefined,
          Photo_URL__c: newGuest.photoUrl,
          Voice_Log_URL__c: newGuest.voiceLogUrl,
        })

        if (salesforceId) {
          setGuests((prev) => prev.map((g) => (g.id === newGuest.id ? { ...g, salesforceId } : g)))
        }
      } catch (error) {
        console.error("Failed to sync guest to Salesforce:", error)
      }
    }
  }

  const updateGuest = async (id: string, updates: Partial<Guest>) => {
    setGuests((prev) => prev.map((guest) => (guest.id === id ? { ...guest, ...updates } : guest)))

    // Update in Salesforce if connected and has Salesforce ID
    const guest = guests.find((g) => g.id === id)
    if (salesforce.isConnected && guest?.salesforceId) {
      try {
        await salesforce.updateGuest(guest.salesforceId, {
          Name: updates.name,
          Room_No__c: updates.roomNumber,
          ID_Proof__c: updates.idProof,
          Photo_URL__c: updates.photoUrl,
          Voice_Log_URL__c: updates.voiceLogUrl,
          Checkin_Time__c: updates.checkInDate ? new Date(updates.checkInDate).toISOString() : undefined,
          Checkout_Time__c: updates.checkOutDate ? new Date(updates.checkOutDate).toISOString() : undefined,
        })
      } catch (error) {
        console.error("Failed to update guest in Salesforce:", error)
      }
    }
  }

  const addStaff = async (staffData: Omit<Staff, "id">) => {
    const newStaff: Staff = {
      ...staffData,
      id: `S${Date.now()}`,
    }

    setStaff((prev) => [...prev, newStaff])

    if (salesforce.isConnected) {
      try {
        const salesforceId = await salesforce.createStaff({
          Name: newStaff.name,
          Role__c: newStaff.role,
          Photo_URL__c: newStaff.photoUrl,
          Shift_Start__c: newStaff.shiftStart,
          Shift_End__c: newStaff.shiftEnd,
        })

        if (salesforceId) {
          setStaff((prev) => prev.map((s) => (s.id === newStaff.id ? { ...s, salesforceId } : s)))
        }
      } catch (error) {
        console.error("Failed to sync staff to Salesforce:", error)
      }
    }
  }

  const addRoom = async (roomData: Omit<Room, "id">) => {
    const newRoom: Room = {
      ...roomData,
      id: `R${Date.now()}`,
    }

    setRooms((prev) => [...prev, newRoom])

    if (salesforce.isConnected) {
      try {
        const salesforceId = await salesforce.createRoom({
          Room_No__c: newRoom.roomNumber,
          Status__c: newRoom.status,
          Guest__c: newRoom.guestId,
        })

        if (salesforceId) {
          setRooms((prev) => prev.map((r) => (r.id === newRoom.id ? { ...r, salesforceId } : r)))
        }
      } catch (error) {
        console.error("Failed to sync room to Salesforce:", error)
      }
    }
  }

  const createFaceLog = async (faceLogData: Omit<FaceLog, "id">) => {
    const newFaceLog: FaceLog = {
      ...faceLogData,
      id: `FL${Date.now()}`,
    }

    setFaceLogs((prev) => [...prev, newFaceLog])

    if (salesforce.isConnected) {
      try {
        const salesforceId = await salesforce.createFaceLog({
          Timestamp__c: newFaceLog.timestamp.toISOString(),
          Room__c: newFaceLog.roomId,
          Match_Type__c: newFaceLog.matchType,
          Confidence__c: newFaceLog.confidence,
          Face_Image_URL__c: newFaceLog.faceImageUrl,
        })

        if (salesforceId) {
          setFaceLogs((prev) => prev.map((fl) => (fl.id === newFaceLog.id ? { ...fl, salesforceId } : fl)))
        }
      } catch (error) {
        console.error("Failed to sync face log to Salesforce:", error)
      }
    }
  }

  const createSecurityAlert = async (alertData: Omit<SecurityAlert, "id" | "timestamp">) => {
    const newAlert: SecurityAlert = {
      ...alertData,
      id: `A${Date.now()}`,
      timestamp: new Date(),
    }

    setAlerts((prev) => [...prev, newAlert])

    if (salesforce.isConnected) {
      try {
        const salesforceId = await salesforce.createAlert({
          Alert_Type__c: newAlert.type,
          Status__c: newAlert.status,
          Face_Log__c: newAlert.faceLogId,
          Assigned_To__c: newAlert.assignedTo,
          Receptionist_Comment__c: newAlert.receptionistComment,
          Owner_Review__c: newAlert.ownerReview,
        })

        if (salesforceId) {
          setAlerts((prev) => prev.map((a) => (a.id === newAlert.id ? { ...a, salesforceId } : a)))
        }
      } catch (error) {
        console.error("Failed to create Salesforce alert:", error)
      }
    }
  }

  const updateAlert = async (alertId: string, updates: Partial<SecurityAlert>) => {
    console.log("🔄 Updating alert:", alertId, updates)

    // Find the alert to update
    const alert = alerts.find((a) => a.id === alertId)
    if (!alert) {
      console.error("❌ Alert not found:", alertId)
      throw new Error("Alert not found")
    }

    // Update local state first
    const updatedAlert = { ...alert, ...updates }
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? updatedAlert : a)))

    // Update in Salesforce if connected and has Salesforce ID
    if (salesforce.isConnected && alert.salesforceId) {
      try {
        console.log("📤 Syncing alert to Salesforce:", alert.salesforceId, updates)

        // Prepare Salesforce update data
        const salesforceUpdates: any = {}
        if (updates.type) salesforceUpdates.Alert_Type__c = updates.type
        if (updates.status) salesforceUpdates.Status__c = updates.status
        if (updates.assignedTo) salesforceUpdates.Assigned_To__c = updates.assignedTo
        if (updates.receptionistComment) salesforceUpdates.Receptionist_Comment__c = updates.receptionistComment
        if (updates.ownerReview) salesforceUpdates.Owner_Review__c = updates.ownerReview

        const success = await salesforce.updateAlert(alert.salesforceId, salesforceUpdates)

        if (success) {
          console.log("✅ Successfully updated alert in Salesforce")
        } else {
          console.error("❌ Failed to update alert in Salesforce")
          throw new Error("Salesforce update failed")
        }
      } catch (error) {
        console.error("❌ Failed to update alert in Salesforce:", error)
        // Revert local state on Salesforce error
        setAlerts((prev) => prev.map((a) => (a.id === alertId ? alert : a)))
        throw error
      }
    } else {
      console.warn("⚠️ Not connected to Salesforce or alert has no Salesforce ID")
    }
  }

  const resolveAlert = async (alertId: string, comment?: string) => {
    const alert = alerts.find((a) => a.id === alertId)

    // Update local state
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "Resolved" as const, ownerReview: comment } : alert,
      ),
    )

    // Update in Salesforce if connected and has Salesforce ID
    if (salesforce.isConnected && alert?.salesforceId) {
      try {
        await salesforce.updateAlert(alert.salesforceId, {
          Status__c: "Resolved",
          Owner_Review__c: comment,
        })
      } catch (error) {
        console.error("Failed to update alert in Salesforce:", error)
      }
    }
  }

  const createAudioLog = async (audioLogData: Omit<AudioLog, "id">) => {
    const newAudioLog: AudioLog = {
      ...audioLogData,
      id: `AL${Date.now()}`,
    }

    setAudioLogs((prev) => [...prev, newAudioLog])

    if (salesforce.isConnected) {
      try {
        const salesforceId = await salesforce.createAudioLog({
          Linked_Guest__c: newAudioLog.guestId,
          Recording_URL__c: newAudioLog.recordingUrl,
          Timestamp__c: newAudioLog.timestamp.toISOString(),
          Duration__c: newAudioLog.duration,
        })

        if (salesforceId) {
          setAudioLogs((prev) => prev.map((al) => (al.id === newAudioLog.id ? { ...al, salesforceId } : al)))
        }
      } catch (error) {
        console.error("Failed to sync audio log to Salesforce:", error)
      }
    }
  }

  const addLinenStock = async (linenData: Omit<LinenStock, "id">) => {
    const newLinen: LinenStock = {
      ...linenData,
      id: `L${Date.now()}`,
    }

    setLinenStock((prev) => [...prev, newLinen])

    if (salesforce.isConnected) {
      try {
        const salesforceId = await salesforce.createLinenStock({
          Type__c: newLinen.type,
          Room__c: newLinen.roomId,
          Status__c: newLinen.status,
          Issue_Date__c: newLinen.issueDate,
          Return_Date__c: newLinen.returnDate,
        })

        if (salesforceId) {
          setLinenStock((prev) => prev.map((l) => (l.id === newLinen.id ? { ...l, salesforceId } : l)))
        }
      } catch (error) {
        console.error("Failed to sync linen stock to Salesforce:", error)
      }
    }
  }

  const updateLinenStock = async (id: string, updates: Partial<LinenStock>) => {
    console.log("🔄 Updating linen stock:", id, updates)

    // Find the item to update
    const item = linenStock.find((l) => l.id === id)
    if (!item) {
      console.error("❌ Linen item not found:", id)
      throw new Error("Linen item not found")
    }

    // Update local state first
    const updatedItem = { ...item, ...updates }
    setLinenStock((prev) => prev.map((linen) => (linen.id === id ? updatedItem : linen)))

    // Update in Salesforce if connected and has Salesforce ID
    if (salesforce.isConnected && item.salesforceId) {
      try {
        console.log("📤 Syncing to Salesforce:", item.salesforceId, updates)

        // Prepare Salesforce update data
        const salesforceUpdates: any = {}
        if (updates.type) salesforceUpdates.Type__c = updates.type
        if (updates.roomId) salesforceUpdates.Room__c = updates.roomId
        if (updates.status) salesforceUpdates.Status__c = updates.status
        if (updates.issueDate) salesforceUpdates.Issue_Date__c = updates.issueDate
        if (updates.returnDate) salesforceUpdates.Return_Date__c = updates.returnDate

        // Add current timestamp for return date if status is being set to Returned
        if (updates.status === "Returned" && !updates.returnDate) {
          salesforceUpdates.Return_Date__c = new Date().toISOString().split("T")[0]
        }

        // Add current timestamp for issue date if status is being set to Issued
        if (updates.status === "Issued" && !updates.issueDate) {
          salesforceUpdates.Issue_Date__c = new Date().toISOString().split("T")[0]
        }

        const success = await salesforce.updateLinenStock(item.salesforceId, salesforceUpdates)

        if (success) {
          console.log("✅ Successfully updated in Salesforce")
        } else {
          console.error("❌ Failed to update in Salesforce")
          throw new Error("Salesforce update failed")
        }
      } catch (error) {
        console.error("❌ Failed to update linen stock in Salesforce:", error)
        // Revert local state on Salesforce error
        setLinenStock((prev) => prev.map((linen) => (linen.id === id ? item : linen)))
        throw error
      }
    } else {
      console.warn("⚠️ Not connected to Salesforce or item has no Salesforce ID")
    }
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
        isLoading: isLoading || salesforce.isLoading,
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
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
