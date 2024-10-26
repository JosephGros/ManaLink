import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import deckIcon from "../../../public/assets/Icons/IconColor/card-heart.png";
import arrowDownIcon from "../../../public/assets/Icons/IconColor/angle-small-down.png";
import arrowUpIcon from "../../../public/assets/Icons/IconColor/angle-small-up (1).png";

interface Deck {
    commanderId: string;
    deckName: string;
    commanderName: string;
    manaCost: string;
    image_uris: {
      small: String,
      normal: String,
      large: String,
      png: String,
      art_crop: String,
      border_crop: String
    },
  }

const CustomDeckDropdown = ({
  selectedMember,
  selectedDeck,
  setSelectedDeck,
}: {
  selectedMember: { _id: string } | null;
  selectedDeck: Deck | null;
  setSelectedDeck: (deck: Deck | null) => void;
}) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDecks = async () => {
      if (selectedMember) {
        try {
          const response = await fetch(`/api/users/${selectedMember._id}/decks`);
          const data = await response.json();
          if (data.success) {
            setDecks(data.decks);
          } else {
            alert("Failed to fetch decks for the selected member.");
          }
        } catch (error) {
          console.error("Error fetching decks:", error);
        }
      }
    };

    fetchDecks();
  }, [selectedMember]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (deck: Deck) => {
    setSelectedDeck(deck);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-64">
      <div
        className="w-full bg-input bg-opacity-20 rounded-md p-2 flex justify-between items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <Image src={deckIcon} alt="Deck Icon" width={24} height={24} className="mr-2" />
          <span className="text-textcolor ml-2">
            {selectedDeck ? selectedDeck.deckName : "Select Deck"}
          </span>
        </div>
        {!isOpen ? (
          <Image src={arrowDownIcon} alt="Arrow Down Icon" width={24} height={24} className="mr-2" />
        ) : (
          isOpen && <Image src={arrowUpIcon} alt="Arrow Up Icon" width={24} height={24} className="mr-2" />
        )}
      </div>

      {isOpen && (
        <div ref={dropdownRef} className="absolute z-50 w-full mt-2 bg-bg3 border border-logo rounded-md shadow-lg">
          {decks.map((deck) => (
            <div
              key={deck.commanderId}
              className="p-2 hover:bg-background text-textcolor cursor-pointer rounded-lg"
              onClick={() => handleSelect(deck)}
            >
              {deck.deckName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDeckDropdown;