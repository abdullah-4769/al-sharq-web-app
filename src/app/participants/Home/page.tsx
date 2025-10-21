"use client";

import React, { useEffect, useState } from "react";
import TodaysSchedule from "../../components/TodaysSchedule";
import QuickAccess from "../../components/QuickAcess";
import ToolsAndConnections from "../../components/ToolsAndConnections";

import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import api from "@/config/api";
import Link from "next/link";

interface Banner {
  sessionId: number
  type: string;
  category: string;
  startTime: string;
  endTime: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
}

const parseDuration = (duration: string) => {
  const parts = duration.split(" - ");
  if (parts.length === 2) {
    const start = new Date(parts[0].trim());
    const end = new Date(parts[1].trim());
    return {
      startTime: isNaN(start.getTime())
        ? ""
        : start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      endTime: isNaN(end.getTime())
        ? ""
        : end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }
  return { startTime: "", endTime: "" };
};

const motivationalLines = [
  "Don’t miss this session, it’s full of insights",
  "Join now to learn new skills and ideas",
  "Be part of this session, it’s highly recommended"
];

export default function Home() {
  const eventId = useSelector((state: RootState) => state.event.id);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [nextSessions, setNextSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState("");

  const fetchSessions = async () => {
    if (!eventId) {
      setEmptyMessage("Event not selected")
      setLoading(false)
      return;
    }
    try {
      setLoading(true)
      const res = await api.get(`/event/event-sessions/${eventId}`);
      const data = res.data;
      console.log("Fetched sessions data:", data);
      const liveBanners: Banner[] = (data.liveSessions || []).map((s: any) => {
        const { startTime, endTime } = parseDuration(s.duration);
        return {
          sessionId: s.sessionId,
          type: "Live",
          category: s.category || "N/A",
          startTime,
          endTime,
          subtitle: s.location || "",
          bgColor: "bg-red-800",
          textColor: "text-white",
          buttonColor: "text-white",
        };
      });

      const latestBanners: Banner[] = (data.allSessions || [])
        .filter((s: any) => !s.isLive)
        .slice(0, 1)
        .map((s: any) => {
          const { startTime, endTime } = parseDuration(s.duration);
          return {
            sessionId: s.sessionId,
            type: "Latest Update",
            category: s.category || "N/A",
            startTime,
            endTime,
            subtitle: s.location || "",
            bgColor: "bg-white",
            textColor: "text-red-800",
            buttonColor: "text-red-700",
          };
        });

      setBanners([...liveBanners, ...latestBanners]);

      const next = (data.allSessions || []).slice(1, 2).map((s: any) => {
        const { startTime } = parseDuration(s.duration);
        return {
          sessionId: s.sessionId,
          startTime: startTime || "TBD",
          category: s.category || "N/A",
          speaker: s.speakerName || "Unknown",
          location: s.location || "TBD"
        };
      });
      setNextSessions(next);

      if (liveBanners.length + latestBanners.length === 0 && next.length === 0) {
        setEmptyMessage("No sessions available")
      } else {
        setEmptyMessage("")
      }
    } catch (err) {
      console.error("Error fetching sessions:", err)
      setEmptyMessage("Failed to load sessions")
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [eventId]);

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-4 py-6">

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
          </div>
        ) : emptyMessage ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-black text-lg font-medium">{emptyMessage}</p>
          </div>
        ) : (
          <>
            {banners.map((banner, index) => {
              const bgColor = banner.bgColor;
              const textColor = banner.textColor;
              const buttonColor = banner.buttonColor;

              return (
                <div
                  key={index}
                  className={`${bgColor} p-1 md:py-4 md:px-8 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center mb-4`}
                >
                  <div>
                    <span className="bg-[#9E9E5C] text-white px-4 py-1 rounded-full text-xs md:text-sm font-semibold">
                      {banner.type}
                    </span>
                    <p className={`mt-2 text-lg md:text-xl font-bold ${textColor}`}>
                      {banner.category} start at {banner.startTime && banner.endTime ? ` ${banner.startTime} ` : ""}
                    </p>
                    <p className={`text-sm ${textColor}`}>
                      {banner.subtitle} - {motivationalLines[index % motivationalLines.length]}
                    </p>
                  </div>
                  <Link href={`/participants/SessionDetail1/${banner.sessionId}`}>
                    <button className={`mt-4 md:mt-0 ${buttonColor} text-xl`}>
                      <FaArrowRight />
                    </button>
                  </Link>
                </div>
              )
            })}

            <div className="flex justify-between items-center mb-4 px-2 md:px-4">
              <h2 className="text-lg md:text-xl font-semibold text-black">Today's Schedule</h2>
              <p className="text-black hover:text-red-700 text-sm md:text-base font-medium cursor-pointer">
                <Link href={"/participants/ViewAllSessions"}>View All</Link>
              </p>
            </div>

            <div className="mb-8 space-y-4">
              {nextSessions.map((session, index) => (
                <div key={index} className="bg-white p-4 md:p-6 rounded-xl shadow flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 max-w-full border border-gray-300">
                  <div className="p-2">
                    <p className="text-black text-center text-xs md:text-md font-semibold">Next</p>
                    <p className="text-red-700 text-xl text-center md:text-sm font-bold leading-tight">{session.startTime}</p>
                  </div>
                  <div className="flex-1 md:px-4">
                    <p className="font-semibold text-black">{session.category}</p>
                    <p className="text-sm text-gray-600">{session.location}</p>
                  </div>
                  <Link href={`/event/${session.sessionId}`}>
                    <button className={`mt-4 md:mt-0 text-red-800 text-xl`}>
                      <FaArrowRight />
                    </button>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <QuickAccess />
            </div>
            <div className="mt-8">
              <ToolsAndConnections />
            </div>
          </>
        )}

      </div>

      <Image
        src="/images/line.png"
        alt="Line"
        width={1450}
        height={127}
        className="w-full h-auto mt-10"
      />
    </main>
  );
}
