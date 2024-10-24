"use client";

import BookingList from "@/app/components/Booking";
import BookingForm from "@/app/components/BookingForm";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CustomCalendar from "@/app/components/CustomCalendar";
import calendarIcon from "../../../../../public/assets/Icons/NavColor/calendar-gavel-legal_1.png";
import Image from "next/image";

const BookingPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [playgroupname, setPlaygroupname] = useState("");
  const pathname = usePathname();
  const groupId = pathname.split("/")[2];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`/api/playgroups/${groupId}/details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playgroupId: groupId }),
        });
        const playgroup = await response.json();
        setPlaygroupname(playgroup.playgroup.playgroupname);
      } catch (error) {
        console.error("Error fetching user data or bookings:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleBookingCreated = () => {
    setShowForm(false);
  };

  return (
    <div className="text-textcolor">
      <div className="fixed top-0 left-0 right-0 h-14 w-full bg-background flex justify-center items-center z-10 border-b-2 border-bg3">
        <h1 className="font-bold text-3xl">ManaLink's</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="absolute right-4 bg-btn font-bold text-nav py-1 px-1 sm:px-2 rounded-md flex flex-row justify-center items-center"
        >
          <p>New</p>
          <Image
            src={calendarIcon}
            alt="Calendar Icon"
            width={24}
            height={24}
            className="ml-2"
          />
        </button>
      </div>
      {showForm ? (
        <div className="fixed top-14 left-0 right-0 bottom-36">
          <div className="w-full h-full flex flex-col overflow-auto">
            <div className="flex flex-col justify-center items-center">
              <BookingForm
                groupId={groupId}
                playgroupname={playgroupname}
                onBookingCreated={handleBookingCreated}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed top-14 left-0 right-0 bottom-36">
          <div className="w-full h-full flex flex-col justify-center items-center overflow-auto">
            <div className="flex flex-col md:flex-row justify-evenly items-center lg:w-3/4 w-full h-full opacity-0 animate-fadeIn">
              <CustomCalendar groupId={groupId} />
              <BookingList groupId={groupId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;