import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PriceTag from '../components/PriceTag';

describe('PriceTag', () => {
  it('formats the price to two decimal places', () => {
    render(<PriceTag price={18} />);
    expect(screen.getByText('$18.00')).toBeInTheDocument();
  });

  it('rounds a price with more than two decimals', () => {
    render(<PriceTag price={19.999} />);
    expect(screen.getByText('$20.00')).toBeInTheDocument();
  });
});
