// src/components/CustomCalendar.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import EventModal from "../Other/EventModal";

export interface Policy {
  policyId: string;
  endDate: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  licensePlate: string;
  brand: string;
  model: string;
  amount: number;
  companyName: string;
}

const CustomCalendar: React.FC = () => {
  const [events, setEvents] = useState<Policy[]>([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState<Policy | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/policy/GET/GetCalendarExpiration");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const daysInMonth = currentMonth.daysInMonth();
  const startOfMonth = currentMonth.startOf("month");

  const getEventsForDay = (day: dayjs.Dayjs) => {
    return events
      .filter((event) => dayjs(event.endDate).isSame(day, "day"))
      .map((event) => (
        <Button
          key={event.policyId}
          className="text-xs text-gray-700 cursor-pointer bg-red-400"
          onClick={() => {
            setSelectedEvent(event);
          }}
          onPress={onOpen}
        >
          {event.firstName} {event.lastName}
        </Button>
      ));
  };

  const getDaysArray = () => {
    let days: JSX.Element[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const day = startOfMonth.date(i);
      const isToday = day.isSame(dayjs(), "day");

      days.push(
        <div key={i} className={`p-2 border ${isToday ? "bg-blue-100" : ""}`}>
          <div className="font-semibold">{i}</div>
          <div className="text-sm">{getEventsForDay(day)}</div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
            >
              <ChevronLeft />
            </button>
            <h2 className="text-lg font-semibold">
              {currentMonth.format("MMMM YYYY")}
            </h2>
            <button
              onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
            >
              <ChevronRight />
            </button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold">
                {day}
              </div>
            ))}
            {getDaysArray()}
          </div>
        </CardBody>
      </Card>

      <EventModal
        isOpen={isOpen}
        event={selectedEvent}
        onClose={onOpenChange}
      />
    </div>
  );
};

export default CustomCalendar;
