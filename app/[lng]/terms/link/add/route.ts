import { type NextRequest } from 'next/server';
import { pool } from '@/database/db';

export async function POST(request: NextRequest) {
  const { upstream_id, downstream_id } = request.body;
  await pool.query('INSERT INTO terms.link(upstream_id, downstream_id) VALUES($1, $2)', [upstream_id, downstream_id]);
  return Response.json({ success: true });
}
