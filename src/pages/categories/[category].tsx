import type { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { CategoryIcon } from '../../components/icons'

import { siteTitle, siteDescription } from '../../constants'
import { getPosts } from '../../api'

type Props = {
    categoryName: string
    posts: {
        slug: string
        title: string
    }[]
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const categoryName = params.category as string;
    const posts = await getPosts()

    return {
        props: {
            categoryName,
            posts: posts.filter(post => post.categories.includes(categoryName))
                .map(({ slug, title }) => ({ slug, title })),
        } as Props
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getPosts()
    const categories = posts
        .map(post => post.categories)
        .reduce((acc, val) => acc.concat(val), []);
    const paths = Array.from(new Set(categories))
        .sort()
        .map(category => ({ params: { category }}));
    return {
        paths,
        fallback: false,
    }
}

const CategoryPage = ({ categoryName, posts }: Props) => (
    <Layout>
        <Head>
            <title>{`Category: ${categoryName} - ${siteTitle}`}</title>
        </Head>

        <div className="hero">
            <h1 className="title">
                <span><CategoryIcon />{` ${categoryName}`}</span>
            </h1>
        </div>

        <ul className="container mx-auto px-8 py-6">
            { posts.map(({ slug, title }) => {
                return (
                    <li key={slug}>
                        <Link href="/[slug]" as={`/${slug}`}>
                            <a className="no-underline hover:underline text-blue-500">{title}</a>
                        </Link>
                    </li>
                );
            }) }
        </ul>
    </Layout>
);

export default CategoryPage
