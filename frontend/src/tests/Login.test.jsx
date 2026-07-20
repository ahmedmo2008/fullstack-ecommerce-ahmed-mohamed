import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from './testUtils';
import Login from '../pages/Login';

describe('Login page', () => {
  it('logs in successfully with correct credentials', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />, { route: '/login' });

    await user.type(screen.getByLabelText(/email/i), 'customer@aterra.shop');
    await user.type(screen.getByLabelText(/password/i), 'Customer123!');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.queryByText(/could not log in/i)).not.toBeInTheDocument();
    });
  });

  it('shows an error message on invalid credentials', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />, { route: '/login' });

    await user.type(screen.getByLabelText(/email/i), 'wrong@aterra.shop');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });
});
