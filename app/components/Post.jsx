import React from 'react'
import "./style/Post.css";
import {useRouter} from 'next/navigation';
import Link from 'next/link';

function Post({title, description}) {

    const router = useRouter();
    const expandImage = (postId) => {
        router.push(`/viewPost?id=${postId}`);
    }

  return (
    <div className="post" onClick={() => {expandImage(1)}}>
        <div className="author">
            <div classNam="author_name"> Jeevan Alexen </div>
        </div>
        <div className="post_first">
            <div className="post_title">{title}</div>
            <div className="post_description">{description}</div>
        </div>
        <div className="post_image_div"><img className="post_image" src='/images/code_conquest.jpg'/></div>
    </div>
  )
}

export default Post
