import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import Joi from 'joi';
import { isObject } from 'lodash'
import { ValidatedRequest, createValidator } from 'express-joi-validation';

import { getLogger } from './logging.service';
import { exchangeCodeForToken, getAuthorizationURL } from './google-my-business/auth/auth.service';
import { CallbackQueryRequest, CallbackQuerySchema } from './google-my-business/auth/auth.request.dto';
import * as pipelines from './pipeline/pipeline.const';
import { initiatePipelines, runLocationPipeline } from './pipeline/pipeline.service';
import { RunLocationPipelineRequest, RunLocationPipelineBodySchema } from './pipeline/pipeline.request.dto';

const logger = getLogger(__filename);

['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.once(signal, () => {
        logger.info(signal);
        process.exit(0);
    });
});

const app = express();
const validator = createValidator({ passError: true, joi: { stripUnknown: true } });

app.use(bodyParser.json());

app.use(({ method, path, body }, res, next) => {
    logger.info({ method, path, body });
    res.once('finish', () => {
        logger.info({ method, path, body, status: res.statusCode });
    });
    next();
});

app.get('/authorize', (_, res) => {
    res.status(301).redirect(getAuthorizationURL());
});

app.get(
    '/authorize/callback',
    validator.query(CallbackQuerySchema),
    ({ query: { code } }: ValidatedRequest<CallbackQueryRequest>, res, next) => {
        exchangeCodeForToken(code)
            .then((token) => res.status(200).json({ token }))
            .catch(next);
    },
);

app.post(
    `/${pipelines.Location.route}`,
    validator.body(RunLocationPipelineBodySchema),
    ({ body }: ValidatedRequest<RunLocationPipelineRequest>, res, next) => {
        runLocationPipeline(body)
            .then((result) => res.status(200).json({ result }))
            .catch(next);
    },
);

app.post(`/`, (_, res, next) => {
    initiatePipelines()
        .then((result) => res.status(200).json({ result }))
        .catch(next);
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (isObject(error) && 'error' in error && Joi.isError(error.error)) {
        logger.warn({ error: error.error });
        res.status(400).json({ error: error.error });
        return;
    }

    logger.error({ error });
    res.status(500).json({ error });
});

app.listen(8080);
