// src/components/dashboard/TopRatedClasses.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listTopRatedClasses, Subject } from "@/services/subjects";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TopRatedClasses = () => {
  const [classes, setClasses] = useState<Subject[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    listTopRatedClasses(5).then(setClasses).catch(console.error);
  }, []);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>🏆 Top Rated Classes</CardTitle>
        <Button size="sm" onClick={() => navigate("/all-classes")}>
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {classes.map((c, i) => (
          <div
            key={c.id || c._id}
            className="flex items-center justify-between p-2 rounded bg-gray-900 border border-gray-700"
          >
            <span className="text-white font-medium">
              {i + 1}. {c.subject}
            </span>
            <span className="text-yellow-400">⭐ {c.averageRating?.toFixed(1) || 0}</span>
          </div>
        ))}
        {classes.length === 0 && <div className="text-gray-400">No classes found.</div>}
      </CardContent>
    </Card>
  );
};

export default TopRatedClasses;
