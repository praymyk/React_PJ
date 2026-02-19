import MainLayout from '@components/layout/main/MainLayout';
import AuthGuard from '@components/auth/AuthGuard';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <MainLayout>{children}</MainLayout>
        </AuthGuard>
    );
}