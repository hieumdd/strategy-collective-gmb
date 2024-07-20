import { OAuth2Client } from 'google-auth-library';

import { Account } from './account.type';

export const getAccounts = async (client: OAuth2Client) => {
    const get = async (cursor?: string): Promise<Account[]> => {
        const { accounts, nextPageToken } = await client
            .request<{ accounts: Account[]; nextPageToken?: string }>({
                method: 'GET',
                url: 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
                params: { pageToken: cursor },
            })
            .then((response) => response.data);

        return nextPageToken ? [...accounts, ...(await get(nextPageToken))] : accounts;
    };

    const accounts = await get();
    return accounts.map((account) => {
        const [_, accountId] = account.name.split('/');
        return { ...account, accountId };
    });
};
