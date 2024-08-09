"use client";
import React from 'react'
import { useSearchParams } from 'next/navigation';

function page() {
    const searchParams = useSearchParams();
    const imageUrl = searchParams.get("url");
  return (
    <div>
      <img src={imageUrl} />
    </div>
  )
}

export default page
