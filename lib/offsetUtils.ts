import { grapeLen } from '@lib/grapeVar';

const getArea = (idx: number, round: number) => {
	const length = grapeLen[round];
	const length_3 = length / 3;
	const r = Math.floor(idx / length),
		c = idx % length;
	return 3 * Math.floor(r / length_3) + Math.floor(c / length_3);
};

export { getArea };
