import { grapeLen } from '@lib/grapeVar';

const getRandomInt = (min = 0, max = 100) => {
	return Math.floor(Math.random() * (max - min)) + min;
};

const getDiff = (a: number, b: number, len: number) => {
	return (
		Math.abs(Math.floor(a / len) - Math.floor(b / len)) +
		Math.abs((a % len) - (b % len))
	);
};

const generatePos = (round = 0, isPractice?: boolean): number[] => {
	const unit = isPractice ? 3 : getRandomInt(2, 5);
	const ret: number[] = [];
	const len = grapeLen[round];
	const bound = Math.floor(grapeLen[round] / 2);
	while (ret.length !== unit) {
		const random = getRandomInt(0, grapeLen[round] ** 2);
		let flag = true;
		for (const pos of ret) {
			if (getDiff(pos, random, len) < bound) {
				flag = false;
				break;
			}
		}
		if (flag) {
			ret.push(random);
		}
	}
	return ret;
};

export { generatePos };
