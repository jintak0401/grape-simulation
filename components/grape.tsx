import Cell from '@components/cell';
import styles from '@styles/grape.module.scss';
import { generatePos } from '@lib/generatePos';
import { useEffect, useState } from 'react';
import {
	addCorrect,
	addWrong,
	CurTestState,
	defaultTimer,
	getCurTestState,
	goNextRound,
	initAll,
	setTimerTime,
} from '@features/testSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';

type Props = OwnProps & StateProps & DispatchProps;

const Grape = ({
	N,
	curTestState,
	onAddWrong,
	onAddCorrect,
	onSetTimerTime,
	onGoNextRound,
	isPractice,
}: Props) => {
	const { timer, round, curWrong, curCorrect } = curTestState;
	const length = [9, 15, 27][round] ** 2;
	const [pos, setPos] = useState<number[]>([]);
	const [ready, setReady] = useState<boolean>(!isPractice);

	const onClick = (idx: number) => {
		if (ready) return;
		if (pos.includes(idx)) {
			setPos(pos.filter((val) => val !== idx));
			onAddCorrect();
		} else {
			onAddWrong();
		}
	};

	const goStart = () => {
		setReady(false);
		setPos(generatePos(round, isPractice));
	};

	useEffect(() => {
		if (isPractice) {
			setPos(generatePos(round, isPractice));
			return;
		}
		const interval = setInterval(() => {
			if (!ready) {
				onSetTimerTime();
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [ready]);

	// 0초 다 되었을 때
	useEffect(() => {
		console.log(`timer: ${timer} in /grape`);
		if (isPractice) return;
		if (timer === 0) {
			setReady(true);
			onSetTimerTime(defaultTimer);
			onGoNextRound();
			setReady(true);
			setPos([]);
		}
	}, [timer]);

	// 맞았을 때
	useEffect(() => {
		if (!ready && curCorrect > 0 && pos.length === 0) {
			setPos(generatePos(round, isPractice));
		}
	}, [curCorrect]);

	// 틀렸을 때
	useEffect(() => {
		if (!ready && curWrong > 0) {
			setPos(generatePos(round, isPractice));
		}
	}, [curWrong]);

	return (
		<div style={{ position: 'relative' }}>
			{ready && (
				<button className={styles.startButton} onClick={goStart}>
					시작
				</button>
			)}
			<div className={styles.grape} data-round={round} data-ready={ready}>
				{Array.from({ length }, (_, idx) => (
					<Cell
						key={idx}
						active={pos.includes(idx)}
						onClick={onClick}
						idx={idx}
					/>
				))}
			</div>
		</div>
	);
};

interface OwnProps {
	N: number;
	isPractice: boolean;
}

interface StateProps {
	curTestState: CurTestState;
}

const mapStateToProps = (state: RootState): StateProps => ({
	curTestState: getCurTestState(state),
});

interface DispatchProps {
	onAddWrong: () => void;
	onAddCorrect: () => void;
	onSetTimerTime: (time?: number) => void;
	onGoNextRound: (round?: number) => void;
	onInitAll: () => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onAddWrong: () => dispatch(addWrong()),
	onAddCorrect: () => dispatch(addCorrect()),
	onSetTimerTime: (time?: number) => dispatch(setTimerTime(time)),
	onGoNextRound: (round?: number) => dispatch(goNextRound(round)),
	onInitAll: () => dispatch(initAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Grape);
