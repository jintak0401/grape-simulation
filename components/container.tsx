import React from 'react';
import styles from 'styles/Home.module.scss';

type Props = OwnProps;

const Container = ({ children }: Props) => {
	return (
		<div className={styles.container}>
			<div className={styles.innerContainer}>{children}</div>
		</div>
	);
};

interface OwnProps {
	children: React.ReactNode;
}

export default Container;
