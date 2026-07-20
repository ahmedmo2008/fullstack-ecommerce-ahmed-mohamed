const { signToken, verifyToken } = require('../../src/utils/jwt');

describe('jwt utils', () => {
  it('signs a token that can be verified and returns the original payload', () => {
    const token = signToken({ id: 'user-1', role: 'CUSTOMER' });
    const decoded = verifyToken(token);

    expect(decoded.id).toBe('user-1');
    expect(decoded.role).toBe('CUSTOMER');
  });

  it('throws when verifying an invalid token', () => {
    expect(() => verifyToken('not-a-real-token')).toThrow();
  });
});
