import { NextRequest } from 'next/server';
import { pool } from '@/database/db';

export async function GET() {
    const result = await pool.query('SELECT * FROM terms.link');
    return Response.json(result.rows);
}

export async function getLinkById(id: string) {
  const { rows } = await pool.query('SELECT * FROM terms.link WHERE id = $1', [id]);
  return rows[0];
}

export async function updateLink(id: string, data: any) {
  const { upstream_id, downstream_id, weight } = data;
  try {
    await pool.query('UPDATE terms.link SET upstream_id = $1, downstream_id = $2, weight = $3 WHERE id = $4', [upstream_id, downstream_id, weight, id]);
    return getLinkById(id);
  } catch (error) {
    console.error('Error updating link:', error);
    throw error; // 你可以根据需要调整这里的逻辑，例如返回一个特定的错误消息
  }
}

export async function deleteLink(id: string) {
  await pool.query('DELETE FROM terms.link WHERE id = $1', [id]);
}
