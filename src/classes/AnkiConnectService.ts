export default class AnkiConnectService {
  private baseUrl: string = "http://localhost:8765";
  private baseFetchData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  getDeckNames() {
    const fetchDecksPayload = {
      action: "deckNames",
      version: 6,
    };

    return fetch(this.baseUrl, {
      ...this.baseFetchData,
      body: JSON.stringify(fetchDecksPayload),
    });
  }
}
