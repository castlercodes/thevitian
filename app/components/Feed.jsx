// /app/feed/page.js
import React from 'react';
import Post from '@/app/components/Post'; // Adjust import as needed
import './style/Feed.css'; // Ensure the correct path to your CSS

export const dynamic = 'force-dynamic'; // Enable dynamic rendering

async function fetchPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`);
    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  } 
}

export default async function Feed() {
  const posts = await fetchPosts();

  return (
    <div className="feed">
      {posts.map((post) => (
        <Post
          key={post.id}
          title={post.title}
          description={post.description}
          content={post.content}
          author_name={post.uploader}
          time={post.createdAt}
          likes={post.likes}
          dislikes={post.dislikes}
          url={post.photoUrl}
        />
      ))}
    </div>
  );
}
