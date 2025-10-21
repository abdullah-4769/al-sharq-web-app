"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaCrown, FaFilter, FaMedal, FaSearch } from 'react-icons/fa'
import { FaMapLocationDot, FaShop } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { RootState } from "@/lib/store/store"
import api from '@/config/api'
import Image from 'next/image'

interface SponsorExhibitor {
  id: number
  name: string
  category: string | null
  description: string
  logoUrl?: string
  hall?: string
  link?: string
  location?: string
}

const SponsorsExhibitorsPage: React.FC = () => {
  const eventId = useSelector((state: RootState) => state.event.id)
  const [data, setData] = useState<{ sponsors: SponsorExhibitor[]; exhibitors: SponsorExhibitor[] }>({
    sponsors: [],
    exhibitors: []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/event/eventsrelatedsponsers/${eventId}`)
        const sponsors = res.data.sponsors.map((s: SponsorExhibitor) => ({
          ...s,
          category: s.category?.toLowerCase() === 'gold' ? 'Gold Sponsor' : 'Silver Sponsor'
        }))
        setData({ sponsors, exhibitors: res.data.exhibitors })
      } catch (err) {
        console.error(err)
      }
    }
    if (eventId) fetchData()
  }, [eventId])

  const filteredSponsors = data.sponsors.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const goldSponsors = filteredSponsors.filter(item => item.category === 'Gold Sponsor')
  const silverSponsors = filteredSponsors.filter(item => item.category === 'Silver Sponsor')
  const exhibitors = data.exhibitors.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <div className="flex flex-col items-start justify-between mb-8">
        <div className="flex items-center gap-4 mb-[50px]">
          <Link href="/participants/Home">
            <FaArrowLeft className="text-red-800 w-[20px] h-[20px] cursor-pointer" />
          </Link>
          <h1 className="text-3xl font-bold text-black">Sponsors & Exhibitors</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 gap-2 w-80">
            <FaSearch className="text-red-600" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-black"
            />
          </div>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2 rounded-lg font-medium ${
              selectedCategory === 'All' ? 'bg-red-600 text-white' : 'border border-gray-300 text-black'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('Gold Sponsor')}
            className={`px-6 py-2 rounded-lg font-medium ${
              selectedCategory === 'Gold Sponsor'
                ? 'bg-red-600 text-white'
                : 'border border-gray-300 text-black'
            }`}
          >
            Gold Sponsors
          </button>
          <button
            onClick={() => setSelectedCategory('Silver Sponsor')}
            className={`px-6 py-2 rounded-lg font-medium ${
              selectedCategory === 'Silver Sponsor'
                ? 'bg-red-600 text-white'
                : 'border border-gray-300 text-black'
            }`}
          >
            Silver Sponsors
          </button>
          <button
            onClick={() => setSelectedCategory('Exhibitor')}
            className={`px-6 py-2 rounded-lg font-medium ${
              selectedCategory === 'Exhibitor'
                ? 'bg-red-600 text-white'
                : 'border border-gray-300 text-black'
            }`}
          >
            Exhibitors
          </button>
          <FaFilter className="text-red-600 cursor-pointer" />
        </div>
      </div>

      {goldSponsors.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FaCrown className="text-yellow-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-black">Gold Sponsors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goldSponsors.map((sponsor, index) => (
              <div
                key={sponsor.id}
                className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm flex items-center gap-6"
              >
                <div
                  className={`w-24 h-24 ${
                    index === 0
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600'
                  } rounded-full flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-lg">{sponsor.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-black">{sponsor.name}</h3>
                  <p className="text-black mb-4">{sponsor.description}</p>
                  <div className="flex items-center gap-4">
                    <Link href={sponsor.link || '/participants/SponsorsDetailsScreen'}>
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold">
                        Visit Booth
                      </button>
                    </Link>
                    <Link href={`/participants/SponsorsDetailsScreen/${sponsor.id}`}>
                      <button className="border border-gray-300 text-black px-6 py-2 rounded-lg">
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

      {silverSponsors.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FaMedal className="text-gray-400 w-6 h-6" />
            <h2 className="text-2xl font-bold text-black">Silver Sponsors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {silverSponsors.map((sponsor, index) => (
              <div
                key={sponsor.id}
                className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm flex items-center gap-6"
              >
                <div
                  className={`w-24 h-24 ${
                    index === 0
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600'
                  } rounded-full flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-lg">{sponsor.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-black">{sponsor.name}</h3>
                  <p className="text-black mb-4">{sponsor.description}</p>
                  <div className="flex items-center gap-4">
                    <Link href={sponsor.link || '/participants/SponsorsDetailsScreen'}>
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold">
                        Visit Booth
                      </button>
                    </Link>
                    <Link href={`/participants/SponsorsDetailsScreen/${sponsor.id}`}>
                      <button className="border border-gray-300 text-black px-6 py-2 rounded-lg">
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

      {exhibitors.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FaShop className="text-green-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-black">Exhibitors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {exhibitors.map((exhibitor, index) => {
              const colors = ['bg-[#FF8A65]', 'bg-[#4DB6AC]', 'bg-[#9575CD]', 'bg-[#EC4899]']
              const colorClass = colors[index % colors.length]
              return (
                <Link href={`/participants/ExhibitorsDetailsScreen/${exhibitor.id}`} key={exhibitor.id}>
                  <div className="w-full bg-white border border-gray-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between h-[200px]">
                    <div className="flex items-center gap-4 mb-2">
                      <div
                        className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center`}
                      >
                        <span className="text-white font-bold text-md">{exhibitor.name.charAt(0)}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-black">{exhibitor.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapLocationDot className="text-red-500" />
                      <span className="text-sm font-semibold text-black">
                        {exhibitor.location}
                      </span>
                    </div>
                    <p className="text-sm text-black">{exhibitor.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <Image src="/images/line.png" alt="Line" width={1360} height={127} className="absolute mr-5 " />
    </div>
  )
}

export default SponsorsExhibitorsPage
