"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import dateIcon from "../../../public/assets/Icons/IconColor/calendar-star.png";
import deckIcon from "../../../public/assets/Icons/IconColor/card-heart.png";
import CustomMemberDropdown from "./CustomMemberDrop";
import "react-datepicker/dist/react-datepicker.css";
import CustomDeckDropdown from "./CustomDeckDrop";
import BackButton from "./BackBtn";
import Alert from "./Alert";
import { useRouter } from "next/navigation";
import CustomWinnerDropdown from "./CustomWinnerDrop";

interface PlaygroupMember {
  _id: string;
  username: string;
  userCode: string;
  level: number;
  profilePicture: string;
  friends: string[];
  isAdmin?: boolean;
  isModerator?: boolean;
  playgroups: string[];
}

interface Deck {
  commanderId: string;
  deckName: string;
  commanderName: string;
  manaCost: string;
  image_uris: {
    small: String;
    normal: String;
    large: String;
    png: String;
    art_crop: String;
    border_crop: String;
  };
}

interface Participant {
  user: PlaygroupMember | null;
  deck: Deck | null;
}

const GameForm = ({ playgroupId }: { playgroupId: string }) => {
  const [date, setDate] = useState("");
  const [playgroup, setPlaygroup] = useState("");
  const [playgroupName, setPlaygroupName] = useState("");
  const [winningUserId, setWinningUserId] = useState("");
  const [winningUsername, setWinningUsername] = useState("");
  const [amountOfPlayers, setAmountOfPlayers] = useState(2);
  const [winningDeck, setWinningDeck] = useState<Deck | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [membersList, setMembersList] = useState<PlaygroupMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<PlaygroupMember | null>(
    null
  );
  const [selectedMembers, setSelectedMembers] = useState<PlaygroupMember[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);
  const router = useRouter();
  const [participants, setParticipants] = useState(
    Array(2).fill({ user: null, deck: null })
  );
  const [winningParticipant, setWinningParticipant] =
    useState<Participant | null>(null);

  useEffect(() => {
    setParticipants((prevParticipants) =>
      Array(amountOfPlayers)
        .fill(null)
        .map(
          (_, index) => prevParticipants[index] || { user: null, deck: null }
        )
    );
  }, [amountOfPlayers]);

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
        } else {
          setAlert({
            message: "Failed to fetch playgroup data.",
            type: "error",
          });
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

  const handlePlayersChange = (num: number) => {
    setParticipants(
      Array.from({ length: num }, () => ({ user: null, deck: null }))
    );
    setAmountOfPlayers(num);
  };

  const handleParticipantChange = (
    index: number,
    user: PlaygroupMember | null
  ) => {
    setParticipants((prev) =>
      prev.map((p, i) => (i === index ? { ...p, user } : p))
    );
  };

  const handleDeckChange = (index: number, deck: Deck | null) => {
    setParticipants((prev) =>
      prev.map((p, i) => (i === index ? { ...p, deck } : p))
    );
  };

  const adjustDateForTimezone = (date: Date | null): string => {
    if (!date) return "";
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localTime = new Date(date.getTime() - timezoneOffset);
    return localTime.toISOString().split("T")[0];
  };

  const participantPayload = participants.map(({ user, deck }) => ({
    userId: user?._id,
    deckId: deck?.commanderId,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    const formattedDate = selectedDate
      ? adjustDateForTimezone(selectedDate)
      : "";
    e.preventDefault();
    if (!winningParticipant?.user) {
      setAlert({ message: "Select the winner.", type: "error" });
      return;
    }

    const response = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: formattedDate,
        playgroupId,
        playgroupName,
        winningUserId: winningParticipant?.user?._id,
        winningUsername: winningParticipant?.user?.username,
        amountOfPlayers: participants.length,
        winningDeck: winningParticipant?.deck,
        participants: participantPayload,
      }),
    });

    if (response.ok) {
      setAlert({ message: "Game registered successfully!", type: "success" });
      setTimeout(() => router.back(), 3000);
    } else {
      setAlert({ message: "Failed to register the game.", type: "error" });
    }
  };

  return (
    <div className="text-textcolor h-full flex flex-col justify-center items-center mt-6">
      <div className="flex flex-col justify-center items-center bg-bg2 rounded-lg w-96 p-4">
        <h2 className="font-bold text-3xl mb-4">Register Game</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center"
        >
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
          <div className="my-1.5 w-64">
            <label
              htmlFor="amountOfPlayers"
              className="block mb-2 text-textcolor"
            >
              Number of Players: {amountOfPlayers}
            </label>
            <input
              type="range"
              id="amountOfPlayers"
              min="2"
              max="6"
              value={participants.length}
              onChange={(e) => handlePlayersChange(Number(e.target.value))}
              className="w-full h-2 bg-btn rounded-lg appearance-none cursor-pointer accent-logo"
            />
          </div>
          {participants.map((participant, index) => (
            <div key={index} className="my-1.5">
              <div>
                <CustomMemberDropdown
                  membersList={membersList}
                  selectedMember={participant.user}
                  setSelectedMember={(user) =>
                    handleParticipantChange(index, user)
                  }
                />
              </div>
              {participant.user && (
                <div className="my-1.5">
                  <CustomDeckDropdown
                    selectedMember={participant.user}
                    selectedDeck={participant.deck}
                    setSelectedDeck={(deck) => handleDeckChange(index, deck)}
                  />
                </div>
              )}
            </div>
          ))}
          <div className="my-1.5">
            <CustomWinnerDropdown
              participants={
                participants
                  .map((p) => p.user)
                  .filter(Boolean) as PlaygroupMember[]
              }
              winningParticipant={winningParticipant?.user || null}
              setWinningParticipant={(user) =>
                setWinningParticipant(
                  participants.find((p) => p.user?._id === user?._id) || null
                )
              }
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1 h-9 mt-4 bg-btn rounded-md text-nav font-bold shadow-lg"
          >
            Register Game!
          </button>
        </form>
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </div>
  );
};

export default GameForm;