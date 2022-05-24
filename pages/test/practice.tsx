import Container from '@components/container';
import Grape from '@components/grape';
import styles from '@styles/test.module.scss';
import GoNextButton from '@components/goNextButton';
import { useEffect, useState } from 'react';
import {
	addCorrect,
	addWrong,
	CurTestState,
	getCurTestState,
	initAll,
} from '@features/testSlice';
import { connect } from 'react-redux';
import { AppDispatch } from '@app/store';
import { DisplayTestState } from '@components';
import { useRouter } from 'next/router';

type Props = StateProps & DispatchProps;

const Practice = ({
	curTestState,
	onAddWrong,
	onAddCorrect,
	onInitAll,
}: Props) => {
	const router = useRouter();
	const [disabled, setDisabled] = useState<boolean>(true);
	const { step, curWrong, curCorrect } = curTestState;
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
		if (curWrong > 0 || curCorrect > 0) setCondition1(true);
		if (curWrong > 0 || curCorrect >= 3) setCondition2(true);
	}, [curCorrect, curWrong]);

	return (
		<Container>
			<h1>연습을 해봅시다</h1>
			<h3 className={styles.description}>
				<span className={styles.description__cell} />
				&nbsp;을 피해&nbsp;&nbsp;
				<span className={styles.description__cell} data-active={true} />
				&nbsp;을 골라주세요!
			</h3>
			<DisplayTestState isPractice={true} />
			<Grape N={1} isPractice={true} />
			<h3 className={styles.description}>
				<span style={getStyle(condition1)}>
					맞으면{' '}
					{condition1 ? <span className={styles.description__textBall} /> : ' '}
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
	onInitAll: () => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onAddWrong: () => dispatch(addWrong()),
	onAddCorrect: () => dispatch(addCorrect()),
	onInitAll: () => dispatch(initAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Practice);
