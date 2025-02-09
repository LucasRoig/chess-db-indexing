import { trace } from '@opentelemetry/api';
import express, { type Express } from 'express';
import winston from 'winston';
import { getGames } from './pg-client';

const PORT: number = Number.parseInt(process.env.PORT || '8080');
const app: Express = express();

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ]
})

const tracer = trace.getTracer('otel-roll-dice');

function getRandomNumber(min: number, max: number) {
  return tracer.startActiveSpan('getRandomNumber', async (span) => {
    const result = Math.floor(Math.random() * (max - min + 1) + min);
    const games = await getGames();
    logger.info(`Found ${games.length} games`);
    span.setAttribute('result', result);
    span.end();
    return result;
  });
}

function getRolls() {
  return tracer.startActiveSpan('getRolls', async (span) => {
    span.setAttribute('component', 'otel-roll-dice');
    const rollsPromises = Array.from({ length: 10 }, () => getRandomNumber(1, 6));
    const rolls = await Promise.all(rollsPromises);
    span.setAttribute('rolls', rolls);
    span.end();
    return rolls;
  });
}

app.get('/rolldice', async (_req, res) => {
  res.json({
    rolls: await getRolls(),
  });
});

app.listen(PORT, () => {
  logger.info(`Listening for requests on http://localhost:${PORT}`);
});
