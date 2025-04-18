import { Badge, Button, Card, Divider, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/it";
import { useEffect, useState } from "react";
import EventModal from "../Other/EventModal";

dayjs.locale("it");

export interface Policy {
  policyId: number;
  fullName: string;
  email: string;
  typeId: string;
  duration: number;
  amount: string;
  startDate: Date;
  endDate: Date;
  licensePlate: string;
  status: string;
  insuranceType: string;
  paymentStatus: string;
  types: string[];
  note: string;
}

const CustomCalendar: React.FC = () => {
  const [events, setEvents] = useState<Policy[]>([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState<Policy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/Policy/GET/GetCalendarExpiration");
        console.log("Data fetched:", response.data);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEventClick = (event: Policy) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const DayEvents: React.FC<{
    events: Policy[];
    onEventClick: (event: Policy) => void;
  }> = ({ events, onEventClick }) => {
    const [showAll, setShowAll] = useState(false);

    if (events.length === 0) return null;

    const visibleEvents = showAll ? events : events.slice(0, 2);

    return (
      <div className="mt-1">
        <ul className="space-y-1.5">
          {visibleEvents.map((event) => (
            <li
              key={event.policyId}
              onClick={() => onEventClick(event)}
              className="flex items-center justify-between p-1.5 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors duration-150 text-sm"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                  {event.fullName}
                </span>
                <Badge
                  content={event.status}
                  color={getStatusColor(event.status)}
                  placement="top-right"
                >
                  <span className="text-xs text-gray-500">
                    {event.licensePlate}
                  </span>
                </Badge>
              </div>
              <Icon
                icon="solar:arrow-right-linear"
                className="text-primary"
                width={16}
              />
            </li>
          ))}
          {events.length > 2 && !showAll && (
            <li
              className="text-primary text-xs cursor-pointer hover:underline font-medium px-1.5 py-1"
              onClick={() => setShowAll(true)}
            >
              Mostra altri ({events.length - 2})
            </li>
          )}
        </ul>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Attiva":
        return "success";
      case "Sospesa":
        return "warning";
      case "Terminata":
        return "danger";
      default:
        return "default";
    }
  };

  const getEventsForDay = (day: dayjs.Dayjs) => {
    const dayEvents = events.filter((event) =>
      dayjs(event.endDate).isSame(day, "day")
    );

    return <DayEvents events={dayEvents} onEventClick={handleEventClick} />;
  };

  const getDaysArray = () => {
    const startOfMonth = currentMonth.startOf("month");
    const daysInMonth = currentMonth.daysInMonth();
    const startDayOfWeek = startOfMonth.day(); // 0 for Sunday, 6 for Saturday

    // Adjust for Monday as first day of week (European calendar)
    const mondayAdjustedDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const daysInPreviousMonth = dayjs(startOfMonth)
      .subtract(1, "month")
      .daysInMonth();

    const daysToShowFromPreviousMonth = Array.from(
      { length: mondayAdjustedDay },
      (_, i) => daysInPreviousMonth - mondayAdjustedDay + i + 1
    );

    const totalDaysInGrid = 6 * 7; // Always 6 rows

    const daysToShowFromNextMonth = Array.from(
      {
        length:
          totalDaysInGrid - (daysToShowFromPreviousMonth.length + daysInMonth),
      },
      (_, i) => i + 1
    );

    let days: JSX.Element[] = [];

    // Add days from previous month
    daysToShowFromPreviousMonth.forEach((day) => {
      days.push(
        <li
          key={`prev-${day}`}
          className="bg-gray-50 rounded-lg border border-gray-100"
        >
          <div className="p-2">
            <div className="text-gray-400 font-medium text-sm">{day}</div>
          </div>
        </li>
      );
    });

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const day = startOfMonth.date(i);
      const isToday = day.isSame(dayjs(), "day");
      const isPast = day.isBefore(dayjs(), "day");
      const hasEvents = events.some((event) =>
        dayjs(event.endDate).isSame(day, "day")
      );

      days.push(
        <li
          key={i}
          className={`min-h-48 max-h-auto rounded-lg transition-all duration-200 
            ${
              isPast
                ? "bg-gray-50 border border-gray-100"
                : "bg-white border border-gray-200 hover:border-primary-200"
            } 
            ${hasEvents && !isPast ? "shadow-sm hover:shadow-md" : ""} 
            ${isToday ? "ring-2 ring-primary ring-offset-2" : ""}
          `}
        >
          <div className="p-2">
            <div className="flex justify-between items-center mb-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full 
                  ${
                    isToday
                      ? "bg-primary text-white font-semibold"
                      : "font-medium text-gray-700"
                  }
                `}
              >
                {i}
              </div>
              {hasEvents && (
                <Tooltip content="Polizze in scadenza">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </Tooltip>
              )}
            </div>
            {getEventsForDay(day)}
          </div>
        </li>
      );
    }

    // Add days from next month
    daysToShowFromNextMonth.forEach((day) => {
      days.push(
        <li
          key={`next-${day}`}
          className="bg-gray-50 rounded-lg border border-gray-100"
        >
          <div className="p-2">
            <div className="text-gray-400 font-medium text-sm">{day}</div>
          </div>
        </li>
      );
    });

    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const handleToday = () => {
    setCurrentMonth(dayjs());
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <EventModal
        isOpen={isModalOpen}
        event={selectedEvent}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="lg:flex lg:h-full lg:flex-col">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold capitalize text-gray-900 flex items-center gap-2">
            <Icon
              icon="solar:calendar-bold"
              className="text-primary"
              width={24}
            />
            {currentMonth.format("MMMM YYYY").toString()}
          </h1>

          <div className="flex items-center gap-2">
            <Tooltip content="Mese precedente">
              <Button
                isIconOnly
                variant="flat"
                radius="full"
                color="primary"
                onClick={handlePreviousMonth}
                aria-label="Mese precedente"
              >
                <Icon icon="solar:arrow-left-linear" width={20} />
              </Button>
            </Tooltip>

            <Button
              variant="flat"
              radius="full"
              color="primary"
              onClick={handleToday}
              className="px-4"
            >
              Oggi
            </Button>

            <Tooltip content="Mese successivo">
              <Button
                isIconOnly
                variant="flat"
                radius="full"
                color="primary"
                onClick={handleNextMonth}
                aria-label="Mese successivo"
              >
                <Icon icon="solar:arrow-right-linear" width={20} />
              </Button>
            </Tooltip>
          </div>
        </div>

        <Divider />

        <div className="lg:flex lg:flex-auto lg:flex-col">
          <div className="grid grid-cols-7 gap-px text-center font-medium text-sm text-gray-700 bg-gray-50 py-2">
            {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((day, i) => (
              <div key={day} className="px-2">
                <span className="hidden sm:inline">
                  {
                    [
                      "Lunedì",
                      "Martedì",
                      "Mercoledì",
                      "Giovedì",
                      "Venerdì",
                      "Sabato",
                      "Domenica",
                    ][i]
                  }
                </span>
                <span className="sm:hidden">{day}</span>
              </div>
            ))}
          </div>

          <div className="bg-white flex-auto">
            <ul className="grid grid-cols-7 gap-2 p-2">{getDaysArray()}</ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomCalendar;
