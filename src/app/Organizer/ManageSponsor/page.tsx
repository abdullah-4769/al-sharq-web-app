"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  FaArrowLeft,
  FaSearch,
  FaCalendarAlt,
  FaRegListAlt,
  FaPlay,
  FaBookmark,
  FaCrown,
  FaMedal,
} from "react-icons/fa"
import { FaShop } from "react-icons/fa6"
import api from "@/config/api"
import Createsponsor from "./createsponsor/page"
import CreateExhibitor from "./createxhibitor/page" // fixed import

const filters = ["Daily", "Weekly", "10 Days", "90 Days", "All Time"]

const getBadgeGradient = (tier: "gold" | "silver", index: number) => {
  const gradients = {
    gold: [
      "bg-gradient-to-r from-blue-500 to-blue-600",
      "bg-gradient-to-r from-purple-500 to-purple-600",
      "bg-gradient-to-r from-cyan-500 to-blue-500",
    ],
    silver: [
      "bg-gradient-to-r from-purple-500 to-purple-600",
      "bg-gradient-to-r from-red-500 to-red-600",
      "bg-gradient-to-r from-pink-500 to-pink-600",
    ],
  }
  return gradients[tier][index % gradients[tier].length]
}

const SponsorCard = ({
  sponsor,
  index,
  tier,
}: {
  sponsor: { id: number; name: string; description: string }
  index: number
  tier: "gold" | "silver"
}) => {
  const badgeColor = getBadgeGradient(tier, index)
  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm flex items-center gap-6">
      <div className={`w-24 h-24 ${badgeColor} rounded-full flex items-center justify-center`}>
        <span className="text-white font-bold text-2xl">{sponsor.name.charAt(0)}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2 text-black">{sponsor.name}</h3>
        <p className="text-black mb-4">{sponsor.description}</p>
        <div className="flex items-center gap-4">
          <Link href={`/participants/SponsorsDetailsScreen/${sponsor.id}`}>
            <button className="bg-[#9B2033] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#7b1a2c] transition">
              Visit Booth
            </button>
          </Link>
          <Link href={`/participants/SponsorsDetailsScreen/${sponsor.id}`}>
            <button className="border border-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [activeFilter, setActiveFilter] = useState("Daily")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExhibitorModalOpen, setIsExhibitorModalOpen] = useState(false)
  const [goldSponsors, setGoldSponsors] = useState<any[]>([])
  const [silverSponsors, setSilverSponsors] = useState<any[]>([])
  const [exhibitors, setExhibitors] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/event/allsponsors/exhibitors")
        const sponsors = res.data.sponsors.map((s: any) => {
          const category = s.category?.toLowerCase()
          let normalized = "silver"
          if (category === "gold") normalized = "gold"
          return { ...s, category: normalized }
        })
        setGoldSponsors(sponsors.filter((s: any) => s.category === "gold"))
        setSilverSponsors(sponsors.filter((s: any) => s.category === "silver" || s.category === null))
        setExhibitors(res.data.exhibitors || [])
      } catch (err) {
        console.error("Error fetching sponsors", err)
      }
    }
    fetchData()
  }, [])

  const stats = [
    {
      label: "Gold",
      value: goldSponsors.length,
      icon: <FaRegListAlt className="text-blue-600" />,
      iconBg: "bg-blue-100",
    },
    {
      label: "Silver",
      value: silverSponsors.length,
      icon: <FaPlay className="text-green-600" />,
      iconBg: "bg-green-100",
    },
    {
      label: "Booth",
      value: exhibitors.length,
      icon: <FaBookmark className="text-yellow-600" />,
      iconBg: "bg-yellow-100",
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-[#FAFAFA] px-4 md:px-10 py-6 space-y-8 relative">
        <div className="flex items-center gap-3">
          <Link href="/Organizer/Dashboard">
            <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 ml-5">Manage Sponsor</h1>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex bg-white border border-gray-300 rounded-md px-3 py-2 w-full md:w-[300px]">
            <FaSearch className="text-red-900 mr-2 mt-1" />
            <input type="text" placeholder="Search sponsors or exhibitors" className="outline-none text-sm w-full" />
          </div>

          <div className="flex gap-3 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  activeFilter === filter
                    ? "bg-[#86002B] text-white"
                    : "bg-white border border-gray-300 text-gray-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-md text-sm text-gray-700">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            Jan 2024 - Dec 2024
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className={`w-10 h-10 rounded-md ${item.iconBg} flex items-center justify-center mr-4`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-[22px] font-bold text-black leading-none">{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              className="bg-[#9B2033] hover:bg-[#7c062a] transition text-white text-sm px-5 py-2 rounded-md font-medium"
              onClick={() => setIsModalOpen(true)}
            >
              + Create New Sponsor
            </button>
            <button
              className="bg-[#006B5E] hover:bg-[#004d40] transition text-white text-sm px-5 py-2 rounded-md font-medium"
              onClick={() => setIsExhibitorModalOpen(true)}
            >
              + Create New Exhibitor
            </button>
          </div>

          <button className="text-sm text-gray-600 hover:text-black transition underline font-medium">
            View All
          </button>
        </div>

        {/* Gold Sponsors */}
        {goldSponsors.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FaCrown className="text-yellow-500 w-6 h-6" />
              <h2 className="text-2xl font-bold text-black">Gold Sponsors ({goldSponsors.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goldSponsors.map((sponsor, index) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} index={index} tier="gold" />
              ))}
            </div>
          </div>
        )}

        {/* Silver Sponsors */}
        {silverSponsors.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FaMedal className="text-gray-400 w-6 h-6" />
              <h2 className="text-2xl font-bold text-black">Silver Sponsors ({silverSponsors.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {silverSponsors.map((sponsor, index) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} index={index} tier="silver" />
              ))}
            </div>
          </div>
        )}

        {/* Exhibitors */}
        {exhibitors.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FaShop className="text-green-500 w-6 h-6" />
              <h2 className="text-2xl font-bold text-black">Exhibitors ({exhibitors.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exhibitors.map((ex: any, index: number) => (
                <div
                  key={ex.id}
                  className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm flex items-center gap-6"
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">{ex.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-black">{ex.name}</h3>
                    <p className="text-black mb-4">{ex.description}</p>
                    <div className="flex items-center gap-4">
                      <Link href={`/participants/ExhibitorDetails/${ex.id}`}>
                        <button className="bg-[#9B2033] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#7b1a2c] transition">
                          Visit Booth
                        </button>
                      </Link>
                      <Link href={`/participants/ExhibitorsDetailsScreen/${ex.id}`}>
                        <button className="border border-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition">
                          Learn More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Sponsor Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <Createsponsor onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Create Exhibitor Modal */}
      {isExhibitorModalOpen && (
        <div
          className="fixed inset-0  bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsExhibitorModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black font-bold"
              onClick={() => setIsExhibitorModalOpen(false)}
            >
              ✕
            </button>
            <CreateExhibitor onClose={() => setIsExhibitorModalOpen(false)} />
          </div>
        </div>
      )}

      <Image src="/images/line.png" alt="Line" width={1450} height={127} className="absolute" />
    </>
  )
}
