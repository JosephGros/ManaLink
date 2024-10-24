"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import dateIcon from "../../../public/assets/Icons/IconColor/calendar-star.png";
import deckIcon from "../../../public/assets/Icons/IconColor/card-heart.png";
import CustomMemberDropdown from "./CustomMemberDrop";
import "react-datepicker/dist/react-datepicker.css";

interface PlaygroupMember {
  _id: string;
  username: string;
  level: number;
  profilePicture: string;
  friends: string[];
  isAdmin?: boolean;
  isModerator?: boolean;
  playgroups: string[];
}

const GameForm = ({ playgroupId }: { playgroupId: string }) => {
  const [date, setDate] = useState("");
  const [playgroup, setPlaygroup] = useState("");
  const [playgroupName, setPlaygroupName] = useState("");
  const [winningUserId, setWinningUserId] = useState("");
  const [winningUsername, setWinningUsername] = useState("");
  const [amountOfPlayers, setAmountOfPlayers] = useState(0);
  const [winningDeck, setWinningDeck] = useState({
    commanderId: "",
    deckName: "",
    commanderName: "",
    manaCost: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMember, setSelectedMember] = useState<PlaygroupMember | null>(
    null
  );
  const [membersList, setMembersList] = useState<PlaygroupMember[]>([]);

  useEffect(() => {
    const fetchPlaygroupData = async () => {
      try {
        const response = await fetch(`/api/playgroups/${playgroupId}/details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playgroupId }),
        });
        const data = await response.json();

        if (response.ok) {
          setPlaygroup(data);
          console.log(data);
        } else {
          alert("Failed to fetch playgroup data.");
        }
      } catch (error) {
        console.error("Error fetching playgroup data:", error);
      }
    };

    fetchPlaygroupData();
  }, [playgroupId]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/playgroups/${playgroupId}/members`);
        const data = await response.json();
        setMembersList(data.members);
        setPlaygroupName(data.name);
      } catch (error) {
        console.error("Error fetching playgroup members:", error);
      }
    };

    fetchMembers();
  }, [playgroupId]);

  const adjustDateForTimezone = (date: Date | null): string => {
    if (!date) return "";
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localTime = new Date(date.getTime() - timezoneOffset);
    return localTime.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = selectedDate
      ? adjustDateForTimezone(selectedDate)
      : "";
    const response = await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: formattedDate,
        playgroupId,
        playgroupName,
        winningUserId,
        winningUsername,
        amountOfPlayers,
        winningDeck,
      }),
    });

    if (response.ok) {
      alert("Game registered successfully!");
    } else {
      alert("Failed to register the game.");
    }
  };

  return (
    <div className="text-textcolor h-full flex flex-col justify-center items-center mt-6">
      <div className="flex flex-col justify-center items-center bg-bg2 rounded-lg w-full p-4">
        <h2 className="font-bold text-3xl mb-4">Register Game</h2>
        <form 
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center">
          <div className="relative flex items-center w-64">
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
              className="w-64 h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-center text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 flex justify-center"
            />
          </div>
          <CustomMemberDropdown
            membersList={membersList}
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
          />
          {/* <input
            type="number"
            placeholder="Amount of Players"
            value={amountOfPlayers}
            onChange={(e) => setAmountOfPlayers(Number(e.target.value))}
            required
          /> */}
          <div className="relative flex items-center w-64">
            <Image
              src={deckIcon}
              alt="Date Icon"
              width={24}
              height={24}
              className="absolute left-2"
            />
            <input
              type="text"
              placeholder="Winning Deck Name"
              value={winningDeck.deckName}
              onChange={(e) =>
                setWinningDeck({ ...winningDeck, deckName: e.target.value })
              }
              required
              className="w-64 h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-center text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 flex justify-center"
            />
          </div>
          <button
            type="submit"
            className="w-32 h-9 mt-2 bg-btn rounded-md text-nav font-bold shadow-lg"
          >
            Register Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameForm;