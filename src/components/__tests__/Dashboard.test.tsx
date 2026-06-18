import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '../../context/AppContext';
import { Dashboard } from '../../pages/Dashboard';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorage.clear();
    // Set query params to force mock data usage
    window.history.pushState({}, '', '?mock=true');
  });

  it('renders dashboard with mock user and correct hotspot metrics', async () => {
    const setCurrentPage = vi.fn();

    render(
      <AppProvider>
        <Dashboard setCurrentPage={setCurrentPage} />
      </AppProvider>
    );

    // Verify welcome banner
    expect(screen.getByText(/Welcome back, Eco Warrior/i)).toBeInTheDocument();

    // Verify gauge headers
    expect(screen.getByText(/Weekly Carbon Budget/i)).toBeInTheDocument();
    expect(screen.getByText(/Eco twin Score/i)).toBeInTheDocument();

    // Verify Highest Carbon Hotspot detection
    // With mock data, Transportation is highest (4504 kg CO2)
    expect(screen.getByText(/Highest Carbon Hotspot/i)).toBeInTheDocument();
    expect(screen.getByText(/Transportation/i)).toBeInTheDocument();

    // Verify active challenges are rendered (up to 3)
    expect(screen.getByText(/Active Challenges/i)).toBeInTheDocument();
    expect(screen.getByText(/Car-Free Day/i)).toBeInTheDocument();
    expect(screen.getByText(/Veg Out/i)).toBeInTheDocument();
  });

  it('toggles the quick log menu and allows logging a habit', async () => {
    const setCurrentPage = vi.fn();

    render(
      <AppProvider>
        <Dashboard setCurrentPage={setCurrentPage} />
      </AppProvider>
    );

    // Get the floating leaf button
    const leafButton = screen.getByRole('button', { name: /Quick log carbon reduction habit/i });
    expect(leafButton).toBeInTheDocument();

    // Click to open quick log menu
    fireEvent.click(leafButton);

    // Verify menu title is visible
    expect(screen.getByText(/Quick Log Habits/i)).toBeInTheDocument();

    // Click on a habit option: "Ate Vegan/Vegetarian meal"
    const vegMealOption = screen.getByText(/Ate Vegan\/Vegetarian meal/i);
    expect(vegMealOption).toBeInTheDocument();

    fireEvent.click(vegMealOption);

    // Verify that the menu closes
    expect(screen.queryByText(/Quick Log Habits/i)).not.toBeInTheDocument();
  });
});
