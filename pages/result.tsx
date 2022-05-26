import {
	checkBound,
	getRecordRequestData,
	getTestResultState,
	RecordRequestData,
	requestRecord,
	TestResultState,
} from '@features/testSlice';
import { connect } from 'react-redux';
import { Container, ResultGrid } from '@components';
import { Fragment, useEffect, useState } from 'react';
import styles from '@styles/result.module.scss';
import { circleNum } from '@lib/specialCharacter';
import { useRouter } from 'next/router';
import { handleRefreshAndGoBack } from '@lib/unloadCallback';
import { useAppDispatch } from '@app/hooks';
import Head from 'next/head';

type Props = StateProps;

const Result = ({ testResultState, recordRequestData }: Props) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { correctArea, wrongArea, totalCorrect, totalWrong, recordDone } =
		testResultState;
	const [strong, setStrong] = useState(1);
	const [weak, setWeak] = useState(8);
	const [needRequest, setNeedRequest] = useState<boolean>(false);

	useEffect(() => {
		if (
			totalCorrect.filter((correct) => correct >= checkBound).length !==
			totalCorrect.length
		) {
			router.replace('/redirect');
		} else {
			const sortedWeak = [...wrongArea].sort((a, b) => a - b);
			const sortedStrong = [...correctArea].sort((a, b) => b - a);
			let weakIdx, strongIdx;
			if (sortedWeak[0] === 0) {
				weakIdx = correctArea.indexOf(sortedStrong.at(-1) as number);
			} else {
				weakIdx = wrongArea.indexOf(sortedWeak[0]);
			}
			strongIdx = correctArea.indexOf(sortedStrong[0]);
			if (strongIdx === weakIdx)
				strongIdx = correctArea.indexOf(sortedStrong[1]);
			setStrong(strongIdx);
			setWeak(weakIdx);
			setNeedRequest(true);
		}
	}, []);

	useEffect(() => {
		if (!recordDone && needRequest) {
			dispatch(requestRecord(recordRequestData));
		}
	}, [recordDone, needRequest]);

	useEffect(() => handleRefreshAndGoBack(router));

	return (
		<Fragment>
			<Head>
				<title>포도알 | 결과</title>
			</Head>
			<Container>
				{needRequest && (
					<Fragment>
						<h1 className={styles.emoji}>🧐</h1>
						<h1>결과는</h1>
						<h3 className={styles.description}>
							1단계에서는 <span className={styles.description__purpleBall} />
							&nbsp;{totalCorrect[0]} &nbsp;💔&nbsp;{totalWrong[0]} <br />
							<br />
							2단계에서는 <span className={styles.description__purpleBall} />
							&nbsp;{totalCorrect[1]} &nbsp;💔&nbsp;{totalWrong[1]} <br />
							<br />
							3단계에서는 <span className={styles.description__purpleBall} />
							&nbsp;{totalCorrect[2]} &nbsp;💔&nbsp;{totalWrong[2]} <br />
							<br />를 기록하셨습니다!
						</h3>
						<ResultGrid strongIdx={strong} weakIdx={weak} />
						<h3 className={styles.description}>
							전반적으로 <br />
							<br />
							<span
								className={styles.description__circleNum}
								data-color={'blue'}
							>
								{circleNum[strong]}
							</span>
							&nbsp; 위치의 버튼을 누를 때 정확하고 빠르며 <br />
							<br />
							<span
								className={styles.description__circleNum}
								data-color={'red'}
							>
								{circleNum[weak]}
							</span>
							&nbsp; 위치의 버튼은 조금 부정확하고 느립니다.
							<br />
							<br />
							<br />
							티켓팅을 하시게 된다면 &nbsp;
							<span
								className={styles.description__circleNum}
								data-color={'blue'}
							>
								{circleNum[strong]}
							</span>
							&nbsp; 위치의 자리를 잡아보세요!
						</h3>
					</Fragment>
				)}
			</Container>
		</Fragment>
	);
};

interface StateProps {
	testResultState: TestResultState;
	recordRequestData: RecordRequestData;
}

const mapStateToProps = (state: RootState): StateProps => ({
	testResultState: getTestResultState(state),
	recordRequestData: getRecordRequestData(state),
});

export default connect(mapStateToProps)(Result);
