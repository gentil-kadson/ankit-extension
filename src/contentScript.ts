import type { Flashcard } from "./types";

window.addEventListener("message", (event: MessageEvent) => {
  if (
    event.source === window &&
    event.data.type === "ANKIT" &&
    event.data.flashcards
  ) {
    const flashcards: Flashcard[] = event.data.flashcards;

    chrome.runtime.sendMessage({
      type: "FLASHCARDS_DATA",
      payload: flashcards,
    });
  }
});
