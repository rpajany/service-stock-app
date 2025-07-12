import { useEffect } from 'react';


export const useTitle = (title) => {

    useEffect(() => {
        document.title = `${title}  - Stock App`;
    }, [title]);

    return null;
}
