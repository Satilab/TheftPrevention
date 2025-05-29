"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload, RefreshCw, Save, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function RegistrationPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("camera")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [role, setRole] = useState("guest")
  const [roomNumber, setRoomNumber] = useState("")
  const [idType, setIdType] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [assignRoom, setAssignRoom] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetForm = () => {
    setCapturedImage(null)
    setName("")
    setRole("guest")
    setRoomNumber("")
    setIdType("")
    setIdNumber("")
    setAssignRoom(true)
    setShowSuccess(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      toast({
        title: "Registration Successful",
        description: `${role === "guest" ? "Guest" : "Staff member"} ${name} has been registered successfully.`,
      })
    }, 1500)
  }

  // Start camera when tab changes to camera
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "camera") {
      startCamera()
    } else {
      stopCamera()
    }
  }

  // Clean up camera on unmount
  useState(() => {
    return () => {
      stopCamera()
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Guest & Staff Registration</h1>
        <p className="text-muted-foreground">Register new guests or staff members with photo identification</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        {showSuccess ? (
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-center">Registration Complete</h2>
              <p className="text-center text-muted-foreground">
                {role === "guest" ? "Guest" : "Staff member"} {name} has been successfully registered
                {assignRoom && roomNumber ? ` and assigned to Room ${roomNumber}` : ""}.
              </p>
              <Button onClick={resetForm} className="mt-4">
                Register Another
              </Button>
            </div>
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Registration Form</CardTitle>
              <CardDescription>Enter details and capture a photo for identification</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Photo Identification</Label>
                    <Tabs defaultValue="camera" value={activeTab} onValueChange={handleTabChange} className="mt-2">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="camera">Camera</TabsTrigger>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                      </TabsList>
                      <TabsContent value="camera" className="space-y-4">
                        <div className="border rounded-md overflow-hidden aspect-video bg-muted">
                          {capturedImage ? (
                            <img
                              src={capturedImage || "/placeholder.svg"}
                              alt="Captured"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex justify-center gap-2">
                          {capturedImage ? (
                            <Button type="button" variant="outline" onClick={() => setCapturedImage(null)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Retake
                            </Button>
                          ) : (
                            <Button type="button" onClick={captureImage}>
                              <Camera className="mr-2 h-4 w-4" />
                              Capture
                            </Button>
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value="upload">
                        <div className="border rounded-md overflow-hidden aspect-video bg-muted flex flex-col items-center justify-center p-4">
                          {capturedImage ? (
                            <img
                              src={capturedImage || "/placeholder.svg"}
                              alt="Uploaded"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                              <p className="mt-2 text-sm text-muted-foreground">Drag and drop or click to upload</p>
                              <Input type="file" accept="image/*" className="mt-4" onChange={handleFileUpload} />
                            </div>
                          )}
                        </div>
                        {capturedImage && (
                          <div className="flex justify-center mt-4">
                            <Button type="button" variant="outline" onClick={() => setCapturedImage(null)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <RadioGroup value={role} onValueChange={setRole} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="guest" id="guest" />
                          <Label htmlFor="guest">Guest</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="staff" id="staff" />
                          <Label htmlFor="staff">Staff</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="idType">ID Proof Type</Label>
                      <Select value={idType} onValueChange={setIdType} required>
                        <SelectTrigger id="idType">
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="driverLicense">Driver's License</SelectItem>
                          <SelectItem value="nationalId">National ID</SelectItem>
                          <SelectItem value="employeeId">Employee ID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input
                        id="idNumber"
                        placeholder="Enter ID number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="assignRoom">Assign Room</Label>
                      <Switch id="assignRoom" checked={assignRoom} onCheckedChange={setAssignRoom} />
                    </div>
                    {assignRoom && (
                      <div className="mt-2">
                        <Label htmlFor="roomNumber">Room Number</Label>
                        <Input
                          id="roomNumber"
                          placeholder="Enter room number"
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          required={assignRoom}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting || !capturedImage || !name || !idType || !idNumber || (assignRoom && !roomNumber)
                }
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
      <Toaster />
    </div>
  )
}
