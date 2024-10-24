"use client";

import Image from "next/image";
import { useState } from "react";
import memberIcon from "../../../public/assets/Icons/IconColor/users-alt_1.png";
import dateIcon from "../../../public/assets/Icons/IconColor/calendar-star.png";
import timeIcon from "../../../public/assets/Icons/IconColor/alarm-clock.png";
import locationIcon from "../../../public/assets/Icons/IconColor/navigation_1.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingForm = ({
  groupId,
  playgroupname,
  onBookingCreated,
}: {
  groupId: string;
  playgroupname: string;
  onBookingCreated: () => void;
}) => {
  const [location, setLocation] = useState("");
  const [playerLimit, setPlayerLimit] = useState<string | number>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const adjustDateForTimezone = (date: Date | null): string => {
    if (!date) return "";
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localTime = new Date(date.getTime() - timezoneOffset);
    return localTime.toISOString().split("T")[0];
  };

  const handleCreateBooking = async () => {
    const finalPlayerLimit = playerLimit === "" ? "10000" : playerLimit;
    const formattedDate = selectedDate
      ? adjustDateForTimezone(selectedDate)
      : "";
    const formattedTime = selectedTime
      ? selectedTime.toLocaleTimeString("default", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "";

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId,
          location,
          playgroupname,
          date: formattedDate,
          time: formattedTime,
          playerLimit: finalPlayerLimit,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      onBookingCreated();
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <div className="text-textcolor h-full flex flex-col justify-center items-center mt-6">
      <div className="flex flex-col justify-center items-center bg-bg2 rounded-lg w-full p-4">
        <h2 className="font-bold text-3xl mb-4">New ManaLink</h2>
        <div className="relative flex items-center w-80">
          <Image
            src={locationIcon}
            alt="Location Icon"
            width={24}
            height={24}
            className="absolute left-2"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-80 h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-center text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 flex justify-center"
          />
        </div>
        <div className="relative flex items-center w-80">
          <Image
            src={dateIcon}
            alt="Date Icon"
            width={24}
            height={24}
            className="absolute left-2"
          />
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            placeholderText="Select a date"
            className="w-80 h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-center text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 flex justify-center"
          />
        </div>
        <div className="relative flex items-center w-80">
          <Image
            src={timeIcon}
            alt="Time Icon"
            width={24}
            height={24}
            className="absolute left-2"
          />
          <DatePicker
            selected={selectedTime}
            onChange={(date: Date | null) => setSelectedTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            timeFormat="HH:mm"
            dateFormat="HH:mm"
            placeholderText="Select a time"
            className="w-80 h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-center text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 flex justify-center"
          />
        </div>
        <div className="relative flex items-center w-80 mb-4">
          <Image
            src={memberIcon}
            alt="Member Icon"
            width={24}
            height={24}
            className="absolute left-2"
          />
          <select
            value={playerLimit === 0 ? "" : playerLimit}
            onChange={(e) => setPlayerLimit(Number(e.target.value))}
            className="w-full h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-center placeholder:opacity-50 text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 flex justify-center"
          >
            <option value="" disabled selected>
              Player limit
            </option>
            {Array.from({ length: 30 }, (_, i) => i + 2).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
            <option value="50">Event (50)</option>
            <option value="100">Tournament (100)</option>
            <option value="1000">Big Venue (1k)</option>
            <option value="10000">Championship! (10k)</option>
          </select>
        </div>
        <button
          onClick={handleCreateBooking}
          className="w-32 h-9 mt-2 bg-btn rounded-md text-nav font-bold shadow-lg"
        >
          Add ManaLink
        </button>
      </div>
    </div>
  );
};

export default BookingForm;