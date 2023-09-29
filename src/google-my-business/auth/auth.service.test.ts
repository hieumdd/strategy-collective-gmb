import axios from 'axios';

import { configs } from '../../pipeline/account.const';
import { getToken, getAuthClient } from './auth.service';

describe('auth', () => {
    let refreshToken: string;

    beforeAll(async () => {
        refreshToken = await configs[0].getRefreshToken();
    });

    it('get-token', async () => {
        return getToken(refreshToken)
            .then((result) => {
                console.log(result.access_token);
                expect(result.access_token).toBeTruthy();
            })
            .catch((error) => {
                console.error(error);
                throw error;
            });
    });

    it('get-accounts', async () => {
        const url = 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts';
        return getAuthClient(refreshToken)
            .then((client) => client.request({ method: 'GET', url }))
            .then((response) => response.data)
            .then((data) => {
                console.log({ data });
                expect(data).toBeDefined();
            })
            .catch((error) => {
                console.error({ error });
                throw error;
            });
    });
});
