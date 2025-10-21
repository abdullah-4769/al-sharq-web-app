"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { FaArrowLeft } from "react-icons/fa"
import Link from "next/link"
import { useParams } from "next/navigation"
import api from "@/config/api"
import SpeakerSession from "../Speakersession/page"

const SpeakerDetails = () => {
  const params = useParams()
  const speakerId = params?.id

  const [speaker, setSpeaker] = useState<any>(null)

  useEffect(() => {
    const fetchSpeaker = async () => {
      try {
        if (!speakerId) return
        const res = await api.get(`/speakers/${speakerId}`)
        console.log("Backend response:", res.data)
        setSpeaker(res.data)
      } catch (error) {
        console.error("Error fetching speaker:", error)
      }
    }
    fetchSpeaker()
  }, [speakerId])

  if (!speaker) return <p>Loading...</p>

  return (
    <div className="flex flex-col justify-center items-center p-0 gap-10 w-full max-w-[1280px] mx-auto min-h-screen py-8">
      {/* Header */}
      <div className="flex flex-row items-center gap-10 w-full max-w-[1280px] h-8">
        <Link href="/participants/Speakers">
          <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
        </Link>
        <h1 className="text-2xl font-medium text-[#282828]">Speaker Details</h1>
      </div>

      {/* Speaker Info */}
      <div className="flex flex-col items-center gap-6 w-full max-w-[1280px]">
        <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
          <img
            src={
              speaker.user.file
                ? speaker.user.file.startsWith("http")
                  ? speaker.user.file
                  : `/files/${speaker.user.file}`
                : "/images/default-avatar.png"
            }
            alt={speaker.user.name || "Speaker"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-medium text-[#282828]">{speaker.user.name}</h2>
          <p className="text-base text-[#282828] text-center">
            {speaker.designations.join(" - ")}
          </p>
        </div>
      </div>

      {/* Biography */}
      <div className="w-full max-w-[1280px] p-6 bg-white border border-gray-300 shadow-sm rounded-2xl">
        <h3 className="text-lg font-semibold text-[#282828] mb-4">Biography</h3>
        <p className="text-sm text-[#424242]">{speaker.bio}</p>
      </div>

      {/* Expertise */}
      <div className="w-full max-w-[1280px] p-6 bg-white border border-gray-300 shadow-sm rounded-2xl">
        <h3 className="text-lg font-semibold text-[#282828] mb-4">Areas of Expertise</h3>
        <div className="flex flex-row flex-wrap gap-3">
          {speaker.expertise.map((exp: string, index: number) => (
            <div key={index} className="px-3 py-2 bg-[#FFEFF2] rounded-full">
              <span className="text-sm font-medium text-[#9B2033]">{exp}</span>
            </div>
          ))}
        </div>
      </div>
<div className="w-full">
  <SpeakerSession />
</div>



      {/* Contact */}
      <div className="w-full max-w-[1280px] p-6 bg-white border border-gray-300 shadow-sm rounded-2xl">
        <h3 className="text-lg font-semibold text-[#282828] mb-4">Connect & Contact</h3>
        <div className="flex flex-wrap gap-4">
          {speaker.linkedin && (
            <a
              href={speaker.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 p-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2"
            >
              <Image src="/images/linkedin.png" alt="LinkedIn" width={24} height={24} />
              <span className="text-base text-black">LinkedIn</span>
            </a>
          )}

          {speaker.facebook && (
            <a
              href={speaker.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 p-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2"
            >
              <Image src="/images/facebook.png" alt="Facebook" width={24} height={24} />
              <span className="text-base text-black">Facebook</span>
            </a>
          )}

          {speaker.website && (
            <a
              href={speaker.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 p-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2"
            >
              <Image src="/images/web.png" alt="Website" width={24} height={24} />
              <span className="text-base text-black">Website</span>
            </a>
          )}

          {speaker.user.email && (
            <a
              href={`mailto:${speaker.user.email}`}
              className="flex-1 p-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2"
            >
              <Image src="/images/gmail.png" alt="Email" width={24} height={24} />
              <span className="text-base text-black">Email</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default SpeakerDetails
