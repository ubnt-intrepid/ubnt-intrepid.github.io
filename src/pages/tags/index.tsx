import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { TagIcon } from '../../components/icons'

import { siteTitle } from '../../constants'
import { getPosts } from '../../api'
import collectCounts from '../../collectCounts'

type Props = {
    tags: {
        name: string
        count: number
    }[]
}

export const getStaticProps: GetStaticProps = async () => {
    const posts = await getPosts()
    const tags = collectCounts(
        posts
            .reduce((acc, post) => acc.concat(post.tags), [])
    );
    return {
        props: { tags } as Props
    };
}

const TagsPage = ({ tags }: Props) => (
    <Layout>
        <Head>
            <title>{`Tags - ${siteTitle}`}</title>
        </Head>

        <div className="hero">
            <h1 className="title">Tags</h1>
        </div>

        <ul className="container mx-auto px-8 py-6">
            { tags.map(({ name, count }) => (
                <li key={name}>
                    <Link href={`/tags/${name}`}>
                        <a className="no-underline hover:underline text-blue-500">
                            <TagIcon />
                            <span>{` ${name} (${count})`}</span>
                        </a>
                    </Link>
                </li>
            )) }
        </ul>
    </Layout>
);

export default TagsPage
