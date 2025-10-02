import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import UsageChart from "@/components/dashboard/UsageChart";
import ClassRankings from "@/components/dashboard/TotalViews";
import TeacherRankings from "@/components/dashboard/TeacherRankings";
import UserDemographics from "@/components/dashboard/UserDemographics";
import TopRatedClasses from "@/components/dashboard/TopRatedClasses";


const Dashboard = () => {
  const [period, setPeriod] = useState("30d");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#1A1F2C]">
        <Sidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-white mb-3 sm:mb-0">
                Platform Metrics Dashboard
              </h1>

              {/* 🔘 Selector de periodo */}
              <div className="flex gap-2">
                {["24h", "7d", "30d", "90d"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 rounded ${
                      period === p
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <MetricsOverview period={period} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopRatedClasses />
                <TeacherRankings period={period} />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
