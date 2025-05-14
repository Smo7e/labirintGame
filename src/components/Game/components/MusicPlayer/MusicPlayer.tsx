import React, { useState, useRef, useEffect } from "react";
import chipiChipiAudio from "./scary.mp3";

const MusicPlayer: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.7;
            audioRef.current.play();
        }
    }, []);

    return (
        <div>
            <audio ref={audioRef} src={chipiChipiAudio} loop />

            <button
                onClick={togglePlayPause}
                className="noselect "
                style={{
                    backgroundColor: "#b0c4de",
                    opacity: 0.5,
                    color: "black",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 9999,
                    position: "absolute",
                    right: "5vw",
                    top: "0",
                    fontSize: `min(2vh,2vw)`,
                }}
            >
                {"Music "}
                {isPlaying ? "Pause" : "Play"}
            </button>
        </div>
    );
};

export default MusicPlayer;
