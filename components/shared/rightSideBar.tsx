import React from 'react';
import RightSideBarDetails from './rightSideBarDetails';
import { getRightSideBarData } from './rightSideBarData';
import { useUser } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { fetchUsers } from '@/lib/actions/user.action';

const RightSideBar = async () => {
  const {podcasts } = await getRightSideBarData();
  const users=await fetchUsers()

  return (
    <RightSideBarDetails podcasts={podcasts} users={users}/>
  );
};

export default RightSideBar;
