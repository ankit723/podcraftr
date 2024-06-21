
import PodcastCard from "@/components/cards/podcastCard";
// import ProfileCard from "@/components/cards/profileCard";
import { fetchUser, fetchUserPodacast } from "@/lib/actions/user.action";


const ProfilePage = async({params}: {params: {profileId: string};}) => {
  const user = await fetchUser(params.profileId);
  const podcastsData = await fetchUserPodacast(params.profileId);
  console.log(podcastsData)

  if (!user || !podcastsData) return "";

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podcaster Profile
      </h1>
      {/* <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastsData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div> */}
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {podcastsData && podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData?.podcasts
              ?.slice(0, 4)
              .map((podcast:any) => (
                <PodcastCard
                  key={podcast._id}
                  imgUrl={podcast.imageUrl!}
                  title={podcast.podcastTitle!}
                  description={podcast.podcastDescription}
                  podcastId={podcast.id}
                />
              ))}
          </div>
        ) : ""}
      </section>
    </section>
  );
};

export default ProfilePage;