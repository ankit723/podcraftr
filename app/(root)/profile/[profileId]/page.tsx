import PodcastCard from "@/components/cards/podcastCard";
import ProfileCard from "@/components/cards/profileCard";
import { fetchUser, fetchUserPodacast } from "@/lib/actions/user.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


const ProfilePage = async({params}: {params: {profileId: string};}) => {
  if(!params.profileId)redirect('/sign-in')
  const user = await fetchUser(params.profileId);
  const podcastsData = await fetchUserPodacast(params.profileId);
  const cUser= await currentUser()
  if(!cUser)redirect('/sign-in')
  const userInfo=await fetchUser(cUser?.id)
  if(!userInfo) redirect('/onboarding')
  

  if (!user || !podcastsData) return "";

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podcaster Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastsData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>

          {cUser?.id===params.profileId?<Link href='/create-podcast'><Button className="text-white-1 font-extrabold bg-orange-1">Create Podcast +</Button></Link>:""}
        </div>
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