import Cell from '@components/cell';
import styles from '@styles/grape.module.scss';
import { generatePos } from '@lib/generatePos';
import { createRef, useEffect, useState, MouseEvent, RefObject } from 'react';
import {
	addCorrect,
	addCorrectOffset,
	addWrong,
	addWrongOffset,
	CurTestState,
	defaultTimer,
	getCurTestState,
	goNextRound,
	initAll,
	setTimerTime,
} from '@features/testSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { grapeLen } from '@lib/grapeVar';
import { getArea } from '@lib/offsetUtils';

type Props = OwnProps & StateProps & DispatchProps;

const Grape = ({
	curTestState,
	onAddWrong,
	onAddCorrect,
	onSetTimerTime,
	onGoNextRound,
	isPractice,
	onAddCorrectOffset,
	onAddWrongOffset,
}: Props) => {
	const { timer, round, curWrong, curCorrect } = curTestState;
	const length = grapeLen[round] ** 2;
	const [pos, setPos] = useState<number[]>([]);
	const [ready, setReady] = useState<boolean>(!isPractice);
	const [refs, setRefs] = useState([]);
	const [loading, setLoading] = useState(false);
	let refIdx = 0;

	const onClickGrid = (e: MouseEvent<HTMLDivElement>) => {
		if (ready) return;
		const target = e.target as HTMLDivElement;
		const rect = e.currentTarget.getBoundingClientRect();
		const clickX = e.clientX - rect.left,
			clickY = e.clientY - rect.top;
		if (target && target.dataset.active === 'true') {
			if (!isPractice) {
				const ox = target.offsetLeft + target.offsetWidth / 2,
					oy = target.offsetTop + target.offsetHeight / 2;
				target.dataset.active = String(false);
				setRefs((prev) =>
					prev.filter(
						(ref: RefObject<HTMLDivElement>) => ref.current!.id !== target.id
					)
				);
				const xVec = clickX - ox;
				const yVec = -(clickY - oy);
				onAddCorrectOffset([getArea(+target.id, round), xVec, yVec]);
			}
			onAddCorrect();
			setPos((prev) => prev.filter((val) => val !== +target.id));
		} else {
			if (!isPractice) {
				let xVec = 100000,
					yVec = 100000,
					diff = 200000,
					idx = -1;
				refs.forEach((ref: RefObject<HTMLDivElement>, i) => {
					if (ref.current) {
						const ox = ref.current.offsetLeft + ref.current.offsetWidth / 2;
						const oy = ref.current.offsetTop + ref.current.offsetHeight / 2;
						const xDiffVec = clickX - ox;
						const yDiffVec = -(clickY - oy);
						let curDiff;
						if ((curDiff = Math.abs(xDiffVec) + Math.abs(yDiffVec)) < diff) {
							idx = i;
							diff = curDiff;
							xVec = xDiffVec;
							yVec = yDiffVec;
						}
					}
				});
				if (idx !== -1) {
					onAddWrongOffset([getArea(+target.id, round), xVec, yVec]);
				}
			}
			onAddWrong();
		}
	};

	const goStart = () => {
		setReady(false);
		refIdx = 0;
		setPos(generatePos(round, isPractice));
	};

	useEffect(() => {
		if (isPractice) return;
		setRefs((prev) =>
			Array(pos.length)
				.fill(0)
				.map((_, idx) => prev[idx] || createRef())
		);
	}, [pos]);

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
		if (isPractice) return;
		if (timer === 0) {
			if (round === 2) setLoading(true);
			else setReady(true);
			onSetTimerTime(defaultTimer);
			onGoNextRound();
			refIdx = 0;
			setPos([]);
		}
	}, [timer]);

	// 맞았을 때
	useEffect(() => {
		if (!ready && curCorrect > 0 && pos.length === 0) {
			refIdx = 0;
			setPos(generatePos(round, isPractice));
		}
	}, [curCorrect]);

	// 틀렸을 때
	useEffect(() => {
		if (!ready && curWrong > 0) {
			refIdx = 0;
			setPos(generatePos(round, isPractice));
		}
	}, [curWrong]);

	if (loading) return <h1>잠시만 기다려주세요</h1>;
	return (
		<div style={{ position: 'relative' }}>
			{ready && (
				<button className={styles.startButton} onClick={goStart}>
					시작
				</button>
			)}
			<article
				className={styles.grape}
				data-round={round}
				data-ready={ready}
				onClick={onClickGrid}
			>
				{Array.from({ length }, (_, idx) => {
					const active = pos.includes(idx);
					const ref = active ? refs[refIdx++] : undefined;
					return <Cell key={idx} active={active} idx={idx} innerRef={ref} />;
				})}
			</article>
		</div>
	);
};

interface OwnProps {
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
	onAddWrongOffset: (val: number[]) => void;
	onAddCorrectOffset: (val: number[]) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onAddWrong: () => dispatch(addWrong()),
	onAddCorrect: () => dispatch(addCorrect()),
	onSetTimerTime: (time?: number) => dispatch(setTimerTime(time)),
	onGoNextRound: (round?: number) => dispatch(goNextRound(round)),
	onInitAll: () => dispatch(initAll()),
	onAddWrongOffset: (val: number[]) => dispatch(addWrongOffset(val)),
	onAddCorrectOffset: (val: number[]) => dispatch(addCorrectOffset(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Grape);
