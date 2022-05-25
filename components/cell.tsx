import styles from '@styles/grape.module.scss';
import { RefObject } from 'react';

type Props = OwnProps;

const Cell = ({ active, idx, innerRef }: Props) => {
	return (
		<div
			className={styles.grape__cell}
			data-active={active}
			id={idx.toString()}
			ref={innerRef}
		/>
	);
};

interface OwnProps {
	active: boolean;
	idx: number;
	innerRef?: RefObject<HTMLDivElement>;
}

export default Cell;
