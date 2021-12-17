import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playListAtom";
import Song from "./Song";

function Songs() {
  const playlist = useRecoilValue(playlistState);
  return (
    <div className="text-white">
      {playlist?.tracks.items.map((track, i) => {
        return (
          <div>
            <Song key={track.track.id} track={track} order={i} />
          </div>
        );
      })}
    </div>
  );
}

export default Songs;
