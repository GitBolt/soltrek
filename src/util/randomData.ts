let nodeIdCounter = 0;

export const createNodeId = () => {
    return "node-" + (++nodeIdCounter);
};

export const createNodePos = () => {
    return { x: ((Math.random() * 500) + 300), y: (Math.random() * 300) + 0 };
};


let handleCounter = 0;
export const createHandleId = () => {
    return "handle" + (++handleCounter);
};