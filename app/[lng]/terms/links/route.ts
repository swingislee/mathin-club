import { type NextRequest } from 'next/server';
import { pool } from '@/database/db';

export async function GET() {
    const result = await pool.query('SELECT * FROM terms.link');
    return Response.json(result.rows);
  }