import React from 'react';
import { getSurveyState, setAge } from '@features/testSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { ChangeEvent } from 'react';
import { TextField } from '@mui/material';
import styles from '@styles/survey.module.scss';

type Props = StateProps & DispatchProps;

const InputAge = ({ age, onSetAge }: Props) => {
	const inputAge = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		if (e.target.value !== '0' && e.target.value.length <= 2)
			onSetAge(e.target.value);
	};

	return (
		<React.Fragment>
			<div className={styles.surveyElement__questionText}>
				나이가 어떻게 되시나요?
			</div>
			<div className={styles.surveyElement__input}>
				<TextField
					onChange={inputAge}
					type={'number'}
					variant={'standard'}
					value={age || NaN.toString()}
					placeholder={'숫자만 입력해주세요!'}
				/>
			</div>
		</React.Fragment>
	);
};

interface StateProps {
	age?: string;
}

const mapStateToProps = (state: RootState) => ({
	age: getSurveyState(state).age,
});

interface DispatchProps {
	onSetAge: (age: string) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onSetAge: (age: string) => dispatch(setAge(age)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InputAge);
