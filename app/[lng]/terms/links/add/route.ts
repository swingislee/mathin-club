import { type NextRequest } from 'next/server';
import { pool } from '@/database/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { upstream_id, downstream_id, weight } = body;

  // 插入新的链接，并提供权重
  await pool.query(
    'INSERT INTO terms.link(upstream_id, downstream_id, weight) VALUES($1, $2, $3)', 
    [upstream_id, downstream_id, weight]
  );

  return Response.json({ success: true });
}
