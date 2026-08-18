import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Navbar } from '../Navbar';

describe('Navbar Component', () => {
  it('renders the StudySpark logo and navigation links', () => {
    render(<Navbar />);

    // Verify brand logo title is present
    expect(screen.getByText('StudySpark')).toBeInTheDocument();

    // Verify nav links are present
    expect(screen.getAllByRole('link', { name: /home/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /generate/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /study/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /health/i }).length).toBeGreaterThan(0);
  });

  it('toggles mobile menu open and closed when hamburger button is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const toggleButton = screen.getByRole('button', {
      name: /toggle navigation menu/i,
    });

    // Initially, mobile menu is closed
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open mobile menu
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    // Click again to close mobile menu
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes mobile menu when a nav link is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const toggleButton = screen.getByRole('button', {
      name: /toggle navigation menu/i,
    });

    // Open mobile menu
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    // Click a nav link inside the menu
    const generateLinks = screen.getAllByRole('link', { name: /generate/i });
    await user.click(generateLinks[generateLinks.length - 1]);

    // Menu should be closed
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });
});
