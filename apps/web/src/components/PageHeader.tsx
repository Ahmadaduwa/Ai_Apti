import { type PropsWithChildren } from 'react';

export default function PageHeader({ children }: PropsWithChildren) {
    return <h2 className="text-2xl font-semibold mb-6">{children}</h2>;
}