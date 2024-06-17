import React from 'react';
import RightSideBarDetails from './rightSideBarDetails';
import { getRightSideBarData } from './rightSideBarData';
import { useUser } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

const RightSideBar = async () => {
  const {rPodcasts } = await getRightSideBarData();

  return (
    <RightSideBarDetails podcasts={rPodcasts} />
  );
};

export default RightSideBar;
