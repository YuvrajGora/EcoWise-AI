import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const ProblematicComponent = () => {
  throw new Error('Test rendering error');
};

describe('ErrorBoundary Component', () => {
  let consoleErrorMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Prevent the console.error output from polluting test logs
    consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe Content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('catches render error, displays warning UI, and shows error message details', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/Test rendering error/i)).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
    expect(screen.getByText('Reset Data')).toBeInTheDocument();
  });

  it('provides a reload button that calls location.reload', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true
    });

    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    const reloadBtn = screen.getByText('Reload Page');
    fireEvent.click(reloadBtn);
    expect(reloadMock).toHaveBeenCalled();
  });

  it('provides a reset data button that triggers confirm and clears localstorage', () => {
    const confirmMock = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    const clearMock = vi.spyOn(Storage.prototype, 'clear');
    
    // Mock location.href property changes
    const originalLocation = window.location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).location = { href: '', pathname: '/test-path' } as any;

    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    const resetBtn = screen.getByText('Reset Data');
    fireEvent.click(resetBtn);

    expect(confirmMock).toHaveBeenCalled();
    expect(clearMock).toHaveBeenCalled();
    expect(window.location.href).toBe('/test-path');

    // Restore original window location
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).location = originalLocation as any;
    confirmMock.mockRestore();
    clearMock.mockRestore();
  });
});
