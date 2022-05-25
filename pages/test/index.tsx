import {
	addCorrect,
	addWrong,
	CurTestState,
	getCurTestState,
	goNextRound,
	initAll,
} from '@features/testSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import Container from '@components/container';
import { DisplayTestState, Grape, StepIndicator } from '@components';
import styles from '@styles/test.module.scss';
import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

type Props = StateProps & DispatchProps;

const Test = ({ curTestState, onInitAll }: Props) => {
	const router = useRouter();
	const { round } = curTestState;

	const comment = [
		'처음은 가볍게 큰 버튼으로 시작해볼까요?',
		'버튼이 좀 작아졌지만 하실 수 있을거에요!',
		'마지막은 실전처럼! 진짜 포도알 크기로!',
	];

	useEffect(() => {
		onInitAll();
	}, []);

	useEffect(() => {
		if (round === 3) router.replace('/survey');
	}, [round]);

	return (
		<Fragment>
			<Head>
				<title>포도알 | 테스트</title>
			</Head>
			<Container>
				<StepIndicator step={2} />
				<h1 className={styles.description}>{round + 1} 단계</h1>
				<h3 className={styles.questionText}>{comment[round]}</h3>
				<DisplayTestState />
				<Grape N={Math.min(round + 1, 3)} isPractice={false} />
				<div style={{ height: '20vh' }} />
			</Container>
		</Fragment>
	);
};

interface StateProps {
	curTestState: CurTestState;
}

const mapStateToProps = (state: RootState): StateProps => ({
	curTestState: getCurTestState(state),
});

interface DispatchProps {
	onAddWrong: () => void;
	onAddCorrect: () => void;
	onGoNextRound: (round?: number) => void;
	onInitAll: () => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onAddWrong: () => dispatch(addWrong()),
	onAddCorrect: () => dispatch(addCorrect()),
	onGoNextRound: (round?: number) => dispatch(goNextRound(round)),
	onInitAll: () => dispatch(initAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Test);
