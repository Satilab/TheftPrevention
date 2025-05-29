"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useTheme } from "next-themes"

const data = [
  { name: "Mon", intrusions: 1, alerts: 4, resolved: 3 },
  { name: "Tue", intrusions: 0, alerts: 3, resolved: 3 },
  { name: "Wed", intrusions: 2, alerts: 7, resolved: 5 },
  { name: "Thu", intrusions: 1, alerts: 5, resolved: 4 },
  { name: "Fri", intrusions: 3, alerts: 9, resolved: 7 },
  { name: "Sat", intrusions: 0, alerts: 2, resolved: 2 },
  { name: "Sun", intrusions: 1, alerts: 4, resolved: 3 },
]

export function DashboardChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const textColor = isDark ? "#f8fafc" : "#0f172a"
  const gridColor = isDark ? "#334155" : "#e2e8f0"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" stroke={textColor} />
          <YAxis stroke={textColor} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              color: textColor,
              border: `1px solid ${gridColor}`,
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="intrusions" stroke="#ef4444" activeDot={{ r: 8 }} strokeWidth={2} />
          <Line type="monotone" dataKey="alerts" stroke="#f59e0b" strokeWidth={2} />
          <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
