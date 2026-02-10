import {Suspense} from "react";

import DefaultContent from '@components/palace/test/ai-dignity-maintenance/DefaultContent';

export default function Page() {
    return (
        <Suspense>
            <DefaultContent />
        </Suspense>
    );
}