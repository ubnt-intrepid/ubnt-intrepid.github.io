import type { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { TagIcon } from '../../components/icons'

import { siteTitle, siteDescription } from '../../config'
import { getPosts } from '../../posts'

type Props = {
    tagName: string
    posts: { id: string; title: string }[]
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const tagName = params.tag as string;
    const posts = getPosts()
        .filter(post => post.tags.includes(tagName))
        .map(post => ({ id: post.id, title: post.title }));
    return {
        props: {
            tagName,
            posts,
        } as Props
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const tags = getPosts()
        .map(post => post.tags)
        .reduce((acc, val) => acc.concat(val), []);
    const paths = Array.from(new Set(tags))
        .sort()
        .map(tag => ({ params: { tag }}));
    return {
        paths,
        fallback: false,
    }
}

const TagPage = ({ tagName, posts }: Props) => (
    <Layout>
        <Head>
            <title>{`Tag: ${tagName} - ${siteTitle}`}</title>
        </Head>

        <div className="hero">
            <h1 className="title">
                <span><TagIcon />{` ${tagName}`}</span>
            </h1>
        </div>

        <ul className="container mx-auto px-8 py-6">
            { posts.map(({ id, title }) => {
                return (
                    <li key={id}>
                        <Link href="/[id]" as={`/${id}`}>
                            <a className="no-underline hover:underline text-blue-500">{title}</a>
                        </Link>
                    </li>
                );
            }) }
        </ul>
    </Layout>
);

export default TagPage