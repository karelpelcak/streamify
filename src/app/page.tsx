"use client";
import { useEffect, useState } from "react";
import CurrentPlaying from "./component/CurrentPlaying";
import Cookies from "js-cookie";

const Page = () => {
  const defaultUrl = "http://localhost:3000/";
  const accessToken = Cookies.get("Token");
  const [UUID, setUUID] = useState(""); // Přidání useState pro UUID

  const Logout = () => {
    Cookies.remove("Token");
    window.location.reload();
  };

  const FetchData = async () => {
    try {
      const res = await fetch(`/api/url?accestoken=${accessToken}`, {
        method: "GET",
      });
      const data = await res.json();
      console.log(data.msg.uUID_string);
      setUUID(data.msg.uUID_string); // Aktualizace stavu UUID
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div>
      {accessToken ? (
        <div>
          <button onClick={Logout}>Logout</button>
        </div>
      ) : (
        <a href="/login">Login</a>
      )}
      <CurrentPlaying />
      {UUID ? <h1>{defaultUrl + UUID}</h1> : null} {/* Zobrazení UUID */}
    </div>
  );
};

export default Page;
