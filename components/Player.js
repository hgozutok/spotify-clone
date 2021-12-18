import {
  FastForwardIcon,
  MinusCircleIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = React.useState(50);
  const songInfo = useSongInfo();

  const fetchCurrentSong = async () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item.id);
        console.log("now playing", data.body?.item.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);

          console.log("is playing", data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  const debounceAdjustVolume = React.useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {
        console.log(err);
      });
    }, 1000),
    []
  );

  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900 text-white first-letter:grid grid-cols-3
       text-xs md:text-base md: px-8"
    >
      <div className="flex items-center space-x-4">
        <img
          className=" md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>

          <p>{songInfo?.artists[0]?.name}</p>
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        <RewindIcon className="h-5 w-5 " />
        {isPlaying ? (
          <PauseIcon
            onClick={handlePlayPause}
            className="w-10 h-10 text-white"
          />
        ) : (
          <PlayIcon
            onClick={handlePlayPause}
            className="w-10 h-10 text-white"
          />
        )}
        <FastForwardIcon className="h-5 w-5 text-white" />
        <ReplyIcon className="h-5 w-5 text-white" />

        <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
          <MinusCircleIcon
            className="h-5 w-5 text-white"
            onClick={() => (volume > 0 ? setVolume(volume - 10) : setVolume(0))}
          />
          <input
            className="w-14 md:w-28"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <VolumeUpIcon
            onClick={() =>
              volume < 100 ? setVolume(volume + 10) : setVolume(100)
            }
            className="h-5 w-5 text-white"
          />
        </div>
      </div>
    </div>
  );
}

export default Player;
