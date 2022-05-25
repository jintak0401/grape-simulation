import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey';

if (!admin.apps.length) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
		});
	} catch (error) {
		console.error('Firebase admin initialization error', error);
	}
}
export default admin.firestore();
