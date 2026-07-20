const slugify = require('../../src/utils/slugify');

describe('slugify', () => {
  it('lowercases and hyphenates a normal name', () => {
    expect(slugify('Ceramics & Pottery')).toBe('ceramics-pottery');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  --Home Goods--  ')).toBe('home-goods');
  });

  it('collapses repeated non-alphanumeric characters', () => {
    expect(slugify('Wool///Blankets')).toBe('wool-blankets');
  });
});
