import styles from '@styles/grape.module.scss';

type Props = OwnProps;

const Cell = ({ active, onClick, idx }: Props) => {
	return (
		<div
			className={styles.grape__cell}
			data-active={active}
			onClick={() => onClick(idx)}
		/>
	);
};

interface OwnProps {
	active: boolean;
	onClick: (idx: number) => void;
	idx: number;
}

export default Cell;
