"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";

const ViewPost = () => {
  const searchParams = useSearchParams();
  const [post, setPost] = useState(null);
  
  const title = searchParams.get('title'); // Get the title from the URL query parameters

  useEffect(() => {
    if (title) {
      const fetchPost = async () => {
        const q = query(collection(db, "posts"), where("formattedTitle", "==", title));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setPost(querySnapshot.docs[0].data());
        } else {
          console.log("Post not found");
        }
      };
      fetchPost();
    }
  }, [title]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

export default ViewPost;
