import EmployeeLayout from '@/components/EmployeeLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeLayout>{children}</EmployeeLayout>
        </ProtectedRoute>
    );
}
