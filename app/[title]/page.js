// /app/view-post/page.js
import React from 'react';
import { notFound } from 'next/navigation';
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

async function fetchPostData(title) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${title}`);
  if (!res.ok) {
    console.log(res);
    return null;
  }

  const postData = await res.json();
  return postData;
}

const ViewPostContent = async ({ title }) => {
  const post = await fetchPostData(title);
  if (!post) {
    notFound();
    return;
  }

  return (
    <div className={styles.view_post}>
      <div className={styles.title}>{post.title}</div>
      <div className={styles.description}>{post.description}</div>
      <div className={styles.image}><img src={post.photoUrl} alt={post.title} /></div>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

export default function Page({ params }) {

    const { title } = params;

  if (!title) {
    notFound();
    return;
  }

  return (
    <ViewPostContent title={title} />
  );
}
