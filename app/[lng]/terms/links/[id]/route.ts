import { NextRequest, NextResponse } from 'next/server';
import { updateLink, getLinkById, deleteLink } from '../route';  // 确保路径正确

export async function GET(request: NextRequest) {
  const { nextUrl } = request;
  const segments = nextUrl.pathname.split('/');
  const id = segments[segments.length - 1];  // 获取URL最后一部分作为ID

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const link = await getLinkById(id);
  return NextResponse.json(link);
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
    console.log(bodyData)
    const { upstream_id, downstream_id, weight } = bodyData;
    if (typeof upstream_id !== 'number' || typeof downstream_id !== 'number' || typeof weight !== 'number') {
      return NextResponse.json({ error: 'Invalid data in request body',}, { status: 400 });
    }

    const updatedLink = await updateLink(id, bodyData);
    return NextResponse.json(updatedLink);

    } catch (error) {
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
  const { nextUrl } = request;
  const segments = nextUrl.pathname.split('/');
  const id = segments[segments.length - 1];  // 获取URL最后一部分作为ID

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  await deleteLink(id);
  return NextResponse.json({ success: true });
}
