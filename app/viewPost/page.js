"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from "./page.module.css"

const ViewPostContent = () => {
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
    <div className={styles.view_post}>
      <div className={styles.title}>{post.title}</div>
      <div className={styles.description}>{post.description}</div>
      <div className={styles.image}><img src={post.photoUrl}/></div>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

const ViewPost = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewPostContent />
    </Suspense>
  );
}

export default ViewPost;
