import { type NextRequest } from 'next/server';
import { pool } from '@/database/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const result = await pool.query('SELECT * FROM terms.point WHERE id = $1', [id]);
    return Response.json(result.rows[0]);
  }