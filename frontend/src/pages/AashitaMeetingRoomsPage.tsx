import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Server,
  Code2,
  Building2,
  Info,
  X,
  ShieldCheck,
} from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  equipment?: string[];
}

interface Booking {
  id: number;
  room_id: number;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface ToastMessage {
  id: string;
  type: "success" | "error" | "conflict" | "info";
  message: string;
}

const INITIAL_ROOMS: Room[] = [
  { id: 1, name: "Atlas", location: "Floor 1 — East Wing", capacity: 6, equipment: ["4K Display", "Video Conf", "Whiteboard"] },
  { id: 2, name: "Horizon", location: "Floor 1 — West Wing", capacity: 10, equipment: ["Dual TV", "Polycom Audio", "Glassboard"] },
  { id: 3, name: "Zenith", location: "Floor 2 — North", capacity: 4, equipment: ["Smart Screen", "Acoustic Pod"] },
  { id: 4, name: "Meridian", location: "Floor 2 — South", capacity: 12, equipment: ["Projector 4K", "Ceiling Mic Array", "Touchboard"] },
  { id: 5, name: "Apex", location: "Floor 3 — Boardroom", capacity: 20, equipment: ["Executive Telepresence", '85" Display', "Motorized Blinds"] },
];

const TODAY = new Date().toISOString().split("T")[0];

const INITIAL_BOOKINGS: Booking[] = [
  { id: 101, room_id: 1, title: "Sprint Planning & Standup", date: TODAY, start_time: "09:30", end_time: "11:00" },
  { id: 102, room_id: 1, title: "Client Demo — Aashita Tech", date: TODAY, start_time: "14:00", end_time: "15:30" },
  { id: 103, room_id: 2, title: "Product Roadmap Q4", date: TODAY, start_time: "10:00", end_time: "12:00" },
  { id: 104, room_id: 4, title: "Executive Leadership Sync", date: TODAY, start_time: "11:00", end_time: "13:00" },
  { id: 105, room_id: 5, title: "Board Review & Investor Pitch", date: TODAY, start_time: "15:00", end_time: "17:00" },
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

export function AashitaMeetingRoomsPage(): JSX.Element {
  useDocumentTitle("Aashita Tech — Meeting Room Booking System (FastAPI + Next.js)");

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedDate, setSelectedDate] = useState<string>(TODAY);
  const [selectedRoomId, setSelectedRoomId] = useState<number | "all">("all");
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"booking" | "architecture">("booking");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalRoomId, setModalRoomId] = useState<number>(1);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDate, setFormDate] = useState<string>(TODAY);
  const [formStartTime, setFormStartTime] = useState<string>("11:00");
  const [formEndTime, setFormEndTime] = useState<string>("12:00");
  const [formConflictWarning, setFormConflictWarning] = useState<string | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage["type"], message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/rooms", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setRooms(data.map((r: any) => ({
              ...r,
              equipment: INITIAL_ROOMS.find((ir) => ir.id === r.id)?.equipment || ["Video Conf", "Display"]
            })));
            setIsBackendConnected(true);

            const bRes = await fetch(`http://localhost:8000/api/bookings?date=${selectedDate}`);
            if (bRes.ok) {
              const bData = await bRes.json();
              setBookings(bData.map((b: any) => ({
                id: b.id,
                room_id: b.room_id,
                title: b.title,
                date: b.date,
                start_time: b.start_time.substring(0, 5),
                end_time: b.end_time.substring(0, 5),
              })));
            }
          }
        } else {
          setIsBackendConnected(false);
        }
      } catch {
        setIsBackendConnected(false);
      }
    };

    checkBackend();
  }, [selectedDate]);

  const findConflict = (roomId: number, date: string, start: string, end: string, excludeId?: number) => {
    return bookings.find((b) => {
      if (b.room_id !== roomId || b.date !== date) return false;
      if (excludeId && b.id === excludeId) return false;
      return start < b.end_time && end > b.start_time;
    });
  };

  useEffect(() => {
    if (!isModalOpen) return;
    if (formEndTime <= formStartTime) {
      setFormConflictWarning("End time must be after start time.");
      return;
    }
    const conflict = findConflict(modalRoomId, formDate, formStartTime, formEndTime);
    if (conflict) {
      setFormConflictWarning(`Conflict with: "${conflict.title}" (${conflict.start_time}–${conflict.end_time})`);
    } else {
      setFormConflictWarning(null);
    }
  }, [modalRoomId, formDate, formStartTime, formEndTime, bookings, isModalOpen]);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      addToast("error", "Please provide a meeting title.");
      return;
    }
    if (formEndTime <= formStartTime) {
      addToast("error", "End time must be after start time.");
      return;
    }

    const conflict = findConflict(modalRoomId, formDate, formStartTime, formEndTime);
    if (conflict) {
      addToast("conflict", `Conflict detected: "${conflict.title}" is already booked from ${conflict.start_time} to ${conflict.end_time}.`);
      return;
    }

    if (isBackendConnected) {
      try {
        const res = await fetch(`http://localhost:8000/api/bookings/${modalRoomId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle.trim(),
            date: formDate,
            start_time: `${formStartTime}:00`,
            end_time: `${formEndTime}:00`,
          }),
        });

        if (res.ok) {
          const newB = await res.json();
          setBookings((prev) => [
            ...prev,
            {
              id: newB.id,
              room_id: newB.room_id,
              title: newB.title,
              date: newB.date,
              start_time: newB.start_time.substring(0, 5),
              end_time: newB.end_time.substring(0, 5),
            },
          ]);
          addToast("success", `Booking "${formTitle}" confirmed on FastAPI backend!`);
          setIsModalOpen(false);
          setFormTitle("");
          return;
        } else if (res.status === 409) {
          const errData = await res.json();
          addToast("conflict", errData.detail?.message || "Time slot conflict on server.");
          return;
        }
      } catch {
        // client fallback
      }
    }

    const newBooking: Booking = {
      id: Date.now(),
      room_id: modalRoomId,
      title: formTitle.trim(),
      date: formDate,
      start_time: formStartTime,
      end_time: formEndTime,
    };
    setBookings((prev) => [...prev, newBooking]);
    addToast("success", `Booking "${formTitle}" confirmed for Room #${modalRoomId}!`);
    setIsModalOpen(false);
    setFormTitle("");
  };

  const handleCancelBooking = async (id: number, title: string) => {
    if (isBackendConnected) {
      try {
        const res = await fetch(`http://localhost:8000/api/bookings/${id}`, { method: "DELETE" });
        if (res.ok) {
          setBookings((prev) => prev.filter((b) => b.id !== id));
          addToast("info", `Booking "${title}" cancelled on backend.`);
          return;
        }
      } catch { /* ignore */ }
    }

    setBookings((prev) => prev.filter((b) => b.id !== id));
    addToast("info", `Booking "${title}" cancelled successfully.`);
  };

  const calculateNextSlot = (roomId: number, durationMinutes: number = 60) => {
    const roomBookings = bookings
      .filter((b) => b.room_id === roomId && b.date === selectedDate)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    let candidateStart = "09:00";
    const dayEnd = "18:00";

    const addMinutes = (timeStr: string, mins: number) => {
      const [h, m] = timeStr.split(":").map(Number);
      const total = h * 60 + m + mins;
      const rh = Math.floor(total / 60);
      const rm = total % 60;
      return `${String(rh).padStart(2, "0")}:${String(rm).padStart(2, "0")}`;
    };

    for (const b of roomBookings) {
      const neededEnd = addMinutes(candidateStart, durationMinutes);
      if (neededEnd <= b.start_time) {
        return `${candidateStart} – ${neededEnd}`;
      }
      if (b.end_time > candidateStart) {
        candidateStart = b.end_time;
      }
    }

    const finalNeededEnd = addMinutes(candidateStart, durationMinutes);
    if (finalNeededEnd <= dayEnd) {
      return `${candidateStart} – ${finalNeededEnd}`;
    }

    return "No slots available today";
  };

  const filteredRooms = selectedRoomId === "all" ? rooms : rooms.filter((r) => r.id === selectedRoomId);
  const filteredBookings = bookings.filter((b) => {
    const matchesDate = b.date === selectedDate;
    const matchesRoom = selectedRoomId === "all" || b.room_id === selectedRoomId;
    return matchesDate && matchesRoom;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* ── TOAST CONTAINER ─────────────────────────────────────────────────── */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl border flex items-start gap-3 backdrop-blur-md transition-all ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : toast.type === "conflict"
                ? "bg-amber-50 border-amber-300 text-amber-900"
                : toast.type === "error"
                ? "bg-rose-50 border-rose-300 text-rose-900"
                : "bg-indigo-50 border-indigo-300 text-indigo-900"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === "conflict" && <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />}
            {toast.type === "error" && <X className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />}
            {toast.type === "info" && <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />}
            <div className="text-xs font-semibold leading-relaxed">{toast.message}</div>
          </div>
        ))}
      </div>

      {/* ── HERO BANNER (PURE LIGHT DESIGN) ─────────────────────────────────── */}
      <div className="relative border-b border-slate-200 bg-white pt-8 pb-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Aashita Tech Project Showcase
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className={`h-2.5 w-2.5 rounded-full ${isBackendConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              <span className="text-slate-600 font-mono font-semibold">
                {isBackendConnected ? "FastAPI Live Backend (Port 8000)" : "Interactive Client Engine"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Meeting Room <span className="text-indigo-600">Booking System</span>
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                A full-stack meeting room management system built with <strong>Python FastAPI</strong> and <strong>Next.js 14 (App Router)</strong>. Enforces business hours (09:00–18:00), detects room overlapping conflicts in real-time with HTTP 409 responses, and computes next available booking slots.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["5 Pre-Seeded Rooms", "Conflict Engine (HTTP 409)", "Next Slot Algorithm", "09:00–18:00 Business Hours", "PostgreSQL / SQLite"].map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Live Booking Summary</span>
                  <Building2 className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-xl font-extrabold text-indigo-600">{rooms.length}</div>
                    <div className="text-[11px] font-medium text-slate-500">Conference Rooms</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-xl font-extrabold text-emerald-600">{filteredBookings.length}</div>
                    <div className="text-[11px] font-medium text-slate-500">Scheduled Today</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setModalRoomId(rooms[0]?.id || 1);
                    setFormDate(selectedDate);
                    setFormStartTime("11:00");
                    setFormEndTime("12:00");
                    setFormConflictWarning(null);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Book a Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT TABS ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("booking")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === "booking"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Calendar className="h-4 w-4" /> Live Rooms &amp; Timelines
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("architecture")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === "architecture"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Server className="h-4 w-4" /> FastAPI Architecture &amp; Next.js Specs
          </button>
        </div>

        {activeTab === "booking" && (
          <div className="space-y-6">
            {/* ── FILTER & DATE SELECTOR BAR ─────────────────────────────────────── */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs text-slate-600 font-semibold">Date:</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-slate-900 font-mono text-xs font-bold focus:outline-none cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-1">
                  {["Today", "Tomorrow"].map((dLabel) => {
                    const targetD = dLabel === "Today" ? TODAY : new Date(Date.now() + 86400000).toISOString().split("T")[0];
                    const isSelected = selectedDate === targetD;
                    return (
                      <button
                        key={dLabel}
                        type="button"
                        onClick={() => setSelectedDate(targetD)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {dLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Room Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSelectedRoomId("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedRoomId === "all"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  All Rooms ({rooms.length})
                </button>
                {rooms.map((r) => {
                  const isSelected = selectedRoomId === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRoomId(r.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {r.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── ROOMS GRID ───────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRooms.map((room) => {
                const roomBookings = bookings
                  .filter((b) => b.room_id === room.id && b.date === selectedDate)
                  .sort((a, b) => a.start_time.localeCompare(b.start_time));
                const nextSlot = calculateNextSlot(room.id, 60);

                return (
                  <div
                    key={room.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 transition flex flex-col justify-between space-y-4 shadow-sm group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {room.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600">
                              #{room.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {room.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                          <Users className="h-3.5 w-3.5" />
                          <span>{room.capacity}</span>
                        </div>
                      </div>

                      {room.equipment && (
                        <div className="flex flex-wrap gap-1.5">
                          {room.equipment.map((eq, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-medium">
                              {eq}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 09:00 - 18:00 Timeline Bar */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">09:00 – 18:00 Schedule</span>
                          <span className="font-mono text-[10px] text-indigo-600 font-bold">{roomBookings.length} bookings</span>
                        </div>
                        <div className="h-4 w-full bg-slate-100 rounded-lg p-0.5 flex gap-0.5 border border-slate-200 overflow-hidden">
                          {Array.from({ length: 18 }).map((_, idx) => {
                            const hourFloat = 9 + idx * 0.5;
                            const slotHour = Math.floor(hourFloat);
                            const slotMin = hourFloat % 1 === 0 ? "00" : "30";
                            const slotTime = `${String(slotHour).padStart(2, "0")}:${slotMin}`;
                            const isBooked = roomBookings.some((b) => slotTime >= b.start_time && slotTime < b.end_time);

                            return (
                              <div
                                key={idx}
                                title={`${slotTime} — ${isBooked ? "Booked" : "Available"}`}
                                className={`flex-1 rounded-[3px] transition-colors ${
                                  isBooked ? "bg-rose-500 shadow-xs" : "bg-emerald-400/50 hover:bg-emerald-500"
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Next Slot Finder Chip */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Clock className="h-3.5 w-3.5 text-indigo-600" />
                          <span className="text-[11px] font-medium">Earliest Slot (60m):</span>
                        </div>
                        <span className="font-mono font-bold text-indigo-700 text-[11px]">
                          {nextSlot}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setModalRoomId(room.id);
                        setFormDate(selectedDate);
                        setFormStartTime("11:00");
                        setFormEndTime("12:00");
                        setFormConflictWarning(null);
                        setIsModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-800 hover:text-white text-xs font-bold border border-slate-200 hover:border-indigo-600 flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Book {room.name}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── CURRENT BOOKINGS LIST ────────────────────────────────────────── */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Bookings for {selectedDate}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                  {filteredBookings.length} scheduled
                </span>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs font-medium">
                  No meetings scheduled for this date. Click &quot;Book a Room&quot; above to create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredBookings.map((b) => {
                    const r = rooms.find((rm) => rm.id === b.room_id);
                    return (
                      <div
                        key={b.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-slate-900">{b.title}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
                            <span className="text-indigo-600 font-bold">{r?.name || `Room #${b.room_id}`}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-semibold">{b.start_time} – {b.end_time}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(b.id, b.title)}
                          title="Cancel this booking"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ARCHITECTURE TAB ───────────────────────────────────────────────── */}
        {activeTab === "architecture" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    FastAPI + Next.js 14 Architecture &amp; Conflict Engine
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200">
                  FastAPI • SQLAlchemy 2.0 • Pydantic v2
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-indigo-700 font-bold flex items-center gap-2">
                    <Code2 className="h-4 w-4" /> FastAPI Endpoints
                  </div>
                  <div className="text-slate-700 space-y-1.5 text-[11px]">
                    <div><span className="text-emerald-600 font-bold">GET</span> /api/rooms — Pre-seeded room list</div>
                    <div><span className="text-emerald-600 font-bold">GET</span> /api/bookings?room_id=&amp;date= — Filtered list</div>
                    <div><span className="text-indigo-600 font-bold">POST</span> /api/bookings/&#123;room_id&#125; — Conflict validated</div>
                    <div><span className="text-rose-600 font-bold">DELETE</span> /api/bookings/&#123;id&#125; — Cancel booking</div>
                    <div><span className="text-cyan-600 font-bold">GET</span> /api/rooms/&#123;id&#125;/next-available — Slot query</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-indigo-700 font-bold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Conflict Detection (HTTP 409)
                  </div>
                  <div className="text-slate-700 text-[11px] leading-relaxed">
                    Formula in booking_service.py:
                    <pre className="mt-1 p-2 rounded bg-white text-amber-700 border border-slate-200 overflow-x-auto text-[10px]">
{`conflict = db.query(Booking).filter(
    Booking.room_id == room_id,
    Booking.date == data.date,
    Booking.start_time < data.end_time,
    Booking.end_time > data.start_time,
).first()`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BOOKING MODAL (PURE LIGHT THEMED) ────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="max-w-md w-full rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Book Meeting Room</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sprint Planning, Client Demo"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Room
                </label>
                <select
                  value={modalRoomId}
                  onChange={(e) => setModalRoomId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.location} • Cap: {r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 cursor-pointer font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <select
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 font-mono cursor-pointer"
                  >
                    {TIME_SLOTS.slice(0, -1).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <select
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 font-mono cursor-pointer"
                  >
                    {TIME_SLOTS.slice(1).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formConflictWarning && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{formConflictWarning}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={Boolean(formConflictWarning)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer ${
                    formConflictWarning
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" /> Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
