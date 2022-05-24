import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TestState {
	round: number;
	step: number;
	timer: number;
	correct: number[];
	wrong: number[];
}

interface TotalTestState extends TestState {
	offset: number[][][]; // [round][구역][x, y]
}

const initOffset = () => {
	return Array.from({ length: 3 }, () => Array.from({ length: 9 }, () => []));
};

const defaultTimer = 20;
const initialState: TotalTestState = {
	round: 0,
	step: 0,
	timer: 0,
	correct: [0, 0, 0],
	wrong: [0, 0, 0],
	offset: initOffset(),
};

interface CurTestState {
	round: number;
	step: number;
	timer: number;
	curCorrect: number;
	curWrong: number;
}

const getCurTestState = createSelector(
	[(state: RootState) => state.testReducer],
	(state: TotalTestState): CurTestState => ({
		round: state.round,
		step: state.step,
		timer: state.timer,
		curCorrect: state.correct[state.round],
		curWrong: state.wrong[state.round],
	})
);

const testSlice = createSlice({
	name: 'test',
	initialState,
	reducers: {
		initAll: (state) => {
			state.round = 0;
			state.offset = initOffset();
			state.timer = defaultTimer;
			state.correct = [0, 0, 0];
			state.wrong = [0, 0, 0];
		},
		addWrong: (state) => {
			state.wrong[state.round]++;
		},
		addCorrect: (state) => {
			state.correct[state.round]++;
		},
		goNextStep: (state) => {
			state.step++;
		},
		goNextRound: (state, { payload }: PayloadAction<number | undefined>) => {
			state.round = payload || state.round + 1;
		},
		setTimerTime: (state, { payload }: PayloadAction<number | undefined>) => {
			state.timer = payload || state.timer - 1;
		},
	},
	extraReducers: {
		// [requestRecord.pending.type]: (state) => {},
		// [requestRecord.fulfilled.type]: (state) => {
		// 	state.recordDone = true;
		// },
		// [requestRecord.rejected.type]: (state) => {},
	},
});

// state
export type { TotalTestState, CurTestState };

const { actions, reducer: testReducer } = testSlice;

// setter
export const {
	initAll,
	addWrong,
	addCorrect,
	goNextStep,
	goNextRound,
	setTimerTime,
} = actions;

// thunk
// export { requestRecord };

// reducer
export default testReducer;

// getter
export { getCurTestState };

export { defaultTimer };
