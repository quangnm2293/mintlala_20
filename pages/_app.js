import { DataProvider } from '../store/GlobalState';
import '../styles/globals.css';
import Notify from '../components/tailwind/Notify';
// import { ErrorBoundary } from '../components/tailwind/ErrorBoundary';

function MyApp({ Component, pageProps }) {
	return (
		// <ErrorBoundary>
		<DataProvider>
			<Notify />

			<Component {...pageProps} />
		</DataProvider>
		// </ErrorBoundary>
	);
}

export default MyApp;
