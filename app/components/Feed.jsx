"use client"
import React from 'react'
import Image from 'next/image';
import Post from './Post';
import "./style/Feed.css"

function Feed() {

  return (
    <div className="feed">
      <Post title={"GDSC event"} description={"Code Conquest Event going to be conducted by google developer students club"}/>
    </div>
  )
}

export default Feed
