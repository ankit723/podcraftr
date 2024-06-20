"use client";
import EmptyState from "@/components/shared/emptyState";
import PodcastCard from "@/components/cards/podcastCard";
import ExploreSearchBar from "@/components/forms/exploreSearchBar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';

const Explore = ({
  searchParams: { search },
}: {
  searchParams: { search: string };
}) => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStories() {
      try {
        setIsLoading(true);
        setError(null);

        // Get access token from backend
        const tokenResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_REDDIT_DOMAIN}/api/token`
        );
        const accessToken = tokenResponse.data.access_token;

        // Fetch stories from backend
        const storiesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_REDDIT_DOMAIN}/api/stories`,
          {
            params: { search, accessToken },
          }
        );

        setIsLoading(false);
        setStories(storiesResponse.data);
      } catch (error: any) {
        setIsLoading(false);
        setError(error);
        console.error("Error fetching stories:", error);
      }
    }

    if (search) {
      fetchStories();
    }
  }, [search]);

  const fetchStoryDetails = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get access token from backend
      const tokenResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_REDDIT_DOMAIN}/api/token`
      );
      const accessToken = tokenResponse.data.access_token;

      // Fetch story details from backend
      const storyResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_REDDIT_DOMAIN}/api/story/${id}`,
        {
          params: { accessToken },
        }
      );

      setIsLoading(false);
      setSelectedStory(storyResponse.data.story);
      setComments(storyResponse.data.comments);
    } catch (error: any) {
      setIsLoading(false);
      setError(error);
      console.error("Error fetching story details:", error);
    }
  };

  return (
    <div className={`flex flex-col gap-9 ${search ? "" : "justify-center"}`}>
      <ExploreSearchBar />
      {search ? (
        <div className="flex flex-col gap-9">
          <h1 className="text-20 font-bold text-white-1">
            {!selectedStory &&
              (!search ? "Discover Trending Podcasts" : "Search results for ")}
            {search && !selectedStory && (
              <span className="text-white-2">{search}</span>
            )}
          </h1>

          {isLoading ? (
            <div className="text-orange-1">Fetching stories from reddit...</div>
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : selectedStory ? (
            <div className="text-white-1 flex flex-col gap-5 h-[80vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-start items-center">
                <Button
                  className="bg-orange-1"
                  onClick={() => setSelectedStory(null)}
                >
                  Back
                </Button>
              </div>
              <p className="text-center text-orange-1">
                Click on any paragraph you want Podcraftr to automaticaly
                generate audio!{" "}
                <span className=" text-subtle-medium text-white-2">
                  The scores can help you identify the best ones
                </span>
              </p>
              <Link href={{ pathname: '/from-online-source', query: { title: selectedStory.title, content: selectedStory.selftext} }} className="bg-orange-1">
                <div className="flex justify-between items-center ">
                  <p className="flex items-center gap-2">
                    <Image className="rounded-full bg-orange-1"src={selectedStory.thumbnail != "self"? selectedStory.thumbnail: "/icons/avatar.svg"}alt="Avatar"width={35}height={35}/>{" "}{selectedStory.author}
                  </p>
                  <p className="text-white-2 text-small-medium">
                    {new Date(selectedStory.created_utc * 1000).toLocaleString()}
                  </p>
                </div>
                <h2 className="font-extrabold">{selectedStory.title}</h2>
                <p className="text-white-2 m-0 cursor-pointer">
                  {selectedStory.selftext}
                </p>
              </Link>

              <h3 className="mt-10 text-body-bold">Comments:</h3>
              <div className="">
                <ul className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  {comments.map((comment: any) => (
                    <li key={comment.id}className="bg-[#232327] hover:shadow-2xl text-white-2 p-4 rounded-lg mb-4 cursor-pointer">
                      <p>{comment.body}</p>
                      <p className="text-orange-1 text-small-medium">Score: {comment.score}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : stories.length > 0 ? (
            <div className="h-[78.5vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {stories.map((story: any) => (
                  <div
                    key={story.id}
                    className="bg-[#23232729] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-2xl"
                    onClick={() => fetchStoryDetails(story.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <img
                          className="w-10 h-10 rounded-full mr-4 bg-orange-1"
                          src={
                            story.thumbnail != "self"
                              ? story.thumbnail
                              : "/icons/avatar.svg"
                          }
                          alt="Avatar"
                        />
                        <div className="text-sm flex items-center justify-between w-full">
                          <p className="text-white-1 leading-none">
                            {story.author}
                          </p>
                          <p className="text-white-2">
                            {new Date(
                              story.created_utc * 1000
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-white-1 mb-2">
                        {story.title}
                      </h2>
                      <p className="text-white-2 mb-4">
                        {story.selftext
                          ? `${story.selftext.substring(0, 100)}...`
                          : "Read more..."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>No stories found for this genre.</div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Explore;
