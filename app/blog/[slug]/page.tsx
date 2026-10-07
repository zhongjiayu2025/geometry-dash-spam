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
            url: `https://geometrydashspam.cc/blog/${post.slug}`,
            type: 'article',
            publishedTime: new Date(post.date).toISOString(),
            modifiedTime: new Date(post.updated ?? post.date).toISOString(),
            authors: ['Geometry Dash Spam Editorial'],
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
        "dateModified": new Date(post.updated ?? post.date).toISOString(),
        "inLanguage": "en",
        "isAccessibleForFree": true,
        "author": {
            "@id": "https://geometrydashspam.cc/#editorial"
        },
        "publisher": {
            "@id": "https://geometrydashspam.cc/#organization"
        },
        "isPartOf": {
            "@id": "https://geometrydashspam.cc/#website"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://geometrydashspam.cc/blog/${post.slug}`
        }
    };

    // Breadcrumb Structured Data
    const faqSchema = post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

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
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <BlogPostReader post={post} />
        </>
    );
}