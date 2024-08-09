"use client"
import React from 'react'
import './style/CreatePostButton.css'
import { IoIosCreate } from "react-icons/io";
import { useRouter } from 'next/navigation';

function CreatePostButton() {
    const router = useRouter();
    const handleClick = () => {
        router.push("/createPost");
    }

  return (
    <div className="create_post_button" onClick={handleClick}>
      <div> Create a post </div>
      <div> <IoIosCreate /> </div>
    </div>
  )
}

export default CreatePostButton
