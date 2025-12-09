import { rest } from 'msw';
import { appendPath } from './utils';

export const authHandlers = [
  rest.post(appendPath(`login`), (req, res, ctx) =>
    res(
      ctx.json({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjIwMTYyMzkwMjIsInVzZXJfaWQiOjEsInJvbGVzIjpbInN1cGVyX2FkbWluIl19.oYl6B77obPYDFDJ2Gem2DH0-5hy1jScioWQlxXJHjHY',
      })
    )
  ),
  rest.get(appendPath(`users/me`), (req, res, ctx) =>
    res(
      ctx.json({
        id: 1,
        email: 'hit@hitocean.com',
      })
    )
  ),
];
