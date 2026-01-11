
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
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: post.title, // Template in layout handles the suffix
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: new Date(post.date).toISOString(),
            authors: ['Geometry Dash Spam Team'],
            tags: post.tags,
            images: [
                {
                    url: post.coverImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage],
        },
        alternates: {
            canonical: `/blog/${post.slug}`,
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    // Article Structured Data
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.coverImage,
        "datePublished": new Date(post.date).toISOString(),
        "dateModified": new Date(post.date).toISOString(), // Should be updated if edited
        "author": {
            "@type": "Organization",
            "name": "Geometry Dash Spam Team",
            "url": "https://geometrydashspam.cc"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Geometry Dash Spam",
            "logo": {
                "@type": "ImageObject",
                "url": "https://geometrydashspam.cc/logo.svg"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://geometrydashspam.cc/blog/${post.slug}`
        }
    };

    // Breadcrumb Structured Data
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://geometrydashspam.cc"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://geometrydashspam.cc/blog"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://geometrydashspam.cc/blog/${post.slug}`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <BlogPostReader post={post} />
        </>
    );
}
