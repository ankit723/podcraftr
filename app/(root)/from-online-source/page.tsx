import { useRouter } from 'next/router';
import CreatePodcastFromOnlineSource from '@/components/forms/create-podcast-from-online-source';

const GetSourceFromOnline = ({params, searchParams}:any) => {

  return (
    <CreatePodcastFromOnlineSource title={searchParams.title} content={searchParams.content} />
  );
};

export default GetSourceFromOnline;
