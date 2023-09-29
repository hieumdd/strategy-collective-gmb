import { AxiosInstance } from 'axios';

import { configs } from '../../pipeline/account.const';
import { getAuthClient } from '../auth/auth.service';
import { getLocations } from './location.service';

describe('location', () => {
    const config = configs[0];
    let client: AxiosInstance;

    beforeAll(async () => {
        client = await config.getRefreshToken().then(getAuthClient);
    });

    describe('getLocations', () => {
        it.each(config.accountIds)('get-locations-%p', async (accountId) => {
            return getLocations(client, { accountId })
                .then((locations) => {
                    console.log(locations);
                    locations.forEach((location) => {
                        expect(location.name).toBeTruthy();
                        expect(location.title).toBeTruthy();
                    });
                })
                .catch((error) => {
                    console.error(error);
                    throw error;
                });
        });
    });

    it('locations', async () => {
        const accountId = `108405109682017952426`;
        return getLocations(client, { accountId })
            .then((locations) => {
                console.log(locations);
                locations.forEach((location) => {
                    expect(location.name).toBeTruthy();
                    expect(location.title).toBeTruthy();
                });
            })
            .catch((error) => {
                console.error(error);
                throw error;
            });
    });
});
