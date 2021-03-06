import Image from 'next/image';
import styles from '@styles/Home.module.scss';
import Container from '@components/container';
import GoNextButton from '@components/goNextButton';
import { useRouter } from 'next/router';
import { StepIndicator } from '@components';
import Head from 'next/head';
import { Fragment, useEffect } from 'react';
import { AppDispatch } from '@app/store';
import { initAll } from '@features/testSlice';
import { connect } from 'react-redux';

type Props = DispatchProps;

const Home = ({ onInitAll }: Props) => {
	const router = useRouter();

	const goNext = async () => {
		await router.push('/test/practice');
	};

	useEffect(() => {
		onInitAll();
	}, []);

	return (
		<Fragment>
			<Head>
				<title>ν¬λμ</title>
			</Head>
			<Container>
				<StepIndicator step={0} />
				<h1 className={styles.title}>π ν¬λμμ μμλμ?</h1>
				<h3 className={styles.description}>
					ν¬λμμ μ½μνΈ ν°μΌμ κ΅¬ν  λ μλ§€λμ§ μμ μ’μμλλ€.
				</h3>
				<div className={styles.poster}>
					<Image
						src={'/images/ticketing.gif'}
						alt={'ν°μΌν μμ§€'}
						objectFit={'contain'}
						layout={'fill'}
					/>
				</div>
				<h2 className={styles.title}>
					<br />
					λλ λ°μΌνλ‘ λν¬λμμλ
				</h2>
				<h3 className={styles.description}>
					μ΄ νλν μΈμ μ ν¬λμμ κ΅¬νκΈ° μν΄μ
					<br />
					λΉ λ₯Έ ν°μΉ/ν΄λ¦­μ νμ!
					<br />
					<br />
					μ¬λ¬λΆμ μλλ₯Ό νμΈν΄λ³΄μΈμ!
				</h3>
				<GoNextButton goNext={goNext} body={'μμ'} />
			</Container>
		</Fragment>
	);
};

interface DispatchProps {
	onInitAll: () => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onInitAll: () => dispatch(initAll()),
});

export default connect(null, mapDispatchToProps)(Home);
