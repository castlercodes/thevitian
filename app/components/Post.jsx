import React from 'react'
import "./style/Post.css";
import {useRouter} from 'next/navigation';
import Link from 'next/link';

function Post({author_name, title, description, content}) {

    const router = useRouter();
    const expandImage = (postId) => {
        router.push(`/viewPost?id=${postId}`);
    }

  return (
    <div className="post" onClick={() => {expandImage(1)}}>
        <div className="details">
            <div className="author_name"> Posted by {author_name} </div>
        </div>
        <div className="main_post">
            <div className="post_first">
                <div className="post_title">{title}</div>
                <div className="post_description">{description}</div>
                <div className="post_content">{content}</div>
                <div className="read_more">Read More</div>
            </div>
            <div className="post_image_div"><img className="post_image" src='/images/code_conquest.jpg'/></div>
        </div>
    </div>
  )
}

export default Post
