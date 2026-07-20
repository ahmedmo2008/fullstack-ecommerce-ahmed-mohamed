import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

const product = {
  id: 'prod-1',
  name: 'Stoneware Mug',
  price: '18.00',
  stock: 5,
  imageUrl: null,
};

function renderCard(p) {
  return render(
    <MemoryRouter>
      <ProductCard product={p} />
    </MemoryRouter>
  );
}

describe('ProductCard', () => {
  it('renders the product name and price', () => {
    renderCard(product);
    expect(screen.getByText('Stoneware Mug')).toBeInTheDocument();
    expect(screen.getByText('$18.00')).toBeInTheDocument();
  });

  it('links to the product details page', () => {
    renderCard(product);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/prod-1');
  });

  it('shows a sold out badge when stock is zero', () => {
    renderCard({ ...product, stock: 0 });
    expect(screen.getByText('Sold out')).toBeInTheDocument();
  });
});
