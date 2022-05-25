import Image from 'next/image';
import styles from '@styles/Home.module.scss';
import Container from '@components/container';
import GoNextButton from '@components/goNextButton';
import { useRouter } from 'next/router';
import { StepIndicator } from '@components';
import Head from 'next/head';
import { Fragment } from 'react';

const Home = () => {
	const router = useRouter();

	const goNext = async () => {
		await router.push('/test/practice');
	};

	return (
		<Fragment>
			<Head>
				<title>포도알</title>
			</Head>
			<Container>
				<StepIndicator step={0} />
				<h1 className={styles.title}>🍇 포도알을 아시나요?</h1>
				<h3 className={styles.description}>
					포도알은 콘서트 티켓을 구할 때 예매되지 않은 좌석입니다.
				</h3>
				<div className={styles.poster}>
					<Image
						src={'/images/ticketing.gif'}
						alt={'티켓팅 움짤'}
						objectFit={'contain'}
						layout={'fill'}
					/>
				</div>
				<h2 className={styles.title}>
					<br />
					때는 바야흐로 대포도알시대
				</h2>
				<h3 className={styles.description}>
					이 험난한 세상 속 포도알을 구하기 위해서
					<br />
					빠른 터치/클릭은 필수!
					<br />
					<br />
					여러분의 속도를 확인해보세요!
				</h3>
				<GoNextButton goNext={goNext} body={'시작'} />
			</Container>
		</Fragment>
	);
};

export default Home;
