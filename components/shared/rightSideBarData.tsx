// RightSideBar.server.js
import { currentUser } from '@clerk/nextjs/server';
import { fetchPodcastByCategory } from '@/lib/actions/podcast.action';

export const getRightSideBarData = async () => {
  const rPodcasts = await fetchPodcastByCategory("Romance");
  const aPodcasts = await fetchPodcastByCategory("Sci-Fi");
  const dPodcasts = await fetchPodcastByCategory("Mystry");
  const hPodcasts = await fetchPodcastByCategory("Horror");
  const fPodcasts = await fetchPodcastByCategory("Humour");

  const cPodcasts = [
    hPodcasts[0],
    rPodcasts[0],
    aPodcasts[0],
    dPodcasts[0],
    fPodcasts[0],
  ];
  
  const podcasts = cPodcasts.map((p) => {
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
  return { podcasts: JSON.parse(JSON.stringify(podcasts)) };
};