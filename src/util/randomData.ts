let nodeIdCounter = 0;
export const createNodeId = () => {
    return "node-" + (++nodeIdCounter);
};

export const createNodePos = () => {
    return { x: ((Math.random() * 800) + 700), y: (Math.random() * 200) };
};


let handleCounter = 0;
export const createHandleId = () => {
    return "handle" + (++handleCounter);
};