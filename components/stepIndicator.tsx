import styles from '@styles/Home.module.scss';
import { CurTestState, getCurTestState } from '@features/testSlice';
import { connect } from 'react-redux';
import { useRef } from 'react';

type Props = OwnProps & StateProps;

const StepIndicator = ({ step, curTestState }: Props) => {
	const totalStep = 4;
	const getClassName = (idx: number) => {
		if (step === idx) return styles.stepIndicator__element__active;
		else return styles.stepIndicator__element;
	};
	const { round } = curTestState;
	const ref = useRef<HTMLDivElement | null>();

	const TestIndicator = (key: number) => {
		let width = undefined;
		if (ref.current) {
			if (round === 2) width = ref.current.offsetWidth;
			else {
				width = ref.current.offsetWidth * Math.min((round + 1) / 3, 1);
			}
		}
		return (
			<div
				key={key}
				className={styles.stepIndicator__element}
				ref={(r) => (ref.current = r)}
			>
				<div
					className={styles.stepIndicator__element__active}
					style={{ width }}
				/>
			</div>
		);
	};

	return (
		<div className={styles.stepIndicator}>
			{Array.from({ length: totalStep }, (_, idx: number) => {
				if (idx === step && step === 2) return TestIndicator(idx);
				return <div className={getClassName(idx)} key={idx} />;
			})}
		</div>
	);
};

interface OwnProps {
	step: number;
}

interface StateProps {
	curTestState: CurTestState;
}

const mapStateToProps = (state: RootState) => ({
	curTestState: getCurTestState(state),
});

export default connect(mapStateToProps)(StepIndicator);
