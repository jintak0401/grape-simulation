import {
	defaultFontSize,
	defaultTimerTime,
	FontTypeEnum,
	requestRecord,
	TestResult,
	TestTypeEnum,
	TotalTestState,
} from '@features/testSlice';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeEnum } from '@features/themeSlice';

interface TestState {
	num: number;
}

const initialState: TestState = {
	num: 0,
};

const getTestState = createSelector(
	[(state: RootState) => state.testReducer],
	(state: TestState) => ({
		_num: state.num,
	})
);

const testSlice = createSlice({
	name: 'test',
	initialState,
	reducers: {
		init: (state) => {
			state.num = 0;
		},
		add: (state, { payload }: PayloadAction<number | undefined>) => {
			state.num += payload || 1;
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
export type { TestState };

const { actions, reducer: testReducer } = testSlice;

// setter
export const { init, add } = actions;

// thunk
// export { requestRecord };

// reducer
export default testReducer;

// getter
export { getTestState };
