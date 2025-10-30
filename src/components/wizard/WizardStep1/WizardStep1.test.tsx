import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../../test/utils';
import WizardStep1 from './index';
import * as api from '../../../services/api';

describe('WizardStep1 - Department Autocomplete Integration', () => {
  const mockOnNext = vi.fn();
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render autocomplete and fetch departments correctly', async () => {
    vi.useRealTimers();

    const mockDepartments = [
      { id: 1, name: 'Engineering' },
      { id: 2, name: 'Operations' },
      { id: 3, name: 'Finance' },
    ];
    vi.mocked(api.departmentApi.getDepartments).mockResolvedValue(mockDepartments);

    render(
      <WizardStep1
        onNext={mockOnNext}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByTestId('step1-title')).toBeInTheDocument();
    const departmentSelect = screen.getByTestId('department-select');
    expect(departmentSelect).toBeInTheDocument();
    const departmentInput = departmentSelect.querySelector('input');
    expect(departmentInput).toBeInTheDocument();

    // Simulate user typing into the autocomplete
    fireEvent.mouseDown(departmentInput!);
    fireEvent.focus(departmentInput!);
    fireEvent.keyDown(departmentInput!, { key: 'E' });
    fireEvent.input(departmentInput!, { target: { value: 'Eng' } });

    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 600));

    // Wait for API call
    await waitFor(
      () => {
        expect(api.departmentApi.getDepartments).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );

    // Wait for options to appear
    await waitFor(() => {
      const options = screen.getAllByText('Engineering');
      expect(options.length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText('Engineering').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Operations').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Finance').length).toBeGreaterThan(0);

    const engineeringOptions = screen.getAllByText('Engineering');
    fireEvent.click(engineeringOptions[0]);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          department: 'Engineering',
        })
      );
    });
  });
});
