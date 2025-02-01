// app/(dashboard)/students/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { StudentsTable } from "./components/StudentsTable";
import { CalendarButton } from "./components/CalendarButton";
import { ActionsButton } from "./components/ActionsButton";
import { SelectedDateDisplay } from "./components/SelectedDateDisplay";
import { Search } from "lucide-react";

interface Student {
  id: string;
  name: string;
  age: number;
  gender: string;
  createdAt: string;
}

export default function StudentsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      let url = "/api/students";
      if (selectedDate) {
        url += `?date=${selectedDate.toISOString().split("T")[0]}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchStudents();
    }
  }, [status, fetchStudents, selectedDate]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date || null);
  };

  const clearSelectedDate = () => {
    setSelectedDate(null);
  };

  return (
    <div className="overflow-auto">
      {/* <div className="flex justify-between items-center mt-4 md:mt-8 mb-4 md:mb-6">
        <h1 className="font-bold text-xl md:text-2xl">Students List</h1>
      </div> */}
      <div className="flex md:flex-row flex-col md:justify-between gap-4 md:space-x-4 mb-4">
        <div className="flex md:flex-row flex-col md:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="top-1/2 left-2 absolute w-4 h-4 text-muted-foreground transform -translate-y-1/2" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8 w-full"
            />
          </div>
        </div>
        <SelectedDateDisplay
          selectedDate={selectedDate}
          onClear={clearSelectedDate}
        />
        <div className="flex gap-2 md:gap-4">
          <CalendarButton
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
          <ActionsButton onImportComplete={fetchStudents} />
        </div>
      </div>
      <StudentsTable students={students} searchTerm={searchTerm} />
    </div>
  );
}
