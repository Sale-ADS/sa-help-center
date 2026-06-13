import { BigQuery } from '@google-cloud/bigquery';
import crypto from 'crypto';

let client: BigQuery | null = null;

function getClient(): BigQuery {
  if (!client) {
    client = new BigQuery({
      projectId: process.env.BQ_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT,
    });
  }
  return client;
}

export const BQ_DATASET = process.env.BQ_DATASET || 'saleads_help_center';
export const BQ_PROJECT = process.env.BQ_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'saleads-prod';
export const BQ_LOCATION = process.env.BQ_LOCATION || 'us-central1';

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function insertRow(
  tableId: string,
  row: Record<string, unknown>,
): Promise<void> {
  await getClient()
    .dataset(BQ_DATASET)
    .table(tableId)
    .insert([row], { skipInvalidRows: false, ignoreUnknownValues: false });
}

export async function runQuery<T = Record<string, unknown>>(
  sql: string,
  params: Record<string, unknown> = {},
): Promise<T[]> {
  const [rows] = await getClient().query({
    query: sql,
    params,
    location: BQ_LOCATION,
  });
  return rows as T[];
}
