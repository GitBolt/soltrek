let nodeIdCounter = 0;
export const createNodeId = () => {
    return "node-" + (++nodeIdCounter);
};

export const createNodePos = () => {
    return { x: ((Math.random() * 80) + 5), y: (Math.random() * 10) - 400 };
};


let handleCounter = 0;
export const createHandleId = () => {
    return "handle" + (++handleCounter);
};