import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import Wizard from './index';
import * as api from '../../services/api';

describe('Wizard - Submit Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should handle complete submit flow with progress states', async () => {
    const user = userEvent.setup();

    // Mock API responses
    const mockDepartments = [{ id: 1, name: 'Engineering' }];
    const mockLocations = [{ id: 1, name: 'Jakarta' }];
    const mockBasicInfoResponse = {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      department: 'Engineering',
      role: 'Engineer',
      employeeId: 'ENG-001',
    };

    const mockDetailsResponse = {
      id: 1,
      email: 'john@example.com',
      employeeId: 'ENG-001',
      photo: '',
      employmentType: 'Full-time',
      officeLocation: 'Jakarta',
      notes: '',
    };

    vi.mocked(api.departmentApi.getDepartments).mockResolvedValue(mockDepartments);
    vi.mocked(api.locationApi.getLocations).mockResolvedValue(mockLocations);
    vi.mocked(api.basicInfoApi.create).mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve(mockBasicInfoResponse), 100))
    );
    vi.mocked(api.detailsApi.create).mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve(mockDetailsResponse), 100))
    );

    render(<Wizard />);

    // STEP 1
    expect(screen.getByTestId('step1-title')).toBeInTheDocument();

    const fullNameInput = screen.getByTestId('fullName-input');
    await user.type(fullNameInput, 'John Doe');

    const emailInput = screen.getByTestId('email-input');
    await user.type(emailInput, 'john@example.com');

    const departmentSelect = screen.getByTestId('department-select');
    const departmentInput = departmentSelect.querySelector('input');
    await user.type(departmentInput!, 'Eng');
    await waitFor(() => {
      expect(api.departmentApi.getDepartments).toHaveBeenCalled();
    }, { timeout: 1000 });
    await waitFor(() => {
      const option = document.querySelector('.department__option');
      expect(option).toBeInTheDocument();
    });
    const engineeringOption = Array.from(document.querySelectorAll('.department__option'))
      .find(el => el.textContent === 'Engineering');
    await user.click(engineeringOption as HTMLElement);

    const roleSelect = screen.getByTestId('role-select');
    await user.selectOptions(roleSelect, 'Engineer');

    await waitFor(() => {
      const employeeIdInput = screen.getByTestId('employeeId-input');
      expect(employeeIdInput).toHaveValue('ENG-001');
    });

    const nextButton = screen.getByTestId('next-button');
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
    await user.click(nextButton);

    // STEP 2
    await waitFor(() => {
      expect(screen.getByTestId('step2-title')).toBeInTheDocument();
    });

    const employmentTypeSelect = screen.getByTestId('employmentType-select');
    await user.selectOptions(employmentTypeSelect, 'Full-time');

    const locationSelect = screen.getByTestId('location-select');
    const locationInput = locationSelect.querySelector('input');
    await user.type(locationInput!, 'Jak');

    await waitFor(() => {
      expect(api.locationApi.getLocations).toHaveBeenCalled();
    }, { timeout: 1000 });

    await waitFor(() => {
      const option = document.querySelector('.location__option');
      expect(option).toBeInTheDocument();
    });
    const jakartaOption = Array.from(document.querySelectorAll('.location__option'))
      .find(el => el.textContent === 'Jakarta');
    await user.click(jakartaOption as HTMLElement);

    // submit
    const submitButton = screen.getByTestId('submit-button');
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.basicInfoApi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'John Doe',
          email: 'john@example.com',
          department: 'Engineering',
          role: 'Engineer',
          employeeId: 'ENG-001',
        })
      );
    });

    await waitFor(() => {
      expect(api.detailsApi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'john@example.com',
          employeeId: 'ENG-001',
          employmentType: 'Full-time',
          officeLocation: 'Jakarta',
        })
      );
    });

    // verify all api being called
    expect(api.basicInfoApi.create).toHaveBeenCalledTimes(1);
    expect(api.detailsApi.create).toHaveBeenCalledTimes(1);
  });
});
