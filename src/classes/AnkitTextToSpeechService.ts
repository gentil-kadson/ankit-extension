export default class AnkitTextToSpeechService {
  private baseUrl: string = import.meta.env
    .VITE_ANKIT_TEXT_TO_SPEECH_API_BASE_URL;

  async arrayBufferToBase64(arrayBuffer: ArrayBuffer): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(new Blob([arrayBuffer]));
    });
  }

  async generateBase64Audio(input: string) {
    const audioDataResponse = await fetch(`${this.baseUrl}/speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-extension-secret": import.meta.env.VITE_EXTENSION_SECRET,
      },
      body: JSON.stringify({ input }),
    });

    if (audioDataResponse.status === 500) {
      throw Error(
        "Não foi possível gerar os áudios para os cartões. Tente novamente mais tarde"
      );
    }
    if (audioDataResponse.status === 403) {
      throw Error(
        "Sua extensão não tem permissão para gerar os áudios. Por favor, reinstale-a"
      );
    }

    const arrayBuffer = await audioDataResponse.arrayBuffer();
    const base64Audio = await this.arrayBufferToBase64(arrayBuffer);
    return base64Audio;
  }
}
