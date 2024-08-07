import { getInsights } from './insight.service';
import { getClient } from '../auth/auth.service';

it('getInsights', async () => {
    const client = await getClient('sid@eaglytics-co.net');
    const locationId = '6501208319635997893';
    try {
        const insights = await getInsights(client, { locationId });
        expect(insights).toBeDefined();
    } catch (error) {
        console.error(error);
        throw error;
    }
});
