"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"
import api from "@/config/api"
import Link from "next/link"
import {
  FaQrcode,
  FaMapMarkedAlt,
  FaQuestionCircle,
  FaArrowRight,
} from "react-icons/fa"

const toolsSupport = [
  { title: "QR Code Pass", desc: "Entry & check-in", icon: <FaQrcode className="text-xl text-gray-500" />, Link: "" },
  { title: "Venue Maps", desc: "Navigation & locations", icon: <FaMapMarkedAlt className="text-xl text-pink-500" />, Link: "/participants/VeneueMaps" },
  { title: "FAQ & Support", desc: "Help & guidance", icon: <FaQuestionCircle className="text-xl text-yellow-500" />, Link: "/participants/Faqs&Support" },
]

type Toast = {
  message: string
  type: "success" | "error" | "pending"
}

export default function DashboardPage() {
  const eventId = useSelector((state: RootState) => state.event.id)
  const userId = useSelector((state: RootState) => state.user.userId)
  const [participants, setParticipants] = useState<any[]>([])
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    if (!eventId || !userId) return
    api
      .get(`/participant-directory-opt-in-out/opted-in-in-event/${eventId}?userId=${userId}`)
      .then((res) => setParticipants(res.data))
      .catch((err) => showToast("Failed to load participants", "error"))
  }, [eventId, userId])

  const showToast = (message: string, type: Toast["type"]) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleConnect = (participantId: number) => {
    api
      .post(`/connections/send`, { senderId: userId, receiverId: participantId })
      .then((res) => {
        showToast("Connection request sent successfully", "success")
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message || "Failed to send connection request"
        if (msg.toLowerCase().includes("pending")) {
          showToast("Request already pending", "pending")
        } else {
          showToast(msg, "error")
        }
      })
  }

  const toastColor = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return ""
    }
  }

  return (
    <div className="p-8 relative">
      {/* Toast popup */}
      {toast && (
        <div className={`absolute top-4 right-4 px-4 py-2 rounded shadow ${toastColor(toast.type)}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <section className="bg-white rounded-lg shadow p-6 md:p-8 flex-1">
          <h2 className="text-base font-semibold text-black mb-4">Tools & Support</h2>
          <div className="flex flex-col gap-4">
            {toolsSupport.map((tool, index) => (
              <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-8 py-7 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  {tool.icon}
                  <div>
                    <p className="text-sm font-medium text-black">{tool.title}</p>
                    <p className="text-xs text-gray-500">{tool.desc}</p>
                  </div>
                </div>
                <Link href={tool.Link}>
                  <FaArrowRight className="text-[#9B2033] text-2xl ml-auto" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6 md:p-8 flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-black">Opted-in Participants</h2>
          </div>

          <div className="flex flex-col gap-4">
            {participants.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  {p.file ? (
                    <img
                      src={`/files/${p.file}`}
                      alt={p.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {p.name[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-black">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.role}</p>
                  </div>
                </div>
                <button
                  className="text-red-500 text-sm font-semibold hover:underline"
                  onClick={() => handleConnect(p.id)}
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
