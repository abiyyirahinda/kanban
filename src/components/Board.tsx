"use client";
import { DEFAULT_CARDS } from "@/data/cards";
import { CardType } from "@/types/types";
import React, { useEffect, useState } from "react";
import TrashBin from "./TrashBin";
import Column from "./Column";

const Board = () => {
  const savedCards =
    JSON.parse(localStorage.getItem("cards") || "null") || DEFAULT_CARDS;
  const [cards, setCards] = useState<CardType[]>(savedCards);

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);
  return (
    <div className=" grid justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 ">
      

      <Column
        title="Backlog"
        column="backlog"
        headingColor="text-white"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress"
        column="doing"
        headingColor="text-orange-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-green-600"
        cards={cards}
        setCards={setCards}
      />
      <TrashBin setCards={setCards} cards={cards} />
    </div>
  );
};

export default Board;
