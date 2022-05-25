import React, { ChangeEvent } from 'react';
import { getSurveyState, setHand } from '@features/testSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import styles from '@styles/survey.module.scss';

type Props = StateProps & DispatchProps;

const SelectHand = ({ hand, onSetHand }: Props) => {
	const chooseHand = (e: ChangeEvent<HTMLInputElement>) => {
		onSetHand(e.target.value);
	};

	return (
		<div className={styles.surveyElement}>
			<div className={styles.surveyElement__questionText}>
				어느 손을 주로 쓰시나요?
			</div>
			<div className={styles.surveyElement__input}>
				<RadioGroup
					row
					aria-labelledby="demo-row-radio-buttons-group-label"
					name="row-radio-buttons-group"
					value={hand || ''}
					onChange={chooseHand}
				>
					<FormControlLabel
						value={'l'}
						control={<Radio />}
						label="왼손"
						color="primary"
					/>
					<FormControlLabel
						value={'r'}
						control={<Radio />}
						label="오른손"
						color="primary"
					/>
				</RadioGroup>
			</div>
		</div>
	);
};

interface StateProps {
	hand?: string;
}

const mapStateToProps = (state: RootState) => ({
	hand: getSurveyState(state).hand,
});

interface DispatchProps {
	onSetHand: (hand: string) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onSetHand: (hand: string) => dispatch(setHand(hand)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectHand);
