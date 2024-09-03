import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useDisclosure } from "@nextui-org/react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/it"; // Importa la localizzazione italiana
import React, { useEffect, useState } from "react";
import EventModal from "../Other/EventModal";

dayjs.locale("it"); // Imposta la localizzazione italiana

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
}

const CustomCalendar: React.FC = () => {
  const [events, setEvents] = useState<Policy[]>([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState<Policy | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/Policy/GET/GetCalendarExpiration");
        console.log("Data fetched:", response.data); // Verifica i dati
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEventClick = (event: Policy) => {
    setSelectedEvent(event);
    onOpen(); // Apre il disclosure
  };

  const DayEvents: React.FC<{
    events: Policy[];
    onEventClick: (event: Policy) => void;
  }> = ({ events, onEventClick }) => {
    const [showAll, setShowAll] = useState(false);

    if (events.length === 0) return null;

    const visibleEvents = showAll ? events : events.slice(0, 2);

    return (
      <div>
        <ul className="mt-2 space-y-1">
          {visibleEvents.map((event) => (
            <li
              key={event.policyId}
              className="flex flex-col truncate font-medium text-gray-900 cursor-pointer hover:text-primary list-disc"
              onClick={() => onEventClick(event)}
            >
              <span>{`${event.fullName}`}</span>
              <span>{event.licensePlate}</span>
            </li>
          ))}
          {events.length > 2 && !showAll && (
            <li
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => setShowAll(true)}
            >
              Altri...
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
    const startDayOfWeek = startOfMonth.day(); // Giorno della settimana del 1° giorno (0 per domenica, 6 per sabato)

    const daysInPreviousMonth = dayjs(startOfMonth)
      .subtract(1, "month")
      .daysInMonth();
    const daysToShowFromPreviousMonth = Array.from(
      { length: startDayOfWeek === 0 ? 6 : startDayOfWeek },
      (_, i) =>
        daysInPreviousMonth -
        (startDayOfWeek === 0 ? 6 : startDayOfWeek) +
        i +
        1
    );

    const totalDaysInGrid = 6 * 7; // Sempre 6 righe

    const daysToShowFromNextMonth = Array.from(
      {
        length:
          totalDaysInGrid - (daysToShowFromPreviousMonth.length + daysInMonth),
      },
      (_, i) => i + 1
    );

    let days: JSX.Element[] = [];

    // Aggiungi giorni del mese precedente
    daysToShowFromPreviousMonth.forEach((day) => {
      days.push(
        <li key={`prev-${day}`} className="p-2 bg-gray-100 text-gray-500">
          <div className="font-semibold">{day}</div>
        </li>
      );
    });

    // Aggiungi giorni del mese corrente
    for (let i = 1; i <= daysInMonth; i++) {
      const day = startOfMonth.date(i);
      const isToday = day.isSame(dayjs(), "day");
      const isPast = day.isBefore(dayjs(), "day");

      days.push(
        <li
          key={i}
          className={`min-h-48 max-h-auto ${
            isPast ? "bg-gray-100 text-gray-500" : "bg-white"
          }`}
        >
          <div className="p-2">
            <div
              className={`font-semibold ${
                isToday &&
                "flex h-6 w-6 items-center justify-center rounded-full bg-primary font-semibold text-white"
              }`}
            >
              {i}
            </div>
            {getEventsForDay(day)}
          </div>
        </li>
      );
    }

    // Aggiungi giorni del mese successivo
    daysToShowFromNextMonth.forEach((day) => {
      days.push(
        <li key={`next-${day}`} className="p-2 bg-gray-100 text-gray-500">
          <div className="font-semibold">{day}</div>
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
    <div className="p-4">
      <EventModal
        isOpen={isOpen}
        event={selectedEvent}
        onClose={onOpenChange}
      />
      <div className="lg:flex lg:h-full lg:flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
          <h1 className="text-base font-semibold leading-6 text-gray-900 capitalize">
            {currentMonth.format("MMMM YYYY").toString()}
          </h1>
          <div className="flex items-center">
            <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
              <button
                type="button"
                className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
                onClick={handlePreviousMonth}
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
                onClick={handleToday}
              >
                Vai a oggi
              </button>
              <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
              <button
                type="button"
                className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                onClick={handleNextMonth}
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>
        <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
          <div className="grid grid-cols-7 gap-px bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
            <div className="hidden sm:block bg-white py-2 border-gray-300">
              Lunedí
            </div>
            <div className="hidden sm:block bg-white py-2 border-gray-300">
              Martedí
            </div>
            <div className="hidden sm:block bg-white py-2 border-gray-300">
              Mercoledí
            </div>
            <div className="hidden sm:block bg-white py-2 border-gray-300">
              Giovedí
            </div>
            <div className="hidden sm:block bg-white py-2 border-gray-300">
              Venerdí
            </div>
            <div className="hidden sm:block bg-white py-2 border-gray-300">
              Sabato
            </div>
            <div className="hidden sm:block bg-white py-2 border-gray-300">
              Domenica
            </div>

            {/* Mobile */}
            <div className="block sm:hidden bg-white py-2 border-gray-300">
              L
            </div>
            <div className="block sm:hidden bg-white py-2 border-gray-300">
              M
            </div>
            <div className="block sm:hidden bg-white py-2 border-gray-300">
              M
            </div>
            <div className="block sm:hidden bg-white py-2 border-gray-300">
              G
            </div>
            <div className="block sm:hidden bg-white py-2 border-gray-300">
              V
            </div>
            <div className="block sm:hidden bg-white py-2 border-gray-300">
              S
            </div>
            <div className="block sm:hidden bg-white py-2 border-gray-300">
              D
            </div>
          </div>
          <div className="flex bg-gray-300 text-xs leading-6 text-gray-700 lg:flex-auto">
            <ul className="grid w-full grid-cols-7 gap-px border border-gray-300">
              {getDaysArray()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
