import { describe, it, expect } from 'vitest';
import { resolveImageUrl } from '../utils/image';

describe('resolveImageUrl', () => {
  it('returns null when no image is provided', () => {
    expect(resolveImageUrl(null)).toBeNull();
  });

  it('returns absolute URLs unchanged', () => {
    expect(resolveImageUrl('https://example.com/img.jpg')).toBe('https://example.com/img.jpg');
  });

  it('prefixes a relative upload path with the API root', () => {
    expect(resolveImageUrl('/uploads/test.jpg')).toBe('http://localhost:5000/uploads/test.jpg');
  });
});
