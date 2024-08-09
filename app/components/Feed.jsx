"use client";
import React, { useEffect, useState } from 'react';
import Post from './Post';
import "./style/Feed.css";
import { db } from '@/lib/firebase'; // Import your firebase config
import { collection, getDocs } from "firebase/firestore";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="feed">
      {posts.map((post) => (
        <Post
          key={post.id}
          title={post.title}
          description={post.description}
          content={post.content}
          author_name={post.uploader}
          time= {post.createdAt}
          likes={post.likes}
          dislikes={post.dislikes}
          url = {post.photoUrl}
        />
      ))}
    </div>
  );
}

export default Feed;
