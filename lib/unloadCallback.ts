import { NextRouter } from 'next/router';

const unloadCallback = (event: BeforeUnloadEvent) => {
	event.preventDefault();
	event.returnValue = '';
	return '';
};

const handleRefreshAndGoBack = (router: NextRouter) => {
	if (window) {
		router.beforePopState(() => {
			const result = window.confirm('이 페이지에서 이동하실건가요?');
			if (!result) {
				window.history.pushState('/', '');
				router.push(router.pathname);
			}
			return result;
		});
		window.onbeforeunload = unloadCallback;
	}

	return () => {
		if (window) {
			window.onbeforeunload = null;
		}
		router.beforePopState(() => {
			return true;
		});
	};
};

export { unloadCallback, handleRefreshAndGoBack };
