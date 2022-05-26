import styles from '@styles/Home.module.scss';
import { ForwardedRef, forwardRef, RefObject } from 'react';

interface Props {
	goNext: () => void;
	body?: string | React.ReactNode;
	disabled?: boolean;
	width?: string;
	innerRef?: RefObject<HTMLButtonElement>;
}

const GoNextButton = ({
	goNext,
	body = '다음',
	disabled,
	width,
	innerRef,
}: Props) => {
	return (
		<button
			className={styles.goNextButton}
			data-disabled={disabled}
			onClick={goNext}
			disabled={disabled}
			style={{ width }}
			ref={innerRef}
		>
			{body}
		</button>
	);
};

export default GoNextButton;
