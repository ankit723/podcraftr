import React from 'react';
import RightSideBarDetails from './rightSideBarDetails';
import { getRightSideBarData } from './rightSideBarData';
import { useUser } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { fetchUser, fetchUsers } from '@/lib/actions/user.action';

const RightSideBar = async () => {
  const {podcasts } = await getRightSideBarData();
  const users=await fetchUsers()
  const cUser=await currentUser()
  const user=await fetchUser(cUser?.id||"")

  return (
    <RightSideBarDetails podcasts={podcasts} users={users} currentUser={user}/>
  );
};

export default RightSideBar;
