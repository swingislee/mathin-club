import { type NextRequest } from 'next/server';
import { pool } from '@/database/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, main_line } = body;

  // 检查 title 是否为空或未定义
  if (!title) {
      return Response.json({ error: "Title must be provided and non-empty." }, 400);
  }

  const result = await pool.query('INSERT INTO terms.point(title, description, main_line) VALUES($1, $2, $3) RETURNING id', [title, description, main_line]);
  return Response.json({ id: result.rows[0].id });
}
