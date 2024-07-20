import { getClient } from '../auth/auth.service';
import { getAccounts } from './account.service';

it('getInsights', async () => {
    const client = await getClient('sid@eaglytics-co.net');
    try {
        const accounts = await getAccounts(client);
        expect(accounts).toBeDefined();
    } catch (error) {
        console.error(error);
        throw error;
    }
});
