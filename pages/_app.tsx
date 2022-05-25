import '@styles/globals.scss';
import type { AppProps } from 'next/app';
import { persistedReducer, wrapper } from '@app/store';
import { persistStore } from 'redux-persist';
import { legacy_createStore as createStore } from '@reduxjs/toolkit';
import { PersistGate } from 'redux-persist/integration/react';
import { Fragment } from 'react';
import Script from 'next/script';
import { GA_TRACKING_ID } from '@lib/gtag';
import { MetaTags } from '@components';

function MyApp({ Component, pageProps }: AppProps) {
	const store = createStore(persistedReducer);
	const persistor = persistStore(store);
	return (
		<Fragment>
			<MetaTags />
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
				strategy="afterInteractive"
			/>
			<Script
				id="gtag-init"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
				  window.dataLayer = window.dataLayer || [];
				  function gtag(){window.dataLayer.push(arguments);}
				  gtag('js', new Date());

				  gtag('config', "${GA_TRACKING_ID}");
				`,
				}}
			/>

			<PersistGate persistor={persistor}>
				<Component {...pageProps} />
			</PersistGate>
		</Fragment>
	);
}

export default wrapper.withRedux(MyApp);
