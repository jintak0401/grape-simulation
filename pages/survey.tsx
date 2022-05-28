import { Container, RedirectSentence } from '@components';
import {
	GoNextButton,
	InputAge,
	SelectDevice,
	SelectGame,
	SelectGender,
	SelectHand,
	SelectTicketing,
	StepIndicator,
} from '@components';
import styles from '@styles/survey.module.scss';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { handleRefreshAndGoBack } from '@lib/unloadCallback';
import {
	checkBound,
	getRecordRequestData,
	getSurveyState,
	getTestResultState,
	initRoundTime,
	RecordRequestData,
	requestRecord,
	SurveyState,
	TestResultState,
} from '@features/testSlice';
import { connect } from 'react-redux';
import { AppDispatch } from '@app/store';
import { useAppDispatch } from '@app/hooks';

type Props = StateProps & DispatchProps;

const Survey = ({
	surveyState,
	recordRequestData,
	testResultState,
	onInitRoundTime,
}: Props) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [needRedirect, setNeedRedirect] = useState<boolean | undefined>();
	const { hand, age, gender, device, game, ticketing } = surveyState;

	const { totalCorrect } = testResultState;

	const theme = createTheme({
		palette: {
			primary: {
				main: '#592FD1',
			},
		},
	});

	const isDisabled = () => {
		return (
			hand === '' &&
			age === '' &&
			gender === '' &&
			device === '' &&
			game === '' &&
			ticketing === ''
		);
	};

	const goNext = () => {
		if (isDisabled()) return;
		router.replace('/result');
		dispatch(requestRecord(recordRequestData));
	};

	useEffect(() => {
		onInitRoundTime();
		if (
			totalCorrect.filter((correct) => correct >= checkBound).length !==
			totalCorrect.length
		) {
			setNeedRedirect(true);
		} else {
			setNeedRedirect(false);
		}
	}, []);

	useEffect(() => handleRefreshAndGoBack(router));

	return (
		<Fragment>
			<Head>
				<title>포도알 | 설문</title>
			</Head>
			{needRedirect === false ? (
				<ThemeProvider theme={theme}>
					<Container>
						<StepIndicator step={3} />
						<h1 className={styles.emoji}>🥳</h1>
						<h1 className={styles.title}>마지막 단계에요!</h1>
						<p className={styles.description}>
							정확한 결과를 위해
							<br />
							아래 질문에 답해주세요
						</p>
						<div className={styles.surveyContainer}>
							<SelectDevice />
							<SelectGender />
							<InputAge />
							<SelectHand />
							<SelectGame />
							<SelectTicketing />
						</div>
						<GoNextButton goNext={goNext} disabled={isDisabled()} />
					</Container>
				</ThemeProvider>
			) : needRedirect === true ? (
				<Container>
					<RedirectSentence />
					<GoNextButton
						goNext={() => router.replace('/')}
						body={'제대로 할게요'}
					/>
				</Container>
			) : null}
		</Fragment>
	);
};

interface StateProps {
	testResultState: TestResultState;
	surveyState: SurveyState;
	recordRequestData: RecordRequestData;
}

const mapStateToProps = (state: RootState): StateProps => ({
	testResultState: getTestResultState(state),
	surveyState: getSurveyState(state),
	recordRequestData: getRecordRequestData(state),
});

interface DispatchProps {
	onInitRoundTime: () => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onInitRoundTime: () => dispatch(initRoundTime()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
