export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
	interface Window {
		gtag: (param1: string, param2: string, param3: object) => void;
	}
}

export const pageview = (url: URL): void => {
	window.gtag('config', GA_TRACKING_ID!, {
		page_path: url,
	});
};

type GTagEvent = {
	action: string;
	category: string;
	label: string;
	value: number;
};

export const event = ({ action, category, label, value }: GTagEvent): void => {
	window.gtag('event', action, {
		event_category: category,
		event_label: label,
		value,
	});
};
