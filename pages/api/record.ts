import db from '@db';
import { NextApiRequest, NextApiResponse } from 'next';
import { RecordRequestData } from '@features/testSlice';

// interface RecordRequestData {
// 	c: string; // 맞은 갯수
// 	w: string; // 틀린 갯수
// 	co: string[]; // 맞은 것들 offset
// 	wo: string[]; // 틀린 것들 offset
// 	a: string; // 나이
// 	h: string; // 사용하는 손 (l: 왼손, r: 오른손)
// 	g: string; // 성별 (m: 남자, f: 여자)
// 	p: string; // 게임 여부 (y: 한다, n: 안한다)
// 	d: string; // 디바이스 (p: 폰, t: 태블릿, c: 컴퓨터)
// 	t: string; // 티켓팅 경험 (0: 없다 ~ 4: 많다)
// }

interface FireBaseData extends RecordRequestData {
	z: Date; // 생성시각
}

interface ConvertedData {
	age: number;
	gender: string;
	device: string;
	hand: string;
	ticketing: number;
	game: number;
	correct: number[];
	wrong: number[];
	correctOffset: number[][][][];
	wrongOffset: number[][][][];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		if (!isThereAllData(req.body)) {
			return res.status(400).end();
		}
		try {
			const data = convertData2Collections(req.body);
			const { id } = await db.collection('result').add(data);
			res.status(200).json({ id });
		} catch (e) {
			res.status(400).end();
		}
	} else if (req.method === 'GET') {
		try {
			const results = (await db.collection('result').get()).docs.map(
				(result) => {
					const data = result.data();
					return convertCollections2Data(data as FireBaseData);
				}
			);
			res.status(200).send(results);
		} catch (e) {
			res.status(400).end();
		}
	}
};

function isThereAllData(data: any) {
	return (
		data.hasOwnProperty('t') &&
		data.hasOwnProperty('d') &&
		data.hasOwnProperty('p') &&
		data.hasOwnProperty('g') &&
		data.hasOwnProperty('h') &&
		data.hasOwnProperty('a') &&
		data.hasOwnProperty('wo') &&
		data.hasOwnProperty('co') &&
		data.hasOwnProperty('w') &&
		data.hasOwnProperty('c')
	);
}

function convertData2Collections(data: RecordRequestData): FireBaseData {
	return { ...data, z: new Date() };
}

const convertOffset = (str: string[]): number[][][][] => {
	const ret: number[][][][] = Array(3)
		.fill(0)
		.map(() =>
			Array(9)
				.fill(0)
				.map(() => [])
		);
	for (const area in str) {
		const areaResult = str[area];
		const roundResults = areaResult.split('|');
		for (const round in roundResults) {
			const curRoundResult = roundResults[round];
			const offsets = curRoundResult.split('/');
			for (const unit of offsets) {
				if (unit) ret[round][area].push(unit.split(',').map((v) => +v));
			}
		}
	}
	return ret;
};

function convertCollections2Data(data: FireBaseData): ConvertedData {
	const age = parseInt(data.a);
	const hand = data.h === 'l' ? 'left' : 'right';
	const gender = data.g === 'm' ? 'male' : 'female';
	const game = parseInt(data.p);
	const device =
		data.d === 'p' ? 'phone' : data.d === 'c' ? 'computer' : 'tablet';
	const ticketing = parseInt(data.a);

	const correct = data.c.split(',').map((v) => +v);
	const wrong = data.w.split(',').map((v) => +v);
	const correctOffset = convertOffset(data.co);
	const wrongOffset = convertOffset(data.wo);

	const tmp = {
		age,
		gender,
		correct,
		correctOffset,
		device,
		game,
		ticketing,
		wrongOffset,
		wrong,
		hand,
	};

	return tmp;
}
