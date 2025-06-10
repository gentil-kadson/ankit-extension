import type { Flashcard } from "./types";

window.addEventListener("message", (event: MessageEvent) => {
  if (
    event.source === window &&
    event.data.type === "ANKIT" &&
    event.data.flashcards
  ) {
    const flashcards: Flashcard[] = event.data.flashcards;
    console.log("received flashcards in content script:", flashcards);

    chrome.runtime.sendMessage({
      type: "FLASHCARDS_DATA",
      payload: flashcards,
    });
  }
});
