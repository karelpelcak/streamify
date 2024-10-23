"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] }; // Přidání pole obrázků
}

interface CurrentTrackResponse {
  item?: Track; // Zůstává volitelné
}

const CurrentPlaying: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<CurrentTrackResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Stav načítání

  useEffect(() => {
    let isMounted = true; // Sledování, zda je komponent namontovaný

    const fetchCurrentPlaying = async () => {
      const accessToken = Cookies.get("Token");

      if (!accessToken) {
        setError("No access token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Error fetching current playing: ${errorData.error.message}`
          );
        }

        const data: CurrentTrackResponse = await response.json();
        console.log("🚀 ~ fetchCurrentPlaying ~ data:", data);

        // Kontrola, zda se skladba změnila
        if (isMounted && data.item?.id !== currentTrack?.item?.id) {
          setCurrentTrack(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        }
      } finally {
        if (isMounted) setLoading(false); // Nastavení načítání na false bez ohledu na úspěch nebo chybu
      }
    };

    // První načtení
    fetchCurrentPlaying();

    // Nastavení intervalu pro načítání každých 5 sekund
    const intervalId = setInterval(fetchCurrentPlaying, 5000);

    // Čistící funkce při odmontování komponenty
    return () => {
      isMounted = false; // Zabránění aktualizaci stavu u odmontované komponenty
      clearInterval(intervalId);
    };
  }, []); // Odebrání currentTrack z pole závislostí

  if (loading) {
    return <div>Loading...</div>; // Stav načítání
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {currentTrack && (
        <div className="w-[300px] h-[70px] flex flex-row overflow-hidden gap-4 border-white border-2 rounded-lg">
          <img
            src={currentTrack.item?.album.images[0]?.url} // Obrázek alba
            alt={`${currentTrack.item?.name} album cover`}
            className="h-[66px] rounded-lg"
          />
          <div className="flex flex-col justify-center overflow-hidden">
            <p className="text-lg whitespace-nowrap">
              {currentTrack.item?.artists
                .map((artist) => artist.name)
                .join(", ")}
            </p>
            <p className="text-2xl whitespace-nowrap">
              {currentTrack.item?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentPlaying;
