import styles from '@styles/result.module.scss';
import { circleNum } from '@lib/specialCharacter';

type Props = OwnProps;
const ResultGrid = ({ strongIdx, weakIdx }: Props) => {
	return (
		<article className={styles.grid}>
			{Array(9)
				.fill(0)
				.map((_, idx) => {
					let status = '';
					switch (idx) {
						case strongIdx:
							status = 'strong';
							break;
						case weakIdx:
							status = 'weak';
							break;
						default:
							status = 'normal';
					}
					return (
						<div key={idx} className={styles.grid__text} data-status={status}>
							{circleNum[idx]}
						</div>
					);
				})}
		</article>
	);
};

interface OwnProps {
	strongIdx: number;
	weakIdx: number;
}

export default ResultGrid;
