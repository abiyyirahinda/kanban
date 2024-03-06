import { CardType, ColumnPropsType } from "@/types/types";
import React, { DragEvent, useState } from "react";
import Card from "./Card";
import DropIndicator from "./DropIndicator";
import AddCard from "./AddCard";

const Column = ({
  title,
  headingColor,
  column,
  cards,
  setCards,
}: ColumnPropsType) => {
  const filteredCards = cards.filter((c) => c.column === column);
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };
  const handleDragEnd = () => {
    clearHighlights();
    setActive(false);
  };
  const handleDrop = (e: DragEvent) => {
    handleDragEnd();
    const cardId = e.dataTransfer.getData("cardId");
    const indicators = getIndicators();
    const { element } = getNearestindicator(e, indicators);

    const before = (element as HTMLElement).dataset.before;

    if (!before) return;

    if (before !== cardId) {
      let copy = structuredClone(cards);

      const moveToEnd = before === "-1";

      let cardToTransfer = cards.filter((c) => c.id === cardId)[0];

      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      if (moveToEnd) {
        // after filtering the cards as per column the newly added card will appear at the end of that coloum even if we are pushing the cardToTrasnfer at the very end of the copy of cards!
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((c) => c.id === before);
        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };
  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights();
    const el = getNearestindicator(e, indicators);
    (el.element as HTMLElement).style.opacity = "1";
  };
  const clearHighlights = () => {
    const indicators = getIndicators();
    indicators.forEach((elm) => ((elm as HTMLElement).style.opacity = "0"));
  };
  const getNearestindicator = (e: DragEvent, indicators: Element[]) => {
    const el = indicators.reduce(
      (closest, child) => {
        const indicatorRects = child.getBoundingClientRect();
        const offset = e.clientY - (indicatorRects.top + 100);

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: -Infinity,
        element: indicators.at(-1),
      }
    );

    return el;
  };
  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column=${column}]`));
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragEnd}
      onDrop={handleDrop}
      className="w-60 shrink-0 bg-neutral-800 rounded-md shadow-md p-4"
    >
      <div className="flex justify-between items-center mb-4 bg-neutral-700 rounded-md p-2">
        
          <h3 className={`text-lg font-semibold ${headingColor}`}>{title}</h3>
          <span className="text-xs bg-blue-800 rounded-full p-2 px-3 ">{filteredCards.length}</span>
        
      </div>
      <div
        className={`h-full w-full transition-colors  ${
          active ? "bg-neutral-800/10" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((card: CardType) => {
          return <Card key={card.id} {...card} setCards={setCards} />;
        })}
        <DropIndicator beforeId={"-1"} column={column} />
        <AddCard cards={cards} column={column} setCards={setCards} />
      </div>
    </div>
  );
};

export default Column;
