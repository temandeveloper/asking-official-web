import React from "react";

export function DashboardMetricsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card bg-base-100 border border-base-200 p-5 rounded-2xl shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <div className="skeleton h-4 w-28 rounded-lg"></div>
              <div className="skeleton h-8 w-8 rounded-xl"></div>
            </div>
            <div className="skeleton h-8 w-24 rounded-lg"></div>
            <div className="skeleton h-3 w-36 rounded-md"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card bg-base-100 border border-base-200 p-6 rounded-2xl shadow-2xs space-y-4">
          <div className="skeleton h-5 w-44 rounded-lg"></div>
          <div className="skeleton h-56 w-full rounded-xl"></div>
        </div>
        <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl shadow-2xs space-y-3">
          <div className="skeleton h-5 w-36 rounded-lg"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-12 w-full rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SidebarDueTicketsSkeleton() {
  return (
    <div className="space-y-1.5 px-2 py-1">
      <div className="skeleton h-8 w-full rounded-xl"></div>
      <div className="skeleton h-8 w-full rounded-xl"></div>
    </div>
  );
}

export function MessagesListSkeleton() {
  return (
    <div className="divide-y divide-base-200">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3.5">
          <div className="skeleton w-11 h-11 rounded-2xl shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="skeleton h-4 w-32 rounded-md"></div>
              <div className="skeleton h-3 w-10 rounded-md"></div>
            </div>
            <div className="skeleton h-3 w-48 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChatThreadSkeleton() {
  return (
    <div className="flex flex-col space-y-4 p-6">
      <div className="skeleton h-12 w-64 rounded-2xl self-start"></div>
      <div className="skeleton h-16 w-80 rounded-2xl self-end"></div>
      <div className="skeleton h-10 w-48 rounded-2xl self-start"></div>
      <div className="skeleton h-14 w-72 rounded-2xl self-end"></div>
      <div className="skeleton h-12 w-56 rounded-2xl self-start"></div>
    </div>
  );
}

export function TicketsTableSkeleton() {
  return (
    <div className="space-y-2.5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="skeleton h-14 w-full rounded-xl"></div>
      ))}
    </div>
  );
}

export function SchedulerCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="skeleton h-32 w-full rounded-2xl"></div>
      ))}
    </div>
  );
}
