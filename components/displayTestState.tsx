import { CurTestState, getCurTestState } from '@features/testSlice';
import { connect } from 'react-redux';
import styles from '@styles/Home.module.scss';

type Props = OwnProps & StateProps;

const DisplayTestState = ({ curTestState, isPractice }: Props) => {
	const { curWrong, curCorrect, timer } = curTestState;

	return (
		<div className={styles.displayTestState}>
			<p className={styles.displayTest__element}>
				<span className={styles.displayTestState__element__grape} />
				{curCorrect}
			</p>
			{isPractice ? (
				<p className={styles.displayTestState__element__time}>제한시간</p>
			) : (
				<p className={styles.displayTestState__element__time}>{timer}초</p>
			)}
			<p className={styles.displayTest__element}>
				{curWrong}
				<span className={styles.displayTestState__element__heart}>💔</span>
			</p>
		</div>
	);
};

interface OwnProps {
	isPractice?: true;
}

interface StateProps {
	curTestState: CurTestState;
}

const mapStateToProps = (state: RootState): StateProps => ({
	curTestState: getCurTestState(state),
});

export default connect(mapStateToProps)(DisplayTestState);
