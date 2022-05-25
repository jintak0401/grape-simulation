import Container from '@components/container';
import Grape from '@components/grape';
import styles from '@styles/test.module.scss';
import GoNextButton from '@components/goNextButton';
import { Fragment, useEffect, useState } from 'react';
import { CurTestState, getCurTestState, initAll } from '@features/testSlice';
import { connect } from 'react-redux';
import { AppDispatch } from '@app/store';
import { DisplayTestState, StepIndicator } from '@components';
import { useRouter } from 'next/router';
import { handleRefreshAndGoBack } from '@lib/unloadCallback';
import Head from 'next/head';

type Props = StateProps & DispatchProps;

const Practice = ({ curTestState, onInitAll }: Props) => {
	const router = useRouter();
	const { curWrong, curCorrect } = curTestState;
	const [condition1, setCondition1] = useState(false);
	const [condition2, setCondition2] = useState(false);

	const getStyle = (condition: boolean) => {
		return {
			color: condition ? undefined : 'white',
			transition: '0.3s cubic-bezier(0.165, 0.84, 0.44, 1) all',
		};
	};

	const goNext = () => {
		router.push('/test');
	};

	useEffect(() => {
		onInitAll();
	}, []);

	useEffect(() => {
		if ((curWrong > 0 || curCorrect > 0) && !condition1) setCondition1(true);
		else if (curWrong > 0 || curCorrect >= 3) setCondition2(true);
	}, [curCorrect, curWrong]);

	useEffect(() => handleRefreshAndGoBack(router));

	return (
		<Fragment>
			<Head>
				<title>포도알 | 연습</title>
			</Head>
			<Container>
				<StepIndicator step={1} />
				<h2 className={styles.description}>
					연습해볼까요?
					<br />
					<span className={styles.questionText__cell} />
					&nbsp;을 피해&nbsp;&nbsp;
					<span className={styles.questionText__cell} data-active={true} />
					&nbsp;을 골라주세요!
				</h2>
				<DisplayTestState isPractice={true} />
				<Grape isPractice={true} />
				<h3 className={styles.questionText} style={{ marginBottom: 0 }}>
					<span style={getStyle(condition1)}>
						맞으면{' '}
						{condition1 ? (
							<span className={styles.questionText__textBall} />
						) : (
							' '
						)}
						&nbsp;가 늘어나고 틀리면 {condition1 ? '💔' : ' '} 가 늘어나요.
					</span>
					<br />
					<br />
					<span style={getStyle(condition2)}>
						다 고르거나 틀리면 다음 포도알들이 나와요.
					</span>
					<br />
					<br />
					<span style={getStyle(condition2)}>
						테스트는 총 3단계입니다. 갈수록 포도알은 실전에 가까워져요!
					</span>
				</h3>
				<GoNextButton
					goNext={goNext}
					body={'테스트 시작'}
					disabled={!condition2}
				/>
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
	onInitAll: () => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onInitAll: () => dispatch(initAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Practice);
