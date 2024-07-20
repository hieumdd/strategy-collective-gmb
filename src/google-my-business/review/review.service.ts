import { OAuth2Client } from 'google-auth-library';

import { getLogger } from '../../logging.service';
import { Review } from './review.type';

const logger = getLogger(__filename);

type GetReviewsOptions = {
    accountId: string;
    locationId: string;
};

export const getReviews = async (client: OAuth2Client, options: GetReviewsOptions) => {
    const { accountId, locationId } = options;

    const get = async (pageToken?: string): Promise<Review[]> => {
        const { reviews = [], nextPageToken } = await client
            .request<{ reviews: Review[]; nextPageToken?: string }>({
                method: 'GET',
                url: `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
                params: { pageToken },
            })
            .then((response) => response.data)
            .catch((error) => {
                logger.warn(`Get Reviews Error`, { error, accountId, locationId });
                return { reviews: [], nextPageToken: undefined };
            });

        return nextPageToken ? [...reviews, ...(await get(nextPageToken))] : reviews || [];
    };

    const reviews = await get();
    return (reviews || []).map((review) => ({ ...review, accountId, locationId }));
};
