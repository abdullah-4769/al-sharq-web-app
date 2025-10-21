"use client"

import React, { useEffect, useState, use } from "react"
import Image from "next/image"
import RelatedSessionsGrid from "@/app/components/relatedsession"
import { FaArrowLeft } from "react-icons/fa"
import Link from "next/link"
import api from "@/config/api"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function SessionPage({ params }: PageProps) {
  const { id } = use(params)

  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)

  const userId = useSelector((state: RootState) => state.user.userId)
  const eventId = useSelector((state: RootState) => state.event.id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/sessions/detail/${id}`)
        setSession(res.data)
      } catch (err) {
        console.error("Failed to fetch session", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleBookmark = async () => {
    try {
      if (!userId || !eventId) {
        console.error("Missing userId or eventId from redux")
        return
      }

      const res = await api.post("/participants/agenda", {
        userId: Number(userId),
        sessionId: Number(id),
        eventId: Number(eventId),
      })

      console.log("Bookmark success:", res.data)
      setBookmarked(true)

    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        console.log("Already in agenda, marking as bookmarked")
        setBookmarked(true)
      } else {
        console.error("Bookmark error:", err)
      }
    }
  }

  if (loading) return <p>Loading...</p>
  if (!session) return <p>No session found</p>

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Link href="/participants/Schedule">
              <FaArrowLeft className="text-red-600 cursor-pointer" size={20} />
            </Link>
            <h1 className="text-xl font-semibold text-black">Session Details</h1>
          </div>
          <button onClick={handleBookmark} className="cursor-pointer">
            <svg
              width="20"
              height="26"
              viewBox="0 0 20 26"
              fill={bookmarked ? "#9B2033" : "none"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 0.5H17.5C18.6161 0.5 19.5 1.3798 19.5 2.4375V24.7656C19.5 25.1581 19.1682 25.5 18.7344 25.5C18.5709 25.5 18.4155 25.4524 18.2891 25.3652L18.2871 25.3633L10.2822 19.8994L10 19.707L9.71777 19.8994L1.71289 25.3633L1.71094 25.3652C1.58453 25.4524 1.42912 25.5 1.26562 25.5C0.831842 25.5 0.5 25.1581 0.5 24.7656V2.4375C0.5 1.3798 1.38393 0.5 2.5 0.5Z"
                stroke="#9B2033"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-6 p-6 max-w-7xl mx-auto py-6 border border-gray-200 rounded-xl bg-white">
        <div className="flex justify-between text-xs text-red-700 font-semibold mb-1 ml-2">
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-xl">
            {session.category}
          </span>
          <div>
            {new Date(session.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(session.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        <h1 className="text-lg font-bold mb-1 text-black ml-2">{session.title}</h1>
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-4 ml-2">
          <div className="flex items-center space-x-2">
            <img src="/images/Vector.png" alt="Hall Icon" className="w-4 h-4" />
            <strong>{session.location}</strong>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/images/Vector (1).png" alt="Duration Icon" className="w-4 h-4" />
            <span>
              {Math.floor(
                (new Date(session.endTime).getTime() -
                  new Date(session.startTime).getTime()) /
                  60000
              )}{" "}
              mins
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/images/Vector (2).png" alt="Capacity Icon" className="w-4 h-4" />
            <span>{session.capacity} capacity</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 ml-2">{session.description}</p>
      </div>

      {session.speakers?.map((speaker: any) => (
        <section
          key={speaker.id}
          className="max-w-8xl mx-auto px-6 bg-white rounded-lg p-6 flex items-center space-x-4 shadow-sm border border-gray-200 mb-6"
        >
          <img
            src={speaker.user?.photo || "/images/img (13).png"}
            alt={speaker.user?.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1 text-xs text-gray-800">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-base">{speaker.user?.name}</h3>
              {speaker.designations && speaker.designations.length > 0 && (
                <span className="text-gray-600">{speaker.designations.join(" • ")}</span>
              )}
              {speaker.category && (
                <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-xl">
                  {speaker.category}
                </span>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed">{speaker.bio}</p>
          </div>
        </section>
      ))}

      {/* New card showing tags, registration, and event title */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
        
          <div className="flex flex-wrap gap-2 mb-2">
            {session.tags?.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-xl"
              >
                {tag}
              </span>
            ))}
          </div>
      
       
          <p className="text-xs text-gray-600 my-4">
          {session.registrationRequired ? "Registration Required" : "No Registration Required"}
          </p>
         <h2 className="text-sm font-semibold text-black mb-2">{session.event?.title}</h2>
        </div>
      </div>

      <RelatedSessionsGrid />

      <section className="max-w-7xl mx-auto px-6 mt-6">
        <h2 className="text-base font-semibold mb-3 text-black">Who's Attending</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-4">
              {session.registeredUsers?.slice(0, 5).map((user: any, idx: number) => (
                <img
                  key={idx}
                  src={user.photo ? `/uploads/${user.photo}` : "/images/img (13).png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-2">
              {session.registrationCount} registered attendees
            </span>
          </div>
          <button className="text-red-700 hover:text-red-900">
            <svg
              width="30"
              height="26"
              viewBox="0 0 30 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.3722 11.4704C30.2093 12.3164 30.2093 13.6904 29.3722 14.5364L18.6573 25.3655C17.8202 26.2115 16.4607 26.2115 15.6236 25.3655C14.7865 24.5195 14.7865 23.1455 15.6236 22.2995L22.6888 15.1658H2.14298C0.957643 15.1658 0 14.198 0 13C0 11.802 0.957643 10.8342 2.14298 10.8342H22.6821L15.6303 3.70051C14.7932 2.85448 14.7932 1.48054 15.6303 0.634518C16.4674 -0.211506 17.8269 -0.211506 18.664 0.634518L29.3789 11.4636L29.3722 11.4704Z"
                fill="#9B2033"
              />
            </svg>
          </button>
        </div>
      </section>

      <Image
        src="/images/line.png"
        alt="Line"
        width={1729}
        height={127}
        className="absolute"
      />
    </>
  )
}
