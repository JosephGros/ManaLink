"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import deleteIcon from "../../../public/assets/Icons/NavColor/trash3.png";
import DeleteDeckPopup from "./DeleteDeckPopup";
import CustomLoader from "./CustomLoading";

interface Deck {
  _id: string;
  deckName: string;
  commanderName: string;
  commanderId: string;
  manaCost: string;
  mana_symbols: {
    symbol: string;
    svg_uri: string;
  }[];
  image_uris?: {
    normal?: string;
  };
  wins: {
    gameId: string;
  }[];
  losses: {
    gameId: string;
  }[];
}

const UserDecks = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  const fetchUserDecks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/decks/users-decks");
      const data = await res.json();
      setDecks(data.decks.decks);
    } catch (error) {
      console.error("Error fetching user decks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDecks();
  }, []);

  const handleDeleteDeck = async () => {
    if (!selectedDeck) return;

    try {
      const res = await fetch(`/api/decks/delete/${selectedDeck._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDecks(decks.filter((deck) => deck._id !== selectedDeck._id));
        setShowDeletePopup(false);
      } else {
        console.error("Failed to delete deck");
      }
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  const openDeletePopup = (deck: Deck) => {
    setSelectedDeck(deck);
    setShowDeletePopup(true);
  };

  useEffect(() => {
    fetchUserDecks();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-textcolor w-full">
      {isLoading && (
        <div className="flex justify-center items-center">
          <CustomLoader />
        </div>
      )}
      {decks.length > 0 ? (
        <ul className="w-full flex flex-wrap justify-center items-center overflow-auto">
          {decks.map((deck, index) => (
            <li
              key={index}
              className="h-38 w-96 mx-2 rounded-lg flex flex-col items-center p-2 my-4 shadow-md bg-bg2"
            >
              <div className="flex flex-row justify-center items-center w-full">
                <h2 className="font-bold w-full text-center text-2xl mb-2">
                  {deck.deckName}
                </h2>
                <div className="mb-2 w-20 h-8 flex justify-center items-center">
                  <button
                    onClick={() => openDeletePopup(deck)}
                    className="bg-btn px-4 py-1 rounded-md"
                  >
                    <Image
                      src={deleteIcon}
                      alt="Delete Icon"
                      width={25}
                      height={25}
                      className="w-6 h-6"
                    />
                  </button>
                </div>
              </div>
              <div className="flex flex-row justify-center p-2 rounded-md shadow-[inset_0_2px_4px_rgba(42,42,42,1),inset_0_-2px_4px_rgba(42,42,42,1)]">
                <Image
                  src={
                    deck.image_uris?.normal || "/assets/profile-pics/mtg.webp"
                  }
                  alt={deck.commanderName}
                  width={150}
                  height={210}
                  className="rounded-md w-40 h-56 shadow-md"
                />
                <div className="w-full h-56 flex flex-col justify-between items-between ml-2">
                  <div>
                    <p className="font-bold mb-2">{deck.commanderName}</p>
                    <div className="flex flex-row">
                      {deck.mana_symbols?.map((symbol, index) =>
                        symbol.svg_uri ? (
                          <Image
                            key={index}
                            src={symbol.svg_uri}
                            alt={symbol.symbol}
                            width={20}
                            height={20}
                            className="mr-1"
                          />
                        ) : (
                          <span key={index}>{symbol.symbol}</span>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-row mt-4">
                      <Image
                        src="/assets/Icons/IconColor/medal.png"
                        alt="Wins Icon"
                        width={24}
                        height={24}
                        className="mr-4"
                      />
                      <p>{deck.wins.length} - Wins</p>
                    </div>
                    <div className="flex flex-row my-2">
                      <Image
                        src="/assets/Icons/IconColor/coffin-cross_1.png"
                        alt="Lose Icon"
                        width={24}
                        height={24}
                        className="mr-4"
                      />
                      <p>{deck.losses.length} - Losses</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <>
        </>
      )}
      {showDeletePopup && selectedDeck && (
        <DeleteDeckPopup
          deckName={selectedDeck.deckName}
          onConfirm={handleDeleteDeck}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}
    </div>
  );
};

export default UserDecks;
