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

const page = ({ params }: { params: { uuid: string } }) => {
  const [currentTrack, setCurrentTrack] = useState<CurrentTrackResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Stav načítání

  let Token = "";
  const FetchData = async () => {
    const res = await fetch(`/api/token?_uuid=${params.uuid}`, {
      method: "GET",
    });
    const data = await res.json();
    console.log(data.msg.token_string);
    Token = data.msg.token_string;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentPlaying = async () => {
      await FetchData();
      if (!Token) {
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
              Authorization: `Bearer ${Token}`,
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
        if (isMounted) setLoading(false);
      }
    };

    fetchCurrentPlaying();

    const intervalId = setInterval(fetchCurrentPlaying, 5000);

    return () => {
      isMounted = false; // Zabránění aktualizaci stavu u odmontované komponenty
      clearInterval(intervalId);
    };
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {currentTrack && (
        <div className="w-[300px] h-[70px] bg-black text-white flex flex-row overflow-hidden gap-4 border-white border-2 rounded-lg">
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
export default page;
