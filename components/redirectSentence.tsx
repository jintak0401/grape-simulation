import React from 'react';
import styles from '@styles/result.module.scss';

const RedirectSentence = () => {
	return (
		<React.Fragment>
			<h1 className={styles.emoji}>😡</h1>
			<h1>성의 없게 테스트를 보셨군요!</h1>
			<p className={styles.description}>
				이런 결과로는 모드를 추천해드릴 수 없어요!
				<br />
				처음부터 제대로 봐주세요!
			</p>
		</React.Fragment>
	);
};

export default RedirectSentence;
