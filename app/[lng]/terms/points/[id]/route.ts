import { NextRequest, NextResponse } from 'next/server';
import { updatePoint, getPointById, deletePoint } from '../route';  // 确保路径正确

export async function GET(request: NextRequest) {
  const { nextUrl } = request;
  const segments = nextUrl.pathname.split('/');
  const id = segments[segments.length - 1];  // 获取URL最后一部分作为ID

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const point = await getPointById(id);
  return NextResponse.json(point);
}

export async function PUT(request: NextRequest) {
  try {
    const bodyData = await request.json();

    const { nextUrl, body } = request;
    const segments = nextUrl.pathname.split('/');
    const id = segments[segments.length - 1];

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // 验证请求体中的数据是否存在并是否具有正确的格式
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { title, description, main_line } = bodyData;
    if (typeof title !== 'string' || typeof description !== 'string' || typeof main_line !== 'string') {
      return NextResponse.json({ error: 'Invalid data in request body' }, { status: 400 });
    }

    const updatedPoint = await updatePoint(id, bodyData);
    return NextResponse.json(updatedPoint);

  } catch (error) {
    return NextResponse.json({ error:'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  const { nextUrl } = request;
  const segments = nextUrl.pathname.split('/');
  const id = segments[segments.length - 1];  // 获取URL最后一部分作为ID

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  await deletePoint(id);
  return NextResponse.json({ success: true });
}
