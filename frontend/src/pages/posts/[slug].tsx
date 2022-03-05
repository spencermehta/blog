import PostBody from "components/molecules/PostBody/PostBody";
import { getAllPosts, getPostBySlug, Post } from "lib/api";
import markdownToHtml from "lib/markdownToHtml";

interface PostProps {
  post: Post;
}

const Post = ({ post }: PostProps) => {
  return (
    <div style={{ padding: "0 33%" }}>
      {" "}
      <h1>{post.title}</h1> <PostBody content={post.content} />
    </div>
  );
};

export default Post;

interface GetStaticPropsParams {
  params: {
    slug: string;
  };
}

export async function getStaticProps({ params }: GetStaticPropsParams) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
  ]);
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
