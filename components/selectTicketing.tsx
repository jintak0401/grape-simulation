import React, { ChangeEvent } from 'react';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import styles from '@styles/survey.module.scss';
import { setTicketing } from '@features/testSlice';

type Props = DispatchProps;

const SelectTicketing = ({ onSetTicketing }: Props) => {
	const phrases = [
		'해본적 없어요',
		'1 ~ 3 번',
		'4 ~ 6 번',
		'7 ~ 9 번',
		'10 번 이상',
	];

	const chooseTicketing = (e: ChangeEvent<HTMLInputElement>) => {
		onSetTicketing(e.target.value);
	};

	return (
		<div className={styles.surveyElement} style={{ marginBottom: 0 }}>
			<div className={styles.surveyElement__questionText}>
				티켓팅에 몇 번 정도 도전해보셨나요?
			</div>
			<div className={styles.surveyElement__input}>
				<RadioGroup
					aria-labelledby="demo-controlled-radio-buttons-group-label"
					name="controlled-radio-buttons-group"
					onChange={chooseTicketing}
				>
					{phrases.map((e: string, idx: number) => {
						return (
							<FormControlLabel
								key={idx}
								value={idx}
								control={<Radio />}
								label={e}
								color="primary"
							/>
						);
					})}
				</RadioGroup>
			</div>
		</div>
	);
};

interface DispatchProps {
	onSetTicketing: (ticketing: string) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onSetTicketing: (ticketing: string) => dispatch(setTicketing(ticketing)),
});

export default connect(null, mapDispatchToProps)(SelectTicketing);
