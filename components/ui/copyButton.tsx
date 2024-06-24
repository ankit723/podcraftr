'use client'
import React from 'react';

const CopyTextButton = ({ textToCopy }:any) => {
  const copyText = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("User Id Copied, Paste this user Id to connect your Knots account")
    }).catch((err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <button onClick={copyText}><span className="text-orange-1 cursor-pointer">Click To Copy</span></button>
  );
};

export default CopyTextButton;
