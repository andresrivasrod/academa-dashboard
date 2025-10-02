// src/pages/AllClasses.tsx

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listSubjects, Subject } from "@/services/subjects";

const AllClasses = () => {
  const [classes, setClasses] = useState<Subject[]>([]);

  useEffect(() => {
    listSubjects().then((subs) => {
      const sorted = [...subs].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      setClasses(sorted);
    });
  }, []);

  return (
    <SidebarProvider defaultOpen>
      <Sidebar />
      <SidebarInset className="bg-gray-900 text-white min-h-screen">
        <Header />
        <div className="p-6 space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader><CardTitle>All Classes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {classes.map((c, i) => (
                <div key={c.id || c._id} className="p-3 rounded bg-gray-900 border border-gray-700 flex justify-between">
                  <div>
                    <div className="font-semibold">{i + 1}. {c.subject}</div>
                    <div className="text-sm text-gray-400">{c.category} • {c.description}</div>
                    <div className="text-sm text-gray-500">
                      Professor: {c.professor?.name} {c.professor?.lastName}
                    </div>
                  </div>
                  <div className="text-yellow-400 font-bold text-lg">
                    ⭐ {c.averageRating?.toFixed(1) || 0}
                  </div>
                </div>
              ))}
              {classes.length === 0 && <div className="text-gray-400">No classes found.</div>}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AllClasses;
