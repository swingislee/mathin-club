// app\[lng]\terms\points\reorder\route.ts

import { type NextRequest } from 'next/server';
import { pool } from '@/database/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, newOrder } = body;

  // 开始数据库事务
  await pool.query('BEGIN');

  try {
    // 获取当前order
    const { rows } = await pool.query('SELECT "order" FROM terms.point WHERE id = $1', [id]);
    const currentOrder = rows[0]?.order;

    if (currentOrder !== undefined) {
      // 判断是向上移动还是向下移动
      if (newOrder < currentOrder) {
        // 向上移动，增加位于新旧位置之间节点的order
        await pool.query(`
          UPDATE terms.point 
          SET "order" = "order" + 1 
          WHERE "order" >= $1 AND "order" < $2
        `, [newOrder, currentOrder]);
      } else if (newOrder > currentOrder) {
        // 向下移动，减少位于新旧位置之间节点的order
        await pool.query(`
          UPDATE terms.point 
          SET "order" = "order" - 1 
          WHERE "order" <= $1 AND "order" > $2
        `, [newOrder, currentOrder]);
      }

      // 更新被拖动节点的order
      await pool.query('UPDATE terms.point SET "order" = $1 WHERE id = $2', [newOrder, id]);
    }

    // 提交事务
    await pool.query('COMMIT');
  } catch (error) {
    // 回滚事务
    await pool.query('ROLLBACK');
    throw error;
  }

  return Response.json({ success: true });
}
