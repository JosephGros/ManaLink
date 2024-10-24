"use client";

import Image from "next/image";
import DeckForm from "../components/DeckForm";
import UserDecks from "../components/DeckList";
import { useState } from "react";
import newDeck from "../../../public/assets/Icons/NavColor/card-heart_1.png";
import BackButton from "../components/BackBtn";

const DeckPage = () => {
  const [showDeckForm, setShowDeckForm] = useState(false);

  const handleAddDeck = () => {
    setShowDeckForm(true);
  };

  const handleDeckCreated = () => {
    setShowDeckForm(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-14 w-full bg-background flex justify-center items-center z-10 border-b border-bg3">
        <BackButton
          label="Back"
          className="fixed left-4 text-textcolor rounded-md w-12 flex items-center"
        />
        <h1 className="text-3xl font-bold text-center text-textcolor">Decks</h1>
        {!showDeckForm && (
          <button
            onClick={handleAddDeck}
            className="absolute right-4 bg-btn font-bold text-nav py-1 px-1 sm:px-2 rounded-md"
          >
            <div className="flex flex-row justify-center items-center">
              <p>New Deck</p>
              <Image
                src={newDeck}
                alt="New Deck"
                width={33}
                height={33}
                className="ml-2"
              />
            </div>
          </button>
        )}
      </div>
      <div className="fixed top-14 left-0 right-0 bottom-20">
        <div className="w-full h-full flex flex-col items-center overflow-auto">
          {showDeckForm ? (
            <DeckForm onDeckCreated={handleDeckCreated} />
          ) : (
            <UserDecks />
          )}
        </div>
      </div>
    </>
  );
};

export default DeckPage;