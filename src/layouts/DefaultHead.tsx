import Head from "next/head"



export const DefaultHead = () => {
    return (
        <Head>
            <title>SOL Trek</title>
            <meta name="description" content="Learn and develop with Solana, visually." />
            <meta name="image" content="https://soltrek.spaceoperator.com/og.png" />
            <meta property="og:title" content={"SOL Trek"} />
            <meta property="og:description" content={"Learn and develop with Solana, visually."} />
            <meta property="og:image" content="https://soltrek.spaceoperator.com/og.png" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://soltrek.spaceoperator.com/og.png" />
            <meta property="og:site_name" content={"SOL Trek"} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={"SOL Trek"} />
            <meta name="twitter:description" content={"Learn and develop with Solana, visually"} />
            <meta name="twitter:image" content="https://soltrek.spaceoperator.com/og.png" />
            <meta name="twitter:image:alt" content={"Learn and develop with Solana, visually"} />
            <meta name="twitter:site" content={"SOLTrek_io"} />
            <meta name="twitter:creator" content={"SOLTrek_io"} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}
