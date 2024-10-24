"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import locationIcon from "../../public/assets/Icons/IconColor/navigation_1.png";
import calendarIcon from "../../public/assets/Icons/IconColor/calendar-star.png";
import clockIcon from "../../public/assets/Icons/IconColor/alarm-clock.png";
import usersIcon from "../../public/assets/Icons/IconColor/users-alt_1.png";
import playgroupIcon from "../../public/assets/Icons/IconColor/dice-d20_1.png";
import logo from "../../public/assets/ManaLinkLogo.png";
import CustomLoader from "./components/CustomLoading";

interface User {
  _id: string;
  username: string;
  manalinks?: { bookingId: string }[];
}

interface Booking {
  _id: string;
  title: string;
  date: string;
  location: string;
  time: string;
  playerLimit: number;
  playgroupname: string;
  attendees: {
    userId: string;
    status: "yes" | "no" | "pending";
  }[];
}

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

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [manalinks, setManaLinks] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch("/api/user-profile");
        const data = await response.json();
        setUser(data.user);

        const manalinkIds =
          data.user.manalinks?.map(
            (link: { bookingId: string }) => link.bookingId
          ) || [];
        setManaLinks(manalinkIds);

        if (manalinkIds.length > 0) {
          setIsLoading(true);
          const bookingsResponse = await fetch("/api/manalinks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ manalinks: manalinkIds }),
          });
          const bookingsData: Booking[] = await bookingsResponse.json();

          const now = new Date();

          const sortedBookings = bookingsData
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
          setIsLoading(false);
          console.log(bookingsData);
        }
      } catch (error) {
        console.error("Error fetching user data or bookings:", error);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <div className="text-textcolor fixed top-0 left-0 right-0 bottom-20 pt-4 flex flex-col items-center mx-2">
      <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-background">
        <div className="">
          <Image
            src={logo}
            alt="ManaLink Logo"
            width={380}
            height={200}
            className="mx-auto mb-16"
          />
        </div>
        <h1 className="font-bold text-3xl text-center mb-4">
          Welcome back to ManaLink {user?.username}!
        </h1>
        <div className="mt-4 p-1 w-96 h-96 sm:h-11/12 rounded-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),inset_0_-2px_4px_rgba(0,0,0,0.6)]">
          <div className="p-4 h-full flex flex-col items-center w-full overflow-auto box-border rounded-md">
            <h2 className="font-bold text-xl mb-4">Your upcoming ManaLink's</h2>
            {isLoading ? (
              <div className="flex justify-center">
                <CustomLoader />
              </div>
            ) : bookings.length > 0 ? (
              <ul className="w-full">
                {bookings.map((booking, index) => {
                  const yesAttendees = booking.attendees.filter(
                    (att) => att.status === "yes"
                  );

                  return (
                    <li
                      key={booking._id}
                      className="flex flex-row justify-start items-center bg-bg2 rounded-lg w-full p-2 mb-4 shadow-lg h-36 opacity-0 animate-fadeIn"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="flex flex-col justify-evenly w-full h-36 p-2">
                        <div className="flex flex-row justify-center items-center w-full mb-4">
                            <Image
                              src={playgroupIcon}
                              alt="Location Icon"
                              width={30}
                              height={30}
                            />
                            <p className="font-bold ml-2 w-36 truncate">
                              {booking.playgroupname}
                            </p>
                          </div>
                        <div className="grid grid-cols-4 grid-rows-2 h-3/4">
                          <div className="col-span-2 flex flex-row items-center">
                            <Image
                              src={locationIcon}
                              alt="Location Icon"
                              width={24}
                              height={24}
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
                            />
                            <p className="font-bold ml-2">
                              {yesAttendees.length}/{booking.playerLimit}
                            </p>
                          </div>
                          <div className="col-span-2 flex flex-row items-center">
                            <Image
                              src={clockIcon}
                              alt="Clock Icon"
                              width={24}
                              height={24}
                            />
                            <p className="font-bold ml-2">{booking.time}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;