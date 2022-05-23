import {
	Action,
	AnyAction,
	combineReducers,
	configureStore,
	Reducer,
	ThunkAction,
} from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

import { testReducer } from '@features';

// 모든 리듀서 여기에 정의
const combinedReducer = combineReducers({
	testReducer,
});

const reducer = (
	state: ReturnType<typeof combinedReducer> | undefined,
	action: AnyAction
) => {
	switch (action.type) {
		case HYDRATE:
			return {
				...state,
				...action.payload,
			};
		default:
			return combinedReducer(state, action);
	}
};

const makeConfiguredStore = (reducer: Reducer) =>
	configureStore({
		reducer,
		devTools: process.env.NODE_ENV !== 'production',
	});

export const makeStore = () => {
	const isServer = typeof window === 'undefined';

	if (isServer) {
		return makeConfiguredStore(reducer);
	} else {
		const store = makeConfiguredStore(reducer);
		return { ...store };
	}
};

type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store['dispatch'];

declare global {
	type RootState = ReturnType<Store['getState']>;
}

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;

export const wrapper = createWrapper(makeStore, {
	debug: process.env.NODE_ENV !== 'production',
});
