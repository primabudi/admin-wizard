import { Link } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

export default function Home() {
  return (
    <div>
      <h1>Admin Wizard - Home</h1>
      <p>Welcome to the Employee Management System</p>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <Link to="/wizard?role=admin">
          <Button>Add Employee (Admin)</Button>
        </Link>
        <Link to="/wizard?role=ops">
          <Button>Add Employee (Ops)</Button>
        </Link>
        <Link to="/employees">
          <Button>View Employees</Button>
        </Link>
      </div>
    </div>
  );
}
