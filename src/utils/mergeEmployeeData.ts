import type { BasicInfo, Details, Employee } from '../types';

/**
 * Merges BasicInfo and Details arrays by email or employeeId
 * Handles missing data gracefully
 */
export function mergeEmployeeData(
  basicInfoList: BasicInfo[],
  detailsList: Details[]
): Employee[] {
  const employees: Employee[] = [];

  // Create a map of details by email and employeeId for quick lookup
  const detailsMap = new Map<string, Details>();
  detailsList.forEach((detail) => {
    detailsMap.set(detail.email, detail);
    detailsMap.set(detail.employeeId, detail);
  });

  // Merge basicInfo with details
  basicInfoList.forEach((basicInfo) => {
    // Try to find matching details by email first, then by employeeId
    const matchingDetail =
      detailsMap.get(basicInfo.email) ||
      detailsMap.get(basicInfo.employeeId);

    const employee: Employee = {
      ...basicInfo,
      photo: matchingDetail?.photo,
      employmentType: matchingDetail?.employmentType,
      officeLocation: matchingDetail?.officeLocation,
      notes: matchingDetail?.notes,
    };

    employees.push(employee);
  });

  return employees;
}
