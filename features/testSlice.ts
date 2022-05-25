import {
	createAsyncThunk,
	createSelector,
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

interface TestState {
	round: number;
	timer: number;
	correct: number[];
	wrong: number[];
}

interface SurveyState {
	hand: string;
	device: string;
	game: string;
	ticketing: string;
	age: string;
	gender: string;
}

interface TotalTestState extends TestState, SurveyState {
	correctOffset: string[][]; // [round][구역][x, y]
	wrongOffset: string[][];
	recordDone: boolean;
}

const initOffset = () => {
	return Array.from({ length: 3 }, () => Array.from({ length: 9 }, () => ''));
};

const checkBound = 5;
const defaultTimer = 20;
const initialState: TotalTestState = {
	recordDone: false,
	hand: '',
	device: '',
	game: '',
	ticketing: '',
	age: '',
	gender: '',
	round: 0,
	timer: 0,
	correct: [0, 0, 0],
	wrong: [0, 0, 0],
	correctOffset: initOffset(),
	wrongOffset: initOffset(),
};

interface CurTestState {
	round: number;
	timer: number;
	curCorrect: number;
	curWrong: number;
}

interface TestResultState {
	totalCorrect: number[];
	totalWrong: number[];
	correctArea: number[];
	wrongArea: number[];
	recordDone: boolean;
}

const getCurTestState = createSelector(
	[(state: RootState) => state.testReducer],
	(state: TotalTestState): CurTestState => ({
		round: state.round,
		timer: state.timer,
		curCorrect: state.correct[state.round],
		curWrong: state.wrong[state.round],
	})
);

const getSurveyState = createSelector(
	[(state: RootState) => state.testReducer],
	(state: TotalTestState): SurveyState => ({
		hand: state.hand,
		device: state.device,
		game: state.game,
		ticketing: state.ticketing,
		age: state.age,
		gender: state.gender,
	})
);

const getOffset = createSelector(
	[(state: RootState) => state.testReducer],
	(state: TotalTestState) => ({
		correctOffset: state.correctOffset[state.round],
		wrongOffset: state.wrongOffset[state.round],
	})
);

const convertArea = (arr: string[][]) => {
	const ret: number[] = [];
	ret.length = 9;
	for (let i = 0; i < 9; ret[i++] = 0);
	for (let round = 0; round < 3; round++) {
		const result = [...arr[round]];
		result.forEach((str, idx) => {
			ret[idx] += str.split('/').length - 1;
		});
	}
	return ret;
};
const getTestResultState = createSelector(
	[(state: RootState) => state.testReducer],
	(state: TotalTestState): TestResultState => ({
		totalCorrect: state.correct,
		totalWrong: state.wrong,
		correctArea: convertArea(state.correctOffset),
		wrongArea: convertArea(state.wrongOffset),
		recordDone: state.recordDone,
	})
);

interface RecordRequestData {
	c: string; // 맞은 갯수
	w: string; // 틀린 갯수
	co: string[]; // 맞은 것들 offset
	wo: string[]; // 틀린 것들 offset
	a: string; // 나이
	h: string; // 사용하는 손 (l: 왼손, r: 오른손)
	g: string; // 성별 (m: 남자, f: 여자)
	p: string; // 게임 여부 (y: 한다, n: 안한다)
	d: string; // 디바이스 (p: 폰, t: 태블릿, c: 컴퓨터)
	t: string; // 티켓팅 경험 (0: 없다 ~ 4: 많다)
}

const getRecordRequestData = createSelector(
	[(state: RootState) => state.testReducer],
	(state: TotalTestState): RecordRequestData => {
		const c = state.correct.join(',');
		const w = state.wrong.join(',');
		const co: string[] = [];
		const wo: string[] = [];
		for (let i = 0; i < 9; i++) {
			co[i] = '';
			wo[i] = '';
		}
		let tmpRound = 0;
		for (const roundResult of state.correctOffset) {
			for (const area in roundResult) {
				const areaResult = roundResult[area];
				if (areaResult.at(-1) === '/') co[area] += areaResult.slice(0, -1);
				co[area] += tmpRound < 2 ? '|' : '';
			}
			tmpRound++;
		}
		tmpRound = 0;
		for (const roundResult of state.wrongOffset) {
			for (const area in roundResult) {
				const areaResult = roundResult[area];
				if (areaResult.at(-1) == '/') wo[area] += areaResult.slice(0, -1);
				wo[area] += tmpRound < 2 ? '|' : '';
			}
			tmpRound++;
		}

		return {
			c,
			w,
			co,
			wo,
			a: state.age,
			h: state.hand,
			g: state.gender,
			p: state.game,
			d: state.device,
			t: state.ticketing,
		};
	}
);

const requestRecord = createAsyncThunk(
	'request/record',
	async (recordRequestData: RecordRequestData, thunkApi) => {
		try {
			const response = await axios.post('/api/record', recordRequestData);
			if (response.data?.id !== undefined) {
				return true;
			}
		} catch (e) {
			return thunkApi.rejectWithValue('cannot record result');
		}
	}
);

const testSlice = createSlice({
	name: 'test',
	initialState,
	reducers: {
		initAll: (state) => {
			state.round = 0;
			state.correctOffset = initOffset();
			state.wrongOffset = initOffset();
			state.timer = defaultTimer;
			state.correct = [0, 0, 0];
			state.wrong = [0, 0, 0];
			state.recordDone = false;
			state.hand = '';
			state.device = '';
			state.game = '';
			state.ticketing = '';
			state.age = '';
			state.gender = '';
		},
		addWrong: (state) => {
			state.wrong[state.round]++;
		},
		addCorrect: (state) => {
			state.correct[state.round]++;
		},
		goNextRound: (state, { payload }: PayloadAction<number | undefined>) => {
			state.round = payload || state.round + 1;
		},
		setTimerTime: (state, { payload }: PayloadAction<number | undefined>) => {
			state.timer = payload || state.timer - 1;
		},
		// payload: [구역, x좌표, y좌표]
		addWrongOffset: (state, { payload }: PayloadAction<number[]>) => {
			state.wrongOffset[state.round][
				payload[0]
			] += `${payload[1]},${payload[2]}/`;
		},
		addCorrectOffset: (state, { payload }: PayloadAction<number[]>) => {
			state.correctOffset[state.round][
				payload[0]
			] += `${payload[1]},${payload[2]}/`;
		},
		setGender: (state, { payload }: PayloadAction<string>) => {
			state.gender = payload;
		},
		setHand: (state, { payload }: PayloadAction<string>) => {
			state.hand = payload;
		},
		setDevice: (state, { payload }: PayloadAction<string>) => {
			state.device = payload;
		},
		setGame: (state, { payload }: PayloadAction<string>) => {
			state.game = payload;
		},
		setTicketing: (state, { payload }: PayloadAction<string>) => {
			state.ticketing = payload;
		},
		setAge: (state, { payload }: PayloadAction<string>) => {
			state.age = payload;
		},
	},
	extraReducers: {
		// [requestRecord.pending.type]: (state) => {},
		[requestRecord.fulfilled.type]: (state) => {
			state.recordDone = true;
		},
	},
});

// state
export type {
	TotalTestState,
	CurTestState,
	TestResultState,
	RecordRequestData,
};

const { actions, reducer: testReducer } = testSlice;

// setter
export const {
	initAll,
	addWrong,
	addCorrect,
	goNextRound,
	setTimerTime,
	addCorrectOffset,
	addWrongOffset,
	setHand,
	setGame,
	setGender,
	setTicketing,
	setDevice,
	setAge,
} = actions;

// thunk
export { requestRecord };

// reducer
export default testReducer;

// getter
export {
	getCurTestState,
	getOffset,
	getSurveyState,
	getTestResultState,
	getRecordRequestData,
};

export { defaultTimer, checkBound };
