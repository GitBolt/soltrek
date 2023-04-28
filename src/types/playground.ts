export interface PlaygroundSave {
    viewport: {x: number, y: number, zoom: number}
    nodes: any[],
    edges: any[]
}

export interface SavedPlaygroundType {
    preview_url: string,
    data: string,
    name: string,
    createdAt: string,
}