import { NextResponse } from 'next/server';
import ogs from 'open-graph-scraper';
import { z } from 'zod';

const SearchParamsSchema = z.object({
  url: z.string().url(),
});

type OpenGraphImage = {
  height: string;
  width: string;
  type: string;
  url: string;
};

export type OpenGraphResponse = {
  ogTitle: string;
  ogType: string;
  ogUrl: string;
  ogDescription: string;
  ogImage: OpenGraphImage;
  requestUrl: string;
  success: boolean;
} & {
  [key: string]: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.error();
  }

  // TODO: Validate URL

  const options = { url, onlyGetOpenGraphInfo: true };

  const { result, error } = await ogs(options);

  if (error) {
    return NextResponse.error();
  }

  return NextResponse.json(result);
}
