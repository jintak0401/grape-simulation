import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
	theme: string;
	usuallyTheme: string;
}

const initialState: ThemeState = {
	theme: '',
	usuallyTheme: '',
};

const getTheme = createSelector(
	[(state: RootState) => state.themeReducer],
	(state: ThemeState): ThemeEnum.Dark | ThemeEnum.Light =>
		state.theme === 'dark' ? ThemeEnum.Dark : ThemeEnum.Light
);

enum ThemeEnum {
	Default,
	Toggle,
	Light,
	Dark,
	Current,
	Usually,
	NotUsually,
}

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		changeTheme: (state, { payload }: PayloadAction<ThemeEnum>) => {
			switch (payload) {
				case ThemeEnum.Toggle:
					state.theme = state.theme === 'light' ? 'dark' : 'light';
					break;
				case ThemeEnum.Dark:
					state.theme = 'dark';
					break;
				case ThemeEnum.Light:
					state.theme = 'light';
					break;
				case ThemeEnum.Usually:
					state.theme = state.usuallyTheme;
					if (state.usuallyTheme) break;

				// usuallyTheme 이 ''일 경우에는 기본테마 실행
				case ThemeEnum.Default:
					const isDarkMode = window.matchMedia(
						'(prefers-color-scheme: dark)'
					).matches;
					state.theme = isDarkMode ? 'dark' : 'light';
					break;
				case ThemeEnum.NotUsually:
					state.theme = state.usuallyTheme == 'dark' ? 'light' : 'dark';
					break;
				default:
					break;
			}
			document.documentElement.setAttribute('data-theme', state.theme);
		},
		setUsuallyTheme: (
			state,
			{ payload }: PayloadAction<ThemeEnum.Light | ThemeEnum.Dark>
		) => {
			state.usuallyTheme = payload === ThemeEnum.Dark ? 'dark' : 'light';
		},
	},
});

// type
export type { ThemeState };

// Enum
export { ThemeEnum };

const { actions, reducer: themeReducer } = themeSlice;

// setter
export const { changeTheme, setUsuallyTheme } = actions;

// reducer
export default themeReducer;

// getter
export { getTheme };
