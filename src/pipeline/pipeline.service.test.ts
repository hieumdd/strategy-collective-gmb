import { runLocationPipeline, initiatePipelines } from './pipeline.service';

it('initiatePipelines', async () => {
    return await initiatePipelines().catch((error) => {
        console.error(error);
        throw error;
    });
});

it('pipeline/location', async () => {
    const options = {
        businessId: 'sid@eaglytics-co.net',
        accountId: '112530524108083411763',
        locationId: '6501208319635997893',
    };

    return await runLocationPipeline(options)
        .then(([insights, reviews]) => {
            expect(insights).toBeGreaterThanOrEqual(0);
            expect(reviews).toBeGreaterThanOrEqual(0);
        })
        .catch((error) => {
            console.error(error);
            throw error;
        });
});
