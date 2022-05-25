import React, { ChangeEvent } from 'react';
import { getSurveyState, setDevice } from '@features/testSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import styles from '@styles/survey.module.scss';

type Props = StateProps & DispatchProps;

const SelectDevice = ({ onSetDevice }: Props) => {
	const chooseDevice = (e: ChangeEvent<HTMLInputElement>) => {
		onSetDevice(e.target.value);
	};

	return (
		<div className={styles.surveyElement}>
			<div className={styles.surveyElement__questionText}>
				어떤 기기에서 테스트를 진행하셨나요?
			</div>
			<div className={styles.surveyElement__input}>
				<RadioGroup
					row
					aria-labelledby="demo-row-radio-buttons-group-label"
					name="row-radio-buttons-group"
					onChange={chooseDevice}
				>
					<FormControlLabel
						value={'p'}
						control={<Radio />}
						label="스마트폰"
						color="primary"
					/>
					<FormControlLabel
						value={'t'}
						control={<Radio />}
						label="태블릿"
						color="primary"
					/>
					<FormControlLabel
						value={'c'}
						control={<Radio />}
						label={'컴퓨터'}
						color="primary"
					/>
				</RadioGroup>
			</div>
		</div>
	);
};

interface StateProps {
	gender?: string;
}

const mapStateToProps = (state: RootState) => ({
	gender: getSurveyState(state).gender,
});

interface DispatchProps {
	onSetDevice: (device: string) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onSetDevice: (device: string) => dispatch(setDevice(device)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectDevice);
