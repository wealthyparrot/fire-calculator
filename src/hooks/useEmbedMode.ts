import { useMemo } from 'react';

export function useEmbedMode(): { isEmbedded: boolean } {
    const isEmbedded = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('embed') === 'true';
    }, []);

    return { isEmbedded };
}
