import { Button, Card, Divider, Tooltip } from "@heroui/react";
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
  typeId: number;
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
  clientId: number;
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
              className="flex items-center justify-between p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 cursor-pointer transition-colors duration-150 text-sm bg-gradient-to-r from-red-500 to-danger border border-zinc-300 dark:border-zinc-700 shadow-sm"
            >
              <div className="flex flex-col">
                <span className="font-medium text-white truncate max-w-[120px]">
                  {event.fullName}
                </span>
                <div className="flex items-center text-xs text-gray-200">
                  <Icon
                    icon="solar:car-linear"
                    width={12}
                    className="text-primary dark:text-gray-300"
                  />
                  <span className="font-medium">{event.licensePlate}</span>
                </div>
                <span className="text-xs text-primary-600 dark:text-gray-300 font-medium">
                  {event.insuranceType}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <Icon
                  icon="solar:arrow-right-linear"
                  className="text-white"
                  width={16}
                />
              </div>
            </li>
          ))}
          {events.length > 2 && !showAll && (
            <li
              className="text-center text-primary dark:text-gray-300 text-xs cursor-pointer hover:bg-primary-50 dark:hover:bg-gray-800 font-medium px-1.5 py-1.5 rounded-lg border border-dashed border-primary-200 dark:border-gray-700 transition-colors"
              onClick={() => setShowAll(true)}
            >
              Mostra altri ({events.length - 2})
            </li>
          )}
          {showAll && events.length > 2 && (
            <li
              className="text-center text-gray-600 dark:text-gray-400 text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 font-medium px-1.5 py-1.5 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 transition-colors"
              onClick={() => setShowAll(false)}
            >
              Nascondi
            </li>
          )}
        </ul>
      </div>
    );
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
          className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="p-2">
            <div className="text-gray-400 dark:text-gray-500 font-medium text-sm">
              {day}
            </div>
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
                ? "bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800"
            } 
            ${hasEvents && !isPast ? "shadow-sm hover:shadow-md" : ""} 
            ${
              isToday
                ? "ring-2 ring-primary dark:ring-gray-500 ring-offset-2 dark:ring-offset-gray-900"
                : ""
            }
          `}
        >
          <div className="p-2">
            <div className="flex justify-between items-center mb-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full 
                  ${
                    isToday
                      ? "bg-primary-800 dark:bg-gray-800 text-white dark:text-gray-100 font-semibold"
                      : "font-medium text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {i}
              </div>
              {hasEvents && (
                <Tooltip content="Polizze in scadenza">
                  <div className="h-2 w-2 rounded-full bg-primary dark:bg-gray-400"></div>
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
          className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="p-2">
            <div className="text-gray-400 dark:text-gray-500 font-medium text-sm">
              {day}
            </div>
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
    <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
      <EventModal
        isOpen={isModalOpen}
        event={selectedEvent}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="lg:flex lg:h-full lg:flex-col">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold capitalize text-gray-900 dark:text-white flex items-center gap-2">
            <Icon
              icon="solar:calendar-linear"
              className="text-primary dark:text-gray-400"
              width={24}
            />
            {currentMonth.format("MMMM YYYY").toString()}
          </h1>

          <div className="flex items-center gap-2">
            <Tooltip content="Mese precedente">
              <Button
                isIconOnly
                variant="ghost"
                radius="full"
                color="primary"
                onClick={handlePreviousMonth}
                aria-label="Mese precedente"
                className="dark:text-white"
              >
                <Icon icon="solar:arrow-left-linear" width={20} />
              </Button>
            </Tooltip>

            <Button
              variant="solid"
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
                variant="ghost"
                radius="full"
                color="primary"
                onClick={handleNextMonth}
                aria-label="Mese successivo"
                className="dark:text-white"
              >
                <Icon icon="solar:arrow-right-linear" width={20} />
              </Button>
            </Tooltip>
          </div>
        </div>

        <Divider />

        <div className="lg:flex lg:flex-auto lg:flex-col">
          <div className="grid grid-cols-7 gap-px text-center font-medium text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 py-2">
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

          <div className="bg-white dark:bg-gray-900 flex-auto">
            <ul className="grid grid-cols-7 gap-2 p-2">{getDaysArray()}</ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomCalendar;
