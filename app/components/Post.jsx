import React from 'react';
import "./style/Post.css";
import { useRouter } from 'next/navigation';

function Post({author_name, title, description, content, url, likes, dislikes, time}) {

  const router = useRouter();

  const formatTitleForUrl = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') .replace(/^-+|-+$/g, ''); 
  }

  const expandPost = () => {
    const formattedTitle = formatTitleForUrl(title);
    router.push(`/viewPost?title=${formattedTitle}`);
  }

  return (
    <div className="post" onClick={expandPost}>
      <div className="details">
        <div className="author_name"> Posted by {author_name} </div>
        <div className="likes">{likes}</div>
        <div className="upload_date">Upload Date: {time.toDate().getDate()} / {time.toDate().getMonth() + 1} / {time.toDate().getFullYear()}</div>

      </div>
      <div className="main_post">
        <div className="post_first">
          <div className="post_title">{title}</div>
          <div className="post_description">{description}</div>
          <div 
            className="post_content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className="read_more">Read More</div>
        </div>
        {url && (
          <div className="post_image_div">
            <img className="post_image" src={url} alt={title} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
