"use client";

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Booking {
  _id: string;
  groupId: string;
  date: string;
}

const CustomCalendar = ({ groupId }: { groupId: string }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [locale, setLocale] = useState<string>("en-US");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/bookings?groupId=${groupId}`);
        const data = await response.json();
        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [groupId]);

  const bookingDates = bookings.map((booking) => new Date(booking.date));

  const isBookingOnDate = (date: Date) => {
    return bookingDates.some(
      (bookingDate) =>
        bookingDate.getFullYear() === date.getFullYear() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getDate() === date.getDate()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  return (
    <div className="mt-6 w-96 flex flex-col justify-center items-center">
      <Calendar
        locale={locale}
        tileContent={({ date, view }) =>
          view === "month" && isBookingOnDate(date) ? (
            <div className="dot"></div>
          ) : null
        }
        tileClassName={({ date, view }) =>
          view === "month" && isToday(date) ? "highlight-today" : ""
        }
        calendarType="iso8601"
        defaultView="month"
        showNavigation={true}
        prev2Label={null}
        next2Label={null}
        selectRange={false}
        showWeekNumbers={true}
      />
    </div>
  );
};

export default CustomCalendar;