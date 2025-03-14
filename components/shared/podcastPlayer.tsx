"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatTime, cn } from "@/lib/utils";
import { useAudio } from "@/providers/audioProvider";
import { Progress } from "../ui/progress";

const PodcastPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { audio } = useAudio();

  // Toggle play/pause state
  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  // Toggle mute/unmute state
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  // Forward 5 seconds
  const forward = () => {
    if (
      audioRef.current &&
      audioRef.current.currentTime &&
      audioRef.current.duration &&
      audioRef.current.currentTime + 5 < audioRef.current.duration
    ) {
      audioRef.current.currentTime += 5;
    }
  };

  // Rewind 5 seconds
  const rewind = () => {
    if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
      audioRef.current.currentTime -= 5;
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Update current time for progress tracking
  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateCurrentTime);

      return () => {
        audioElement.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, []);

  // Handle audio source changes
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audio?.audioUrl) {
      if (audioElement) {
        audioElement.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
          });
      }
    } else {
      audioElement?.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  // Set duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle audio end
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Don't render if no audio URL is available
  if (!audio?.audioUrl || audio.audioUrl === "") {
    return null;
  }

  return (
    <div className="sticky bottom-0 left-0 flex size-full flex-col">
      <Progress
        value={(currentTime / duration) * 100}
        className="w-full"
        max={duration}
      />
      <section className="glassmorphism-black flex h-[112px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12">
        <audio
          ref={audioRef}
          src={audio.audioUrl}
          className="hidden"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
        
        <div className="flex items-center gap-4 max-md:hidden">
          <Link href={`/podcast/${audio.podcastId}`}>
            <Image
              src={audio.imageUrl || "/images/player1.png"}
              width={64}
              height={64}
              alt="podcast thumbnail"
              className="aspect-square rounded-xl"
            />
          </Link>
          <div className="flex w-[160px] flex-col">
            <h2 className="text-14 truncate font-semibold text-white-1">
              {audio.title}
            </h2>
            <p className="text-12 font-normal text-white-2">{audio.author}</p>
          </div>
        </div>

        <div className="flex-center cursor-pointer gap-3 md:gap-6">
          <div className="flex items-center gap-1.5">
            <Image
              src="/icons/reverse.svg"
              width={24}
              height={24}
              alt="rewind"
              onClick={rewind}
            />
            <h2 className="text-12 font-bold text-white-4">-5</h2>
          </div>
          <Image
            src={isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
            width={30}
            height={30}
            alt={isPlaying ? "pause" : "play"}
            onClick={togglePlayPause}
          />
          <div className="flex items-center gap-1.5">
            <h2 className="text-12 font-bold text-white-4">+5</h2>
            <Image
              src="/icons/forward.svg"
              width={24}
              height={24}
              alt="forward"
              onClick={forward}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <h2 className="text-16 font-normal text-white-2 max-md:hidden">
            {formatTime(duration)}
          </h2>
          <div className="flex w-full gap-2">
            <Image
              src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
              width={24}
              height={24}
              alt={isMuted ? "unmute" : "mute"}
              onClick={toggleMute}
              className="cursor-pointer"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayer;