import { Spinner, Table, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeList } from '../../hooks/useEmployeeList';
import { usePagination } from '../../hooks/usePagination';
import { clearDraft } from '../../hooks/useDraftAutoSave';
import styles from './styles.module.css';

export default function EmployeeList() {
  const navigate = useNavigate();
  const { employees, loading, error } = useEmployeeList();
  const {
    paginatedItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({ items: employees, itemsPerPage: 10 });

  const handleAddEmployee = () => {
    clearDraft('admin');
    navigate('/wizard?role=admin');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spinner size="xl" />
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Employees</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className={styles.container}>
        <h1>Employee List</h1>
        <p>No employees found.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Employee List</h1>
          <p className={styles.count}>Total: {employees.length} employees</p>
        </div>
        <Button onClick={handleAddEmployee} colorPalette="blue" size="md">
          + Add Employee
        </Button>
      </div>

      <Table.Root variant="outline" striped>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Photo</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Department</Table.ColumnHeader>
            <Table.ColumnHeader>Role</Table.ColumnHeader>
            <Table.ColumnHeader>Location</Table.ColumnHeader>
            <Table.ColumnHeader>Employment Type</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedItems.map((employee) => (
            <Table.Row key={employee.employeeId}>
              <Table.Cell>{employee.employeeId}</Table.Cell>
              <Table.Cell>
                {employee.photo ? (
                  <img
                    src={employee.photo}
                    alt={employee.fullName}
                    className={styles.thumbnail}
                  />
                ) : (
                  <div className={styles.noPhoto}>No Photo</div>
                )}
              </Table.Cell>
              <Table.Cell>{employee.fullName}</Table.Cell>
              <Table.Cell>{employee.email}</Table.Cell>
              <Table.Cell>{employee.department}</Table.Cell>
              <Table.Cell>{employee.role}</Table.Cell>
              <Table.Cell>{employee.officeLocation || '-'}</Table.Cell>
              <Table.Cell>{employee.employmentType || '-'}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, employees.length)} of {employees.length}
          </div>
          <div className={styles.paginationControls}>
            <Button
              onClick={previousPage}
              disabled={!hasPreviousPage}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>

            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => goToPage(page)}
                  variant={page === currentPage ? 'solid' : 'outline'}
                  colorPalette={page === currentPage ? 'blue' : 'gray'}
                  size="sm"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              onClick={nextPage}
              disabled={!hasNextPage}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}