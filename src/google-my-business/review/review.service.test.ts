import { getClient } from '../auth/auth.service';
import { getReviews } from './review.service';

it('getReviews', async () => {
    const businessId = 'sid@eaglytics-co.net';
    const accountId = '112530524108083411763';
    const locationId = '6501208319635997893';
    const client = await getClient(businessId);

    try {
        const reviews = await getReviews(client, { accountId, locationId });
        expect(reviews).toBeDefined();
    } catch (error) {
        console.error(error);
        throw error;
    }
});
