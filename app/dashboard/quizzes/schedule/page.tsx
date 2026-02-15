"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";
import { useScheduledSessions } from "@/hooks/use-quizzes";

type ScheduleView = "calendar" | "list" | "upcoming";
type ScheduleType = "today" | "week" | "recurring" | "bulk";

export default function ScheduleQuizSessionsPage() {
  const router = useRouter();
  const [scheduleType, setScheduleType] = useState<ScheduleType>("today");
  const [view, setView] = useState<ScheduleView>("calendar");
  const [selectedDate] = useState(new Date());

  const { data: sessions } = useScheduledSessions(
    {
      date: selectedDate.toISOString(),
      view,
    },
    true
  );

  const todaySessions = sessions?.filter((s) => {
    const sessionDate = new Date(s.startTime);
    const today = new Date();
    return (
      sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear()
    );
  }) || [];

  return (
    <div className="flex flex-col gap-6 px-4 py-8 lg:pl-16 lg:pr-8 lg:py-16">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-neutral-50 rounded-md"
        >
          <ArrowLeft className="w-6 h-6 text-secondary-500" />
        </button>
        <h1 className="text-3xl font-bold text-secondary-500">
          Schedule quiz sessions
        </h1>
      </div>

      <div className="flex gap-4">
        <Button
          variant={scheduleType === "today" ? "primary" : "secondary"}
          onClick={() => setScheduleType("today")}
        >
          Schedule For Today
        </Button>
        <Button
          variant={scheduleType === "week" ? "primary" : "secondary"}
          onClick={() => setScheduleType("week")}
        >
          Schedule For This Week
        </Button>
        <Button
          variant={scheduleType === "recurring" ? "primary" : "secondary"}
          onClick={() => setScheduleType("recurring")}
        >
          Create Recurring Schedule
        </Button>
        <Button
          variant={scheduleType === "bulk" ? "primary" : "secondary"}
          onClick={() => setScheduleType("bulk")}
        >
          Bulk Schedule
        </Button>
      </div>

      <div className="flex gap-4 border-b border-border-500">
        <button
          onClick={() => setView("calendar")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            view === "calendar"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          Calendar View
        </button>
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            view === "list"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          List view
        </button>
        <button
          onClick={() => setView("upcoming")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            view === "upcoming"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          Upcoming sessions
        </button>
      </div>

      {view === "calendar" && (
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-border-500 rounded-md p-6">
            <div className="flex items-center justify-between mb-4">
              <button className="px-4 py-2 border border-border-500 rounded-md">
                Previous
              </button>
              <h2 className="text-xl font-semibold text-secondary-500">
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button className="px-4 py-2 border border-border-500 rounded-md">
                Next
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-secondary-500">
                  {day}
                </div>
              ))}
              <div className="col-span-7 text-center text-neutral-500 py-8">
                Calendar grid implementation would go here
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-secondary-500">
          Today Schedule - {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h2>
        <div className="flex flex-col gap-4">
          {todaySessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-border-500 rounded-md p-6 flex items-center justify-between"
            >
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-lg font-medium text-secondary-500">
                  Quiz Session {session.id}
                </h3>
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span>
                    {new Date(session.startTime).toLocaleTimeString()} -{" "}
                    {new Date(session.endTime).toLocaleTimeString()} ({session.duration}{" "}
                    minutes)
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  {session.status === "LIVE" ? (
                    <span>{session.participants} participants active</span>
                  ) : (
                    <span>{session.registeredParticipants} registered</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    session.status === "LIVE"
                      ? "bg-success-50 text-success-800"
                      : session.status === "UPCOMING"
                      ? "bg-primary-50 text-primary-800"
                      : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {session.status}
                </span>
                {session.status === "LIVE" ? (
                  <>
                    <Button variant="secondary">Monitor</Button>
                    <Button variant="danger">End early</Button>
                  </>
                ) : (
                  <>
                    <Button variant="primary">Start Now</Button>
                    <Button variant="secondary">Edit</Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
\
      <div className="flex flex-col gap-4">
 
        <h2 className="text-xl font-semibold text-secondary-500">
          Scheduling statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-border-500 rounded-md p-6 flex flex-col items-center">
            <p className="text-4xl font-bold text-primary-500">
              {todaySessions.length}
            </p>
            <p className="text-base text-neutral-500 text-center">Sessions today</p>
          </div>
          <div className="bg-white border border-border-500 rounded-md p-6 flex flex-col items-center">
            <p className="text-4xl font-bold text-primary-500">
              {todaySessions.reduce((sum, s) => sum + s.participants, 0)}
            </p>
            <p className="text-base text-neutral-500 text-center">
              Active participants
            </p>
          </div>
          <div className="bg-white border border-border-500 rounded-md p-6 flex flex-col items-center">
            <p className="text-4xl font-bold text-primary-500">
              {sessions?.length || 0}
            </p>
            <p className="text-base text-neutral-500 text-center">Sessions this week</p>
          </div>
          <div className="bg-white border border-border-500 rounded-md p-6 flex flex-col items-center">
            <p className="text-4xl font-bold text-primary-500">94%</p>
            <p className="text-base text-neutral-500 text-center">Attendance rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
