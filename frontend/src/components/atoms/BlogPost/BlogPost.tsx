import { Post } from "lib/api";

interface BlogPostProps {
  post: Post;
}

export const BlogPost = ({ post }: BlogPostProps): JSX.Element => {
  return (
    <>
      <a href={`/posts/${post.slug}`}>
        <h3>{post.title}</h3>
      </a>
      <p>{post.excerpt}</p>
    </>
  );
};
