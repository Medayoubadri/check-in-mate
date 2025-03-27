"use client";

import { useState, useEffect, useRef } from "react";
import { addDays, format, subDays } from "date-fns";
import {
  Users,
  Calendar,
  BarChart3,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Info,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MiniDashboard() {
  const [mounted, setMounted] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [attendanceList, setAttendanceList] = useState([
    { id: 1, name: "MedREDA RABAH", count: 1 },
    { id: 2, name: "SAAD ASSOUAL", count: 3 },
  ]);
  const [checkedIn, setCheckedIn] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("check-in");
  const inputRef = useRef<HTMLInputElement>(null);

  // Chart data
  const chartData = [
    { date: format(subDays(currentDate, 6), "yyyy-MM-dd"), value: 2 },
    { date: format(subDays(currentDate, 5), "yyyy-MM-dd"), value: 4 },
    { date: format(subDays(currentDate, 4), "yyyy-MM-dd"), value: 3 },
    { date: format(subDays(currentDate, 3), "yyyy-MM-dd"), value: 5 },
    { date: format(subDays(currentDate, 2), "yyyy-MM-dd"), value: 7 },
    { date: format(subDays(currentDate, 1), "yyyy-MM-dd"), value: 5 },
    { date: format(currentDate, "yyyy-MM-dd"), value: 2 },
  ];

  // Dashboard metrics
  const metrics = [
    {
      title: "Total Students",
      value: "208",
      icon: <Users className="w-4 h-4" />,
      tooltip:
        "208 students enrolled. At least that's what the database claims.",
    },
    {
      title: "Today's Attendance",
      value: "2",
      icon: <Calendar className="w-4 h-4" />,
      tooltip: "Only 2 students showed up today. Must be Friday.",
    },
    {
      title: "Average Attendance",
      value: "11%",
      icon: <BarChart3 className="w-4 h-4" />,
      tooltip: "11% average attendance. Still better than my college days.",
    },
    {
      title: "Total Attendance",
      value: "23",
      icon: <ClipboardList className="w-4 h-4" />,
      tooltip: "23 total check-ins this week. We're calling that a success.",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckIn = () => {
    if (studentName.trim() === "") return;

    // Add student to attendance list if not already there
    const existingStudent = attendanceList.find(
      (student) => student.name.toLowerCase() === studentName.toLowerCase()
    );

    if (existingStudent) {
      setAttendanceList(
        attendanceList.map((student) =>
          student.id === existingStudent.id
            ? { ...student, count: student.count + 1 }
            : student
        )
      );
    } else {
      setAttendanceList([
        ...attendanceList,
        { id: attendanceList.length + 1, name: studentName, count: 1 },
      ]);
    }

    setCheckedIn(true);
    setTimeout(() => {
      setCheckedIn(false);
      setStudentName("");
      if (inputRef.current) inputRef.current.focus();
    }, 2000);
  };

  const removeAttendance = (id: number) => {
    setAttendanceList(attendanceList.filter((student) => student.id !== id));
  };

  const handlePrevDay = () => {
    setCurrentDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    const tomorrow = addDays(currentDate, 1);
    if (tomorrow <= new Date()) {
      setCurrentDate(tomorrow);
    }
  };

  if (!mounted) return null;

  return (
    <TooltipProvider>
      <div className="bg-background shadow-xl border rounded-xl w-full max-w-xl h-[500px] overflow-hidden">
        {/* Header */}
        {/* Main content */}
        <Tabs
          value={activeTab}
          defaultValue="check-in"
          className="flex flex-col h-full"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center px-2 py-6">
            <div className="px-6 w-full">
              <TabsList className="gap-1 grid grid-cols-3 h-10">
                <TabsTrigger value="check-in" className="px-4">
                  Check-in
                </TabsTrigger>
                <TabsTrigger value="attendance" className="px-4">
                  Attendance
                </TabsTrigger>
                <TabsTrigger value="analytics" className="px-4">
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/20 w-9 h-9 text-white"
                >
                  <Info className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm" side="left">
                <p>
                  Welcome to Check-in Mate! The attendance system that actually
                  works... most of the time.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex-1 overflow-auto">
            {/* Check-in Tab */}
            <TabsContent value="check-in" className="mt-0 p-6 h-full">
              <div className="flex flex-col h-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="outline">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-white/20 w-9 h-9 text-white"
                      >
                        <Info className="w-5 h-5" />
                      </Button>
                      <h3 className="mb-2 font-medium text-lg">
                        Student Check-in
                      </h3>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      Enter a student name here. Spelling doesn&apos;t matter,
                      we&apos;ll mark them present anyway.
                    </p>
                  </TooltipContent>
                </Tooltip>

                <div className="flex-1 space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="font-medium text-slate-700 dark:text-slate-300 text-sm"
                    >
                      Student Name
                    </label>
                    <Input
                      ref={inputRef}
                      id="fullName"
                      placeholder="Start typing student name..."
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 w-full h-10 text-white"
                    onClick={handleCheckIn}
                    disabled={checkedIn || studentName.trim() === ""}
                  >
                    {checkedIn ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Checked In!
                      </span>
                    ) : (
                      "Mark Present"
                    )}
                  </Button>

                  {/* Recent check-ins */}
                  <div className="bg-neutral-950 mt-6 p-4 rounded-md">
                    <h4 className="mb-3 font-medium text-slate-700 dark:text-slate-300 text-sm">
                      Recent Check-ins
                    </h4>
                    <div className="space-y-2">
                      {attendanceList.length > 0 ? (
                        attendanceList.slice(0, 3).map((student) => (
                          <div
                            key={student.id}
                            className="flex justify-between items-center bg-background/60 backdrop-blur-xl px-3 py-2 border rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <div className="bg-emerald-500 rounded-full w-2 h-2" />
                                <div className="top-0 left-0 absolute bg-emerald-500 rounded-full w-2 h-2 animate-ping" />
                              </div>
                              <span className="font-medium text-sm">
                                {student.name}
                              </span>
                            </div>
                            <div>
                              <Badge variant="secondary" className="text-xs">
                                {student.count} attendance
                                {student.count > 1 ? "s" : ""}
                              </Badge>
                              <Button
                                variant="link"
                                size="icon"
                                className="w-7 h-7 text-slate-400 hover:text-red-500"
                                onClick={() => removeAttendance(student.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-slate-500 dark:text-slate-400 text-sm text-center">
                          No recent check-ins
                        </div>
                      )}

                      {attendanceList.length > 3 && (
                        <Button
                          variant="ghost"
                          className="mt-2 w-full text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-300 dark:text-emerald-400"
                          onClick={() => setActiveTab("attendance")}
                        >
                          View all check-ins
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="mt-0 p-6 h-full">
              <div className="flex flex-col h-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="mb-1 font-medium text-lg">
                          Attendance Records
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          View and manage student attendance records.
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="h-9">
                        <Download className="mr-2 w-4 h-4" />
                        Export
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      The list of students who bothered to show up. Click the X
                      to pretend they didn&apos;t.
                    </p>
                  </TooltipContent>
                </Tooltip>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-slate-500"
                      onClick={handlePrevDay}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <span className="font-medium text-sm">
                      {format(currentDate, "EEEE, MMMM d")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-slate-500"
                      onClick={handleNextDay}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  {attendanceList.length > 0 ? (
                    <div className="space-y-2">
                      {attendanceList.map((student) => (
                        <div
                          key={student.id}
                          className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <div className="bg-emerald-500 rounded-full w-2 h-2"></div>
                            <span className="font-medium text-sm">
                              {student.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {student.count} check-in
                              {student.count > 1 ? "s" : ""}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7 text-slate-400 hover:text-red-500"
                              onClick={() => removeAttendance(student.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center h-full text-center">
                      <Calendar className="mb-2 w-12 h-12 text-slate-300 dark:text-slate-600" />
                      <h4 className="font-medium text-slate-700 dark:text-slate-300 text-lg">
                        No attendance records
                      </h4>
                      <p className="mt-1 max-w-xs text-slate-500 dark:text-slate-400 text-sm">
                        There are no attendance records for this date. Try
                        selecting a different date or adding new records.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-0 p-6 h-full">
              <div className="flex flex-col h-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="mb-6">
                      <h3 className="mb-1 font-medium text-lg">
                        Attendance Analytics
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        View attendance trends and metrics.
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      This fancy chart makes it look like we&apos;re tracking
                      attendance scientifically.
                    </p>
                  </TooltipContent>
                </Tooltip>

                {/* Metrics */}
                <div className="gap-3 grid grid-cols-2 mb-6">
                  {metrics.map((metric, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Card className="hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 transition-colors">
                          <CardContent className="flex items-center gap-3 p-4">
                            <div
                              className={`
                                w-10 h-10 rounded-full flex items-center justify-center
                                ${
                                  index === 0
                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                    : ""
                                }
                                ${
                                  index === 1
                                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : ""
                                }
                                ${
                                  index === 2
                                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                    : ""
                                }
                                ${
                                  index === 3
                                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                                    : ""
                                }
                              `}
                            >
                              {metric.icon}
                            </div>
                            <div>
                              <p className="text-slate-500 dark:text-slate-400 text-xs">
                                {metric.title}
                              </p>
                              <p className="font-bold text-xl">
                                {metric.value}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>{metric.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                {/* Chart */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="flex-1 border-slate-200 dark:border-slate-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">
                          Weekly Attendance Trend
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[180px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={chartData}
                              margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 0,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="colorAttendance"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#10b981"
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#10b981"
                                    stopOpacity={0.1}
                                  />
                                </linearGradient>
                              </defs>
                              <XAxis
                                dataKey="date"
                                tickFormatter={(value) =>
                                  format(new Date(value), "EEE")
                                }
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                              />
                              <ChartTooltip
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-background shadow-sm p-2 border rounded-lg">
                                        <div className="gap-2 grid grid-cols-2">
                                          <div className="flex flex-col">
                                            <span className="text-[0.70rem] text-muted-foreground uppercase">
                                              Date
                                            </span>
                                            <span className="font-bold text-xs">
                                              {format(
                                                new Date(
                                                  payload[0].payload.date
                                                ),
                                                "MMM dd, yyyy"
                                              )}
                                            </span>
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-[0.70rem] text-muted-foreground uppercase">
                                              Attendance
                                            </span>
                                            <span className="font-bold text-xs">
                                              {payload[0].value}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#colorAttendance)"
                                activeDot={{ r: 6 }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      The spike means someone actually took attendance that day.
                      The dip is when I forgot to remind students.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
