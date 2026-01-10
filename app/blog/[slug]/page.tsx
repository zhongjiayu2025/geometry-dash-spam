import BlogPostReader from "../../../components/BlogPostReader";
import { BLOG_POSTS } from "../../../data/blogContent";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// SSG: Generate all paths at build time
export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

// SEO: Dynamic Metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | GD Spam Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage],
            type: 'article',
        },
    };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return <BlogPostReader post={post} />;
}