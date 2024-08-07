import { OAuth2Client } from 'google-auth-library';

import { getLogger } from '../../logging.service';
import { Location } from './location.type';

const logger = getLogger(__filename);

type GetLocationsOptions = { accountId: string };

export const getLocations = async (client: OAuth2Client, { accountId }: GetLocationsOptions) => {
    const get = async (pageToken?: string): Promise<Location[]> => {
        const { locations = [], nextPageToken } = await client
            .request<{ locations: Location[]; nextPageToken?: string }>({
                url: `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations`,
                params: {
                    readMask: ['name', 'title', 'storeCode', 'storefrontAddress.addressLines'].join(','),
                    pageSize: 100,
                    pageToken,
                },
            })
            .then((response) => response.data)
            .catch((error) => {
                logger.warn(`Get Locations Error`, { error, accountId });
                return { locations: [], nextPageToken: undefined };
            });

        return nextPageToken ? [...locations, ...(await get(nextPageToken))] : locations;
    };

    const locations = await get();
    return locations.map((location) => {
        const [_, locationId] = location.name.split('/');
        return { ...location, locationId };
    });
};
