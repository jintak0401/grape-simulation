import { Container, GoNextButton } from '@components';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import Head from 'next/head';

const Redirect = () => {
	const router = useRouter();
	const goNext = async () => {
		await router.replace('/');
	};

	return (
		<Fragment>
			<Head>
				<title>포도알 | 리다이렉션</title>
			</Head>
			<Container>
				<h1 style={{ fontSize: '50px', marginBottom: '0' }}>😣</h1>
				<h1>정상적인 경로로 접근하지 않으셨군요...</h1>
				<GoNextButton goNext={goNext} body={'처음으로 갈게요'} />
			</Container>
		</Fragment>
	);
};

export default Redirect;
