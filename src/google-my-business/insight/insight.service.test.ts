import { getInsights } from './insight.service';
import { getClient } from '../auth/auth.service';

it('getInsights', async () => {
    const client = await getClient('sid@eaglytics-co.net');

    return await getInsights(client, { locationId: '6501208319635997893' })
        .then((insights) => {
            expect(insights).toBeDefined();
        })
        .catch((error) => {
            console.error(error);
            throw error;
        });
});
