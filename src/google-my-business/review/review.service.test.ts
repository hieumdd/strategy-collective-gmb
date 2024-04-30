import { getClient } from '../auth/auth.service';
import { getReviews } from './review.service';

it('getReviews', async () => {
    const businessId = 'sid@eaglytics-co.net';
    const client = await getClient(businessId);

    return await getReviews(client, { accountId: '112530524108083411763', locationId: '6501208319635997893' })
        .then((reviews) => {
            expect(reviews).toBeDefined();
        })
        .catch((error) => {
            console.error(error);
            throw error;
        });
});
