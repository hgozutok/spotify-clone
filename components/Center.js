import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { shuffle } from "lodash";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playListAtom";
import useSpotify from "../hooks/useSpotify";

const colors = [
  "from-indigo-500",
  "from-pink-500",
  "from-purple-500",
  "from-blue-500",
  "from-green-500",
  "from-yellow-500",
  "from-orange-500",
  "from-red-500",
];

function Center() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [color, setColor] = React.useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  const getPlaylist = async () => {
    await spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
        console.log(data.body);
      })
      .catch((err) => {
        console.log("playlist data err", err);
      });
  };

  useEffect(() => {
    getPlaylist();
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex flex-grow ">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
          <img className="rounded-full w-10 h-10" src={session?.user.image} />
          <h2>{session?.user.username}</h2>
          <ChevronDownIcon className="w-6 h-6" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to
         to-black
       ${color} h-80 text-white padding-8 w-full`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>
    </div>
  );
}

export default Center;
