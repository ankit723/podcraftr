// RightSideBar.server.js
import { currentUser } from '@clerk/nextjs/server';
import { fetchPodcastByCategory } from '@/lib/actions/podcast.action';

export const getRightSideBarData = async () => {
  const podcasts = await fetchPodcastByCategory("Horror");
  
  const rPodcasts = podcasts.map((p) => {
    return {
      ...p,
      id: "",
      author: {
        ...p.author,
        _id: ""
      }
    };
  });

  // Ensure the returned data is a plain object
  return { rPodcasts: JSON.parse(JSON.stringify(rPodcasts)) };
};
