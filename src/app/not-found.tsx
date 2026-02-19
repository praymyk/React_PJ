import Link from 'next/link';
import { FaTools } from 'react-icons/fa';

export default function NotFound() {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc',
            textAlign: 'center', padding: '2rem'
        }}>
            <FaTools size={64} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                페이지를 준비 중이거나 찾을 수 없습니다.
            </h1>
            <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.125rem', lineHeight: '1.5' }}>
                이용에 불편을 드려 죄송합니다.<br />
                요청하신 페이지가 아직 개발 중이거나 주소가 변경되었을 수 있습니다.
            </p>
            <Link
                href="/palace"
                style={{
                    padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: 'white',
                    borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '600',
                    transition: 'background-color 0.2s'
                }}
            >
                대시보드로 돌아가기
            </Link>
        </div>
    );
}