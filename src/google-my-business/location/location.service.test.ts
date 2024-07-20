import { getClient } from '../auth/auth.service';
import { getLocations } from './location.service';

it('getLocations', async () => {
    const businessId = 'sid@eaglytics-co.net';
    const accountId = '112530524108083411763';
    const client = await getClient(businessId);
    try {
        const locations = await getLocations(client, { accountId });
        expect(locations).toBeDefined();
    } catch (error) {
        console.error(error);
        throw error;
    }
});
