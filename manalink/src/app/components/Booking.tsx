"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import locationIcon from "../../../public/assets/Icons/IconColor/navigation_1.png";
import calendarIcon from "../../../public/assets/Icons/IconColor/calendar-star.png";
import clockIcon from "../../../public/assets/Icons/IconColor/alarm-clock.png";
import usersIcon from "../../../public/assets/Icons/IconColor/users-alt_1.png";
import BookingAttendeesPopup from "./BookingAttendeesPopup";
import CustomLoader from "./CustomLoading";
import sadFace from "../../../public/assets/Icons/NavColor/sad-tear (1).png";

const parseTime = (time: string): string => {
  const is12HourFormat =
    time.toLowerCase().includes("am") || time.toLowerCase().includes("pm");

  if (is12HourFormat) {
    const [hour, minute] = new Date(`1970-01-01T${time}`)
      .toLocaleTimeString("en-GB")
      .split(":");
    return `${hour}:${minute}`;
  }

  return time;
};

interface Booking {
  _id: string;
  location: string;
  date: string;
  time: string;
  playerLimit: number;
  attendees: {
    userId: string;
    status: "yes" | "no" | "pending";
  }[];
}

interface Attendee {
  userId: string;
  status: "yes" | "no" | "pending";
}

const BookingList = ({ groupId }: { groupId: string }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [activePopupBookingId, setActivePopupBookingId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user-profile");
        const user = await response.json();
        if (user && user.user?._id) {
          setUserId(user.user._id);
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    fetchUser();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings?groupId=${groupId}`);
      const data = await response.json();
      const now = new Date();

      const sortedBookings = data.bookings
        .filter((booking: Booking) => {
          const time = parseTime(booking.time);
          const bookingDate = new Date(
            `${booking.date.split("T")[0]}T${time}:00`
          );

          return bookingDate.getTime() >= now.getTime();
        })
        .sort((a: Booking, b: Booking) => {
          const timeA = parseTime(a.time);
          const timeB = parseTime(b.time);
          const dateA = new Date(`${a.date.split("T")[0]}T${a.time}:00`);
          const dateB = new Date(`${b.date.split("T")[0]}T${b.time}:00`);

          return dateA.getTime() - dateB.getTime();
        });
      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRSVP = async (bookingId: string, status: "yes" | "no") => {
    try {
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking RSVP");
      }

      fetchBookings();
    } catch (error) {
      console.error("Error updating RSVP:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [groupId]);

  const openAttendeesPopup = (bookingId: string) => {
    setActivePopupBookingId(bookingId);
  };

  return (
    <div className="mt-4 p-1 w-96 h-96 sm:h-11/12  rounded-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),inset_0_-2px_4px_rgba(0,0,0,0.6)]">
      <div className="p-4 h-full flex flex-col items-center w-full overflow-auto box-border rounded-md">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <CustomLoader />
          </div>
        ) : bookings.length > 0 ? (
          <ul className="w-full">
            {bookings.map((booking, index) => {
              const userAttendee = booking.attendees.find(
                (att) => att.userId === userId
              );
              const yesAttendees = booking.attendees.filter(
                (att) => att.status === "yes"
              );
              const userStatus = userAttendee?.status || "pending";
              return (
                <li
                  key={booking._id}
                  className="flex flex-row justify-start items-center bg-bg2 rounded-lg w-full p-2 mb-4 shadow-lg h-36 opacity-0 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex flex-col justify-evenly w-full h-36 p-2">
                    <div className="grid grid-cols-4 grid-rows-2 h-3/4">
                      <div className="col-span-2 flex flex-row items-center">
                        <Image
                          src={locationIcon}
                          alt="Location Icon"
                          width={24}
                          height={24}
                          className=""
                        />
                        <p className="font-bold ml-2 w-36 truncate">
                          {booking.location}
                        </p>
                      </div>
                      <div className="col-span-2 flex flex-row items-center">
                        <Image
                          src={calendarIcon}
                          alt="Calendar Icon"
                          width={24}
                          height={24}
                          className=""
                        />
                        <p className="font-bold ml-2">
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="col-span-2 flex flex-row items-center">
                        <Image
                          src={usersIcon}
                          alt="Users Icon"
                          width={24}
                          height={24}
                          className=""
                        />
                        <p
                          onClick={() => openAttendeesPopup(booking._id)}
                          className="font-bold ml-2"
                        >
                          {yesAttendees.length}/{booking.playerLimit}
                        </p>
                      </div>
                      <div className="col-span-2 flex flex-row items-center">
                        <Image
                          src={clockIcon}
                          alt="Clock Icon"
                          width={24}
                          height={24}
                          className=""
                        />
                        <p className="font-bold ml-2">{booking.time}</p>
                      </div>
                    </div>

                    <div className="flex flex-row justify-evenly w-full h-1/4">
                      <button
                        className={`w-36 h-8 text-md bg-btn rounded-md text-nav font-bold shadow-lg ${
                          userStatus === "yes" ? "bg-green-500" : "bg-gray-500"
                        }`}
                        onClick={() => handleRSVP(booking._id, "yes")}
                      >
                        I'll be there!
                      </button>
                      <button
                        className={`w-36 h-8 bg-btn rounded-md text-nav font-bold shadow-lg flex flex-row justify-center items-center ${
                          userStatus === "no" ? "bg-red-500" : "bg-gray-500"
                        }`}
                        onClick={() => handleRSVP(booking._id, "no")}
                      >
                        <p>I can't</p>
                        <Image
                          src={sadFace}
                          alt="Clock Icon"
                          width={18}
                          height={18}
                          className="ml-2"
                        />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No bookings available.</p>
        )}
      </div>
      {activePopupBookingId && (
        <BookingAttendeesPopup
          bookingId={activePopupBookingId}
          onClose={() => setActivePopupBookingId(null)}
        />
      )}
    </div>
  );
};

export default BookingList;
