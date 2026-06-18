import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '../../context/AppContext';
import { CarbonSimulator } from '../../pages/CarbonSimulator';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CarbonSimulator Component', () => {
  beforeEach(() => {
    localStorage.clear();
    // Set query params to force mock data usage
    window.history.pushState({}, '', '?mock=true');
  });

  it('renders simulator controls and projection comparison charts', () => {
    render(
      <AppProvider>
        <CarbonSimulator />
      </AppProvider>
    );

    // Verify title and headers
    expect(screen.getByText(/EcoTwin Carbon Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Emissions Modulators/i)).toBeInTheDocument();
    expect(screen.getByText(/EcoTwin Future Comparison/i)).toBeInTheDocument();

    // Verify modulators are present
    expect(screen.getByLabelText(/Commuting Vehicle \/ Transit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weekly Commute Distance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Electricity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dietary Pattern/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weekly Trash Bags/i)).toBeInTheDocument();
  });

  it('updates simulated footprint calculations dynamically when inputs change', async () => {
    render(
      <AppProvider>
        <CarbonSimulator />
      </AppProvider>
    );

    // Get baseline distance (150 km)
    const distanceSlider = screen.getByLabelText(/Weekly Commute Distance/i) as HTMLInputElement;
    expect(distanceSlider.value).toBe('150');

    // Change distance slider to 0 km
    fireEvent.change(distanceSlider, { target: { value: '0' } });
    expect(distanceSlider.value).toBe('0');

    // Since we reduced travel distance, we should see savings
    expect(screen.getByText(/Simulated Savings Impact:/i)).toBeInTheDocument();

    // Change dietary pattern to Vegan
    const dietSelect = screen.getByLabelText(/Dietary Pattern/i) as HTMLSelectElement;
    expect(dietSelect.value).toBe('meat_heavy');
    fireEvent.change(dietSelect, { target: { value: 'vegan' } });
    expect(dietSelect.value).toBe('vegan');

    // Verify Reset Settings button resets the modulators
    const resetBtn = screen.getByRole('button', { name: /Reset Settings/i });
    fireEvent.click(resetBtn);

    // Verify restored to baseline values
    expect(distanceSlider.value).toBe('150');
    expect(dietSelect.value).toBe('meat_heavy');
  });
});
