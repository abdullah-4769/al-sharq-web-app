'use client'

import React, { useState, useEffect } from 'react'
import { FaArrowLeft, FaCalendar, FaClock, FaPlay } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'

import api from '@/config/api'
import { setEventId } from '@/lib/store/features/event/eventSlice'

const LiveLoaction3 = dynamic(() => import('@/app/components/LiveLoaction3'), { ssr: false })

type EventType = {
  id: number
  name: string
  description: string
  googleMapLink: string
  totalSessions: number
}

type DataType = {
  totalSessions: number
  liveSessions: number
  scheduledSessions: number
  events: EventType[]
}

const VenueMaps: React.FC = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DataType>({
    totalSessions: 0,
    liveSessions: 0,
    scheduledSessions: 0,
    events: [],
  })
  const [eventIdInput, setEventIdInput] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/event/summary/mapview')
        setData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-[500px]">Loading...</div>
  }

  const handleCardClick = (eId: number) => {
    dispatch(setEventId(eId))
    setEventIdInput(eId)
    router.push('/participants/Home')
  }

  return (
    <div className="flex flex-col items-end p-0 gap-8 w-full max-w-[1280px] h-auto absolute left-20 top-38">
      <div className="flex flex-row items-center p-0 gap-8 w-[1280px] h-6">
        <Link href="/Organizer/Dashboard">
          <FaArrowLeft className="w-9 h-9 text-[#7e0505]" />
        </Link>
        <h1 className="font-medium text-4xl leading-6 text-[#282828]">Venue Maps</h1>
      </div>

      <div className="flex flex-row items-start p-0 gap-6 w-[1280px] h-[103px]">
        <div className="flex flex-col items-start p-5 gap-8 w-[410.67px] h-[103px] bg-white border border-[#E6E6E6] shadow rounded-3xl">
          <div className="flex flex-row items-center p-0 gap-8 w-[356.67px] h-[63px]">
            <div className="w-12 h-12 bg-[#DBEAFE] rounded-2xl flex items-center justify-center">
              <FaCalendar className="w-5 h-7 text-[#2563EB]" />
            </div>
            <div className="flex flex-col items-start p-0 gap-4">
              <span className="font-semibold text-6xl leading-[50%] text-[rgba(0,0,0,0.7)]">{data.totalSessions}</span>
              <span className="font-normal text-lg leading-[140%] text-[#414141]">Total Sessions</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start p-5 gap-8 w-[410.67px] h-[103px] bg-white border border-[#E6E6E6] shadow rounded-3xl">
          <div className="flex flex-row items-center p-0 gap-8 w-[356.67px] h-[63px]">
            <div className="w-12 h-12 bg-[#DCFCE7] rounded-2xl flex items-center justify-center">
              <FaPlay className="w-5 h-7 text-[#16A34A]" />
            </div>
            <div className="flex flex-col items-start p-0 gap-4">
              <span className="font-semibold text-6xl leading-[50%] text-[rgba(0,0,0,0.7)]">{data.liveSessions}</span>
              <span className="font-normal text-lg leading-[140%] text-[#414141]">Ongoing</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start p-5 gap-8 w-[410.67px] h-[103px] bg-white border border-[#E6E6E6] shadow rounded-3xl">
          <div className="flex flex-row items-center p-0 gap-8 w-[356.67px] h-[63px]">
            <div className="w-12 h-12 bg-[#FEF9C3] rounded-2xl flex items-center justify-center">
              <FaClock className="w-5 h-7 text-[#CA8A04]" />
            </div>
            <div className="flex flex-col items-start p-0 gap-4">
              <span className="font-semibold text-6xl leading-[50%] text-[rgba(0,0,0,0.7)]">{data.scheduledSessions}</span>
              <span className="font-normal text-lg leading-[140%] text-[#414141]">Scheduled</span>
            </div>
          </div>
        </div>
      </div>

      <LiveLoaction3 />

      <div className="flex flex-row items-center p-0 gap-4 w-[1280px] h-11">
        <div className="flex flex-col justify-center items-center p-4 gap-2.5 w-[1280px] h-11 border border-[#E8E8E8] rounded-2xl">
          <div className="flex flex-row items-center p-0 gap-3 w-[1240px] h-6">
            <FiSearch className="w-6 h-6 text-red-500" />
            <input
              type="number"
              value={eventIdInput ?? ''}
              onChange={(e) => setEventIdInput(Number(e.target.value))}
              placeholder="Search Venue by ID"
              className="w-full border-none outline-none text-[#706f6f] text-base"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start p-0 gap-6 w-[1280px] h-auto">
        {data.events.map((event) => (
          <div
            key={event.id}
            onClick={() => handleCardClick(event.id)}
            className="flex flex-row justify-between p-6 gap-6 w-[1280px] h-[213px] bg-white border border-[#D4D4D4] shadow rounded-3xl cursor-pointer hover:bg-gray-50"
          >
            <div className="flex flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">EV</span>
              </div>
              <div className="flex flex-col justify-center gap-2">
                <span className="font-semibold text-lg text-[#282828]">{event.name}</span>
                <span className="font-normal text-sm text-[#424242]">{event.description}</span>
              </div>
            </div>
            <div className="flex flex-col justify-between items-end">
              <span className="bg-[#F0F0F0] px-4 py-1 rounded-full font-semibold text-lg text-[#282828]">
                {event.totalSessions} Sessions
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VenueMaps
