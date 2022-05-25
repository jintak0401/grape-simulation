import React, { ChangeEvent } from 'react';
import { getSurveyState, setGame } from '@features/testSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import styles from '@styles/survey.module.scss';

type Props = StateProps & DispatchProps;

const SelectGame = ({ onSetGame }: Props) => {
	const chooseGame = (e: ChangeEvent<HTMLInputElement>) => {
		onSetGame(e.target.value);
	};

	const phrases = [
		'거의 안해요',
		'즐겨하지만 잘하지는 못해요',
		'어느정도 합니다',
		'잘하는 편이에요',
	];

	return (
		<div className={styles.surveyElement}>
			<div className={styles.surveyElement__questionText}>
				평소에 배틀그라운드나 서든어택 등 총 게임을 즐겨하시며 잘하시나요?
			</div>
			<div className={styles.surveyElement__input}>
				<RadioGroup
					aria-labelledby="demo-row-radio-buttons-group-label"
					name="row-radio-buttons-group"
					onChange={chooseGame}
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

interface StateProps {
	game?: string;
}

const mapStateToProps = (state: RootState) => ({
	game: getSurveyState(state).game,
});

interface DispatchProps {
	onSetGame: (game: string) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onSetGame: (game: string) => dispatch(setGame(game)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectGame);
