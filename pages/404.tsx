import { useRouter } from 'next/router';
import { Container } from '@mui/material';
import { Fragment, useEffect } from 'react';
import Head from 'next/head';

const _404 = () => {
	const router = useRouter();
	useEffect(() => {
		router.replace('/redirect');
	}, []);
	return (
		<Fragment>
			<Head>
				<title>포도알 | 404</title>
			</Head>
			<Container />
		</Fragment>
	);
};

export default _404;
