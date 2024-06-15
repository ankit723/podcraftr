import AccountProfile from "@/components/forms/accountProfile";
import { currentUser } from "@clerk/nextjs/server";
// import { fetchUser } from "@/lib/actions/user.action";
import {redirect} from 'next/navigation'
import Link from "next/link";

async function Page(){
    const user =await currentUser()

    const userInfo = null
    
    if(userInfo) redirect('/')

    const userData={
        id:user?.id,
        objectId:(userInfo?._id) || "",
        name:userInfo?.name || user?.fullName || "",
        bio:userInfo?.bio || "",
        image:userInfo?.image || user?.imageUrl,
    }

    return(
        <main className="flex flex-col glassmorphism-auth h-full justify-start px-10 lg:px-[30%] py-20">
            <h1 className=" head-text">Edit Profile</h1>
            <p className="mt-3 text-base-regular text-light-2">Edit your Profile According To Your needs</p>

            <section className="mt-9 bg-black-2 px-5 lg:px-10 py-10">
                <AccountProfile user={userData} btnTitle={"Save & Continue"}/>
                <div className="w-full flex justify-center items-center my-10">
                    <Link href={'/'} className='text-heading5-bold text-[#7f7f7f] px-5 py-2 rounded-lg'>
                        Exit without saving
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default Page;