import type { Metadata, ResolvingMetadata } from 'next';
import BlogPostClient from './BlogPostClient';

type Props = {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const res = await fetch(`http://localhost:5000/blog/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Not found');
    const post = await res.json();
    
    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.content.substring(0, 150),
      openGraph: {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.content.substring(0, 150),
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found - WeatherWeb'
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
