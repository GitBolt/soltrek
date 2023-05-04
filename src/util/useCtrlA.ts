import { useState, useEffect } from 'react';

const useCtrlA = () => {
    const [isCtrlAPressed, setIsCtrlAPressed] = useState('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'a' && (event.target instanceof HTMLInputElement)) {
                setIsCtrlAPressed('false' + "-" + Math.random());
            } else if ((event.ctrlKey || event.metaKey) && event.key === 'a' && !(event.target instanceof HTMLInputElement)) {
                setIsCtrlAPressed('true' + "-" + Math.random());
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    return isCtrlAPressed
};

export default useCtrlA;
