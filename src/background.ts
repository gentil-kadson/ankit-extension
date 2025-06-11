import type { Flashcard } from "./types";

let storedFlashcards: Flashcard[] = [];

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "FLASHCARDS_DATA") {
    storedFlashcards = message.payload;

    sendResponse({ status: "Flashcards received on the background" });
  }

  if (message.type === "REQUEST_FLASHCARDS_FROM_BACKGROUND") {
    sendResponse({ flashcards: storedFlashcards });
  }
});
