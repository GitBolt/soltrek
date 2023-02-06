let nodeIdCounter = 0;
export const createNodeId = () => {
    return "node-" + (++nodeIdCounter);
};

export const createNodePos = () => {
    return { x: ((Math.random() * 200) + 800), y: (Math.random() * 100) };
};


let handleCounter = 0;
export const createHandleId = () => {
    return "handle" + (++handleCounter);
};