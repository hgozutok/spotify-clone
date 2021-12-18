import React, { useEffect } from "react";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  RssIcon,
  HeartIcon,
  PlusCircleIcon,
  LogoutIcon,
} from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
//import spotifyApi from "../lib/spotify";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playListAtom";

function SideBar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = React.useState([]);
  const [playlistId, setPlaylistID] = useRecoilState(playlistIdState);
  const getPlaylist = async () => {
    await spotifyApi.getUserPlaylists().then((data) => {
      setPlaylists(data.body.items);
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      getPlaylist();
    }
  }, [session, spotifyApi]);

  console.log(playlists);
  console.log(session);
  return (
    <div
      className="text-gray-500 p-5 text-sm border-r 
    border-gray-900 pb-36"
    >
      <button className="flex items-center space-x-2 hover:text-white">
        <HomeIcon className="h-5 w-5 text-blue-500" />
        <p>Home</p>
      </button>

      <button className="flex items-center space-x-2 hover:text-white">
        <SearchIcon className="h-5 w-5 text-blue-500" />
        <p>Search</p>
      </button>
      <button className="flex items-center space-x-2 hover:text-white">
        <LibraryIcon className="h-5 w-5 text-blue-500" />
        <p>Library</p>
      </button>
      <hr className="border-t-[0.1px]" />

      <button className="flex items-center space-x-2 hover:text-white">
        <PlusCircleIcon className="h-5 w-5 text-blue-500" />
        <p>Create Playlist</p>
      </button>
      <button className="flex items-center space-x-2 hover:text-white">
        <HeartIcon className="h-5 w-5 text-blue-500" />
        <p>Liked Songs</p>
      </button>
      <button className="flex items-center space-x-2 hover:text-white">
        <RssIcon className="h-5 w-5 text-blue-500" />
        <p>Your Episodes</p>
      </button>
      <hr className="border-t-[0.1px]" />
      {playlists.map((playlist) => (
        <p
          className="cursor-pointer hover:text-white"
          onClick={() => setPlaylistID(playlist.id)}
          key={playlist.id}
        >
          {playlist.name}
        </p>
      ))}
    </div>
  );
}

export default SideBar;
