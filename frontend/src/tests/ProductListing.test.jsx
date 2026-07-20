import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from './testUtils';
import ProductListing from '../pages/ProductListing';

describe('ProductListing', () => {
  it('renders products returned from the API', async () => {
    renderWithProviders(<ProductListing />, { route: '/products' });

    await waitFor(() => {
      expect(screen.getByText('Stoneware Mug')).toBeInTheDocument();
    });

    expect(screen.getByText('Linen Napkin Set')).toBeInTheDocument();
  });

  it('shows a loading state before products arrive', () => {
    renderWithProviders(<ProductListing />, { route: '/products' });
    expect(screen.getByText(/Loading products/i)).toBeInTheDocument();
  });
});
