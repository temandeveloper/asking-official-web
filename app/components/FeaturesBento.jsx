"use client";

import { useState } from "react";
import { ChevronDown, Plus, CheckCircle2, MessageSquare, FileText, Bell, Sparkles } from "lucide-react";

export default function FeaturesBento() {
  // Interactive switch state for Smart Notifications card
  const [notifications, setNotifications] = useState({
    support: true,
    contract: false,
    payment: true,
    compliance: true,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Bar chart heights for Dynamic dashboard
  const barHeights = [42, 68, 35, 52, 94, 40, 62, 78, 32, 50];

  return (
    <section id="features" className="py-24 bg-[#F8FAF7]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EFE7] border border-[#CFE2D3] text-xs font-semibold text-[#184530] mb-5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#184530]" />
            <span>Key features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#11241C] leading-[1.18] mb-4">
            Latest advanced technologies to ensure everything you needs
          </h2>
          <p className="text-base sm:text-lg text-[#4E6358] leading-relaxed max-w-2xl mx-auto">
            Modernize your teams productivity and security with our foundation layer empowering rapid and accurate workflow.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="space-y-6">
          {/* Bento Card 1: Dynamic Dashboard (Wide Top Card) */}
          <div className="bg-[#EBF1EB] rounded-3xl p-8 sm:p-10 border border-[#DCE6DC] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all hover:shadow-md">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#11231B]">
                Dynamic dashboard
              </h3>
              <p className="text-[#4E6358] text-[15px] leading-relaxed">
                Get real-time insights and trend analysis with customize widgets, indicators and metrics based on data-driven workflow for agile decisions.
              </p>
              <div className="pt-2">
                <a
                  href="#dashboard"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#12281F] text-white font-semibold text-sm shadow-xs hover:bg-[#1C3C2E] hover:shadow transition-all"
                >
                  Explore all
                </a>
              </div>
            </div>

            {/* Right Widget: Interactive Bar Chart */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#DEE7DF]">
              {/* Widget Header */}
              <div className="flex items-center justify-between border-b border-[#EEF3EF] pb-4 mb-6">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#11231B] cursor-pointer hover:text-[#2E4A3B]">
                  <span>Analytics</span>
                  <ChevronDown className="w-4 h-4 text-[#6A7E73]" />
                </div>

                {/* Avatar Stack */}
                <div className="flex items-center -space-x-2 overflow-hidden">
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                    alt="Team"
                  />
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                    alt="Team"
                  />
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80"
                    alt="Team"
                  />
                </div>
              </div>

              {/* Chart Body with Y-Axis and Bars */}
              <div className="flex items-end gap-4 h-48 sm:h-52 pt-4">
                {/* Y-Axis */}
                <div className="flex flex-col justify-between h-full text-[11px] font-medium text-[#8EA096] pb-2 select-none">
                  <span>100</span>
                  <span>80</span>
                  <span>60</span>
                  <span>40</span>
                  <span>20</span>
                  <span>0</span>
                </div>

                {/* Vertical Bars */}
                <div className="flex-1 grid grid-cols-10 gap-2 sm:gap-3 items-end h-full border-b border-[#E3ECE5] pb-1">
                  {barHeights.map((height, idx) => {
                    const isHighlighted = idx === 4; // 5th bar highlighted in dark forest green
                    return (
                      <div key={idx} className="flex flex-col items-center h-full justify-end group">
                        <div
                          style={{ height: `${height}%` }}
                          className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                            isHighlighted
                              ? "bg-[#12281F] shadow-sm scale-y-105"
                              : "bg-[#D9E4DC] hover:bg-[#B7CCC0]"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bento Row 2: Two Columns (Smart Notifications & Task Management) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 2: Smart Notifications */}
            <div className="bg-[#EBF1EB] rounded-3xl p-8 border border-[#DCE6DC] shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
              <div className="mb-6">
                <h3 className="text-2xl font-bold tracking-tight text-[#11231B] mb-2">
                  Smart notifications
                </h3>
                <p className="text-[#4E6358] text-[15px] leading-relaxed">
                  Stay organized and up to date with real-time notifications about important contract milestones.
                </p>
              </div>

              {/* White Widget */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#DEE7DF]">
                <div className="flex items-center justify-between border-b border-[#EEF3EF] pb-3 mb-4">
                  <span className="text-sm font-semibold text-[#11231B]">Email notification</span>
                  <span className="text-xs text-[#6C8075] bg-[#F2F7F3] px-2 py-0.5 rounded-md font-medium">Auto</span>
                </div>

                {/* Notification Toggle Rows */}
                <div className="space-y-3.5">
                  {[
                    { key: "support", label: "New message in support conversation" },
                    { key: "contract", label: "New contract alert" },
                    { key: "payment", label: "Payment received from cliente" },
                    { key: "compliance", label: "Compliance status" },
                  ].map((item) => {
                    const active = notifications[item.key];
                    return (
                      <div
                        key={item.key}
                        onClick={() => toggleNotification(item.key)}
                        className="flex items-center justify-between py-1.5 cursor-pointer select-none group"
                      >
                        <span className="text-xs sm:text-[13px] font-medium text-[#293E33] group-hover:text-[#11231B] transition-colors">
                          {item.label}
                        </span>

                        {/* Interactive iOS style Toggle */}
                        <div
                          className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                            active ? "bg-[#12281F]" : "bg-[#D8E2DA]"
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                              active ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card 3: Task Management */}
            <div className="bg-[#EBF1EB] rounded-3xl p-8 border border-[#DCE6DC] shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
              <div className="mb-6">
                <h3 className="text-2xl font-bold tracking-tight text-[#11231B] mb-2">
                  Task management
                </h3>
                <p className="text-[#4E6358] text-[15px] leading-relaxed">
                  Assign contracts, tasks and track team member progress on a dedicated, collaborative dashboard.
                </p>
              </div>

              {/* White Widget */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#DEE7DF] space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#EEF3EF] pb-3">
                  <span className="text-sm font-semibold text-[#11231B]">Activity</span>
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-[#12281F] bg-[#EEF5F0] hover:bg-[#DEECE1] px-2.5 py-1 rounded-full transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assign</span>
                  </button>
                </div>

                {/* Activity Feed Items */}
                {/* Feed Item 1 */}
                <div className="flex items-start gap-3 bg-[#F8FAF8] rounded-xl p-3.5 border border-[#E9F0EA]">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                    alt="Alex Sanders"
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#11231B]">Alex Sanders</span>
                      <span className="text-[10px] text-[#7A8E83]">Just now</span>
                    </div>
                    <p className="text-[#3F544A] leading-relaxed">
                      Made <span className="font-semibold text-[#12281F]">@Taylor Adams</span> Task for update the conversation. I will check that in 2 days at the end. 😊
                    </p>
                  </div>
                </div>

                {/* Feed Item 2 */}
                <div className="flex items-center justify-between bg-[#F8FAF8] rounded-xl p-3 border border-[#E9F0EA]">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80"
                      alt="Sarah Connor"
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-xs text-[#11231B]">Sarah Connor</div>
                      <div className="text-[11px] text-[#556A60] flex items-center gap-1 mt-0.5">
                        <FileText className="w-3 h-3 text-[#184530]" />
                        <span>Assigned a new agreement</span>
                      </div>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#184530]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
