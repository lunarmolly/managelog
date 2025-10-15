import { http, HttpResponse, delay } from 'msw';

export const statusHandlers = [
  http.get('/__probe__/status/:code', async ({ params }) => {
    await delay(150);
    const code = Number(params.code || 500);
    return new HttpResponse(null, { status: code });
  }),
];


