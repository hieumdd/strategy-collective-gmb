import { getClient } from '../auth/auth.service';
import { getLocations } from './location.service';

it('getLocations', async () => {
    const accountId = 'sid@eaglytics-co.net';
    const client = await getClient(accountId);

    return await getLocations(client, { accountId: '112530524108083411763' })
        .then((locations) => {
            expect(locations).toBeDefined();
        })
        .catch((error) => {
            console.error(error);
            throw error;
        });
});
