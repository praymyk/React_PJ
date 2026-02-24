import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
    sassOptions: {
        includePaths: [path.join(process.cwd(), 'src/styles')],
    },
    turbopack: {},
};

export default nextConfig;