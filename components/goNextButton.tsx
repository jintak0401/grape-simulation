import styles from '@styles/Home.module.scss';

interface Props {
	goNext: () => void;
	body?: string | React.ReactNode;
	disabled?: boolean;
	width?: string;
}

const GoNextButton = ({ goNext, body = '다음', disabled, width }: Props) => {
	return (
		<button
			className={styles.goNextButton}
			data-disabled={disabled}
			onClick={goNext}
			disabled={disabled}
			style={{ width }}
		>
			{body}
		</button>
	);
};

export default GoNextButton;
