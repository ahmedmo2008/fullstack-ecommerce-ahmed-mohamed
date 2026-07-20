import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from './testUtils';
import CartPage from '../pages/CartPage';

describe('CartPage', () => {
  it('shows an empty cart message when there are no items', async () => {
    renderWithProviders(<CartPage />, { route: '/cart' });

    await waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
  });
});
