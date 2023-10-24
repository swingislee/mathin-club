import { type NextRequest } from 'next/server';
import { pool } from '@/database/db';

export async function GET() {
    const result = await pool.query('SELECT * FROM terms.point');
    return Response.json(result.rows);
  }

export async function getPointById(id: string) {
  const { rows } = await pool.query('SELECT * FROM terms.point WHERE id = $1', [id]);
  return rows[0];
}

export async function updatePoint(id: string, data: any) {
  const { title, description, main_line } = data;
  try {
    await pool.query('UPDATE terms.point SET title = $1, description = $2, main_line = $3 WHERE id = $4', [title, description, main_line, id]);
    return getPointById(id);
  } catch (error) {
    console.error('Error updating point:', error);
    throw error; // 你可以根据需要调整这里的逻辑，例如返回一个特定的错误消息
  }
}

export async function deletePoint(id: string) {
  await pool.query('DELETE FROM terms.link WHERE upstream_id = $1 OR downstream_id = $1', [id]);
  await pool.query('DELETE FROM terms.point WHERE id = $1', [id]);
}