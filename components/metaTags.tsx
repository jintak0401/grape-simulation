import Head from 'next/head';

const MetaTags = () => {
	return (
		<Head>
			<title>포도알 시뮬레이션</title>

			<meta name="description" content="티켓팅 연습을 해보세요!" />
			<link rel="canonical" href="https://dark-vs-light.vercel.app/" />
			<link rel="icon" href="/favicon.ico" />
			<meta name="robots" content="index, follow" />
			<meta
				name="keywords"
				content="포도알, 포도, 시뮬레이션, 티켓팅, 티켓팅 연습"
			/>
			<meta name="author" content="jintak0401" />
			<meta name="content-language" content="kr" />

			{/*og 메타태그*/}
			<meta property="og:type" content="website" />
			<meta property="og:url" content="https://dark-vs-light.vercel.app" />
			<meta property="og:title" content="포도알/티켓팅 시뮬레이션" />
			<meta
				property="og:image"
				content="https://dark-vs-light.vercel.app/thumbnail.png"
			/>
			<meta
				property="og:description"
				content="티켓팅하기 전, 미리 연습해보세요!"
			/>
			<meta property="og:site_name" content="포도알/티켓팅 시뮬레이션" />
			<meta property="og:locale" content="ko_KR" />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />

			{/*트위터 메타태그*/}
			<meta name="twitter:card" content="summary" />
			<meta property="twitter:url" content="https://dark-vs-light.vercel.app" />
			<meta name="twitter:title" content="포도알/티켓팅 시뮬레이션" />
			<meta
				name="twitter:description"
				content="티켓팅하기 전, 미리 연습해보세요!"
			/>
			<meta
				name="twitter:image"
				content="https://dark-vs-light.vercel.app/thumbnail.png"
			/>
		</Head>
	);
};

export default MetaTags;
