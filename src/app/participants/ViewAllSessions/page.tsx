"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaArrowLeft, 
  FaArrowRight, 
  FaMapMarkerAlt, 
  FaLock, 
  FaQrcode 
} from "react-icons/fa"
import DiscoverMoreSessions from "../../components/DiscoverMoreSessions"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

// parse session duration
const parseDuration = (duration: string) => {
  if (!duration) return { startTime: null, endTime: null }
  const parts = duration.split(" - ").map((p) => p.trim())
  const start = new Date(parts[0])
  const end = new Date(parts[1])
  return { startTime: isNaN(start.getTime()) ? null : start, endTime: isNaN(end.getTime()) ? null : end }
}

export default function MyAgendaPage() {
  const eventId = useSelector((state: RootState) => state.event.id)
  const [activeFilter, setActiveFilter] = useState("All Time")
  const [searchText, setSearchText] = useState("")
  const [sessions, setSessions] = useState<any[]>([])
  const [filteredSessions, setFilteredSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [emptyMessage, setEmptyMessage] = useState("")

  // fetch all sessions
  const fetchSessions = async () => {
    if (!eventId) {
      setEmptyMessage("Event not selected")
      setLoading(false)
      return
    }
    try {
      const res = await api.get(`/event/event-sessions/${eventId}`)
      const data = res.data

      const all = [...(data.liveSessions || []), ...(data.allSessions || [])]
      const transformed = all.map((s: any) => ({ ...s, ...parseDuration(s.duration || "") }))

      setSessions(transformed)
      setFilteredSessions(transformed)
      if (transformed.length === 0) setEmptyMessage("No sessions available")
    } catch {
      setEmptyMessage("Failed to load sessions")
      setSessions([])
      setFilteredSessions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [eventId])

  // filter sessions
  useEffect(() => {
    let filtered = [...sessions]
    const now = new Date()

    if (activeFilter === "Daily") {
      filtered = filtered.filter(s => s.startTime && s.startTime.toDateString() === now.toDateString())
    } else if (activeFilter === "Weekly") {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      filtered = filtered.filter(s => s.startTime && s.startTime >= weekStart && s.startTime <= weekEnd)
    } else if (activeFilter === "10 Days") {
      const start = new Date()
      const end = new Date()
      end.setDate(start.getDate() + 10)
      filtered = filtered.filter(s => s.startTime && s.startTime >= start && s.startTime <= end)
    } else if (activeFilter === "90 Days") {
      const start = new Date()
      const end = new Date()
      end.setDate(start.getDate() + 90)
      filtered = filtered.filter(s => s.startTime && s.startTime >= start && s.startTime <= end)
    }

    if (searchText) {
      filtered = filtered.filter(s => s.sessionTitle.toLowerCase().includes(searchText.toLowerCase()))
    }

    setFilteredSessions(filtered)
    if (filtered.length === 0) setEmptyMessage("No sessions found")
  }, [activeFilter, searchText, sessions])

  return (
    <div className="p-6 md:p-10 min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/participants/Home">
          <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
        </Link>
        <h1 className="text-xl font-semibold text-black">All Sessions</h1>
      </div>

      {/* Controls */}
      <div className="flex md:flex-nowrap justify-between mb-8 md:gap-5 flex-wrap gap-3">
        <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 w-[385px]">
          <FaSearch className="text-red-900 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="outline-none text-sm w-full text-black"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1 rounded-xl text-sm font-medium cursor-pointer ${activeFilter === f
                ? "bg-[#86002B] text-white"
                : "bg-white border border-gray-300 text-black hover:bg-gray-100"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-md text-sm text-gray-700">
          <FaCalendarAlt className="mr-2 text-gray-500" />
          Jan 2024 - Dec 2024
        </div>
      </div>

      {/* Sessions */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#9B2033] rounded-full animate-spin"></div>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-black text-lg font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredSessions.map((s, i) => (
            <div
              key={`${s?.sessionId ?? "session"}-${i}`}
              className={`${i % 2 === 0 ? "bg-red-800 text-gray-200" : "bg-white text-red-800"
                } p-6 md:p-10 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center border border-red-800`}
            >
              <div className="flex gap-1 flex-col">
                <div className="flex items-center gap-2">
                  <p className="mt-2 text-lg md:text-xl font-bold">
                    {s.sessionTitle || "No title"}
                  </p>

                  {/* Registration condition */}
                  {s.registrationRequired ? (
                    <FaLock title="Registration Required" className="text-sm text-yellow-500 mt-2" />
                  ) : (
                    <FaQrcode title="No Registration Needed" className="text-sm text-green-500" />
                  )}
                </div>

                <p className="text-xs mt-1">{s.event?.eventDescription || "No description"}</p>

                <div className="flex items-center text-xs gap-2 mt-1">
                  <FaCalendarAlt className={`${i % 2 === 0 ? "text-white" : "text-red-800"}`} />
                  <span>
                    {s.startTime && s.endTime
                      ? `${s.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${s.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : "No time available"}
                  </span>
                </div>

                <p className="text-sm flex items-center gap-2 mt-1">
                  <FaMapMarkerAlt className="text-base" />
                  {s.location || "No location"}
                </p>
              </div>

              <button className="mt-4 md:mt-0 text-xl">
                <Link href={s?.sessionId ? `/participants/SessionDetail1/${s.sessionId}` : "#"}>
                  <FaArrowRight className={`${i % 2 === 0 ? "text-gray-200" : "text-red-800"}`} />
                </Link>
              </button>
            </div>
          ))}
        </div>
      )}

      <DiscoverMoreSessions />
      <Image src="/images/line.png" alt="Line" width={1729} height={127} className="absolute" />
    </div>
  )
}
