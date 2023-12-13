//app\[lng]\terms\points\add\route.ts

import { type NextRequest } from 'next/server';
import { pool } from '@/database/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, main_line } = body;

  if (!title) {
    return Response.json({ error: "Title must be provided and non-empty." }, { status: 400 });
  }

  // Insert the record and get the generated id
  const insertResult = await pool.query(
    'INSERT INTO terms.point(title, description, main_line) VALUES($1, $2, $3) RETURNING id',
    [title, description, main_line]
  );

  const newId = insertResult.rows[0].id;

  // Update the newly added record's 'order' column
  // Note the double quotes around "order"
  await pool.query('UPDATE terms.point SET "order" = $1 WHERE id = $2', [newId, newId]);

  return Response.json({ id: newId });
}

