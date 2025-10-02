
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { userAgeGroups, userGender } from "@/mock/dashboardData";

const COLORS = ['#8B5CF6', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

const UserDemographics = () => {
  const [activeTab, setActiveTab] = useState("age");

  // Format data
  const ageData = userAgeGroups.map(group => ({
    name: group.age,
    value: group.count
  }));
  
  const genderData = userGender.map(item => ({
    name: item.gender,
    value: item.count
  }));

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">User Demographics</CardTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger value="age" className="data-[state=active]:bg-gray-600">Age Groups</TabsTrigger>
            <TabsTrigger value="gender" className="data-[state=active]:bg-gray-600">Gender</TabsTrigger>
          </TabsList>
          <CardContent className="h-[260px]">
            <TabsContent value="age" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} users`, '']}
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#374151',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    formatter={(value) => <span style={{ color: '#F9FAFB' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="gender" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} users`, '']}
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#374151',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    formatter={(value) => <span style={{ color: '#F9FAFB' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
          </CardContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default UserDemographics;
