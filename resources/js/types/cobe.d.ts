declare module 'cobe' {
    interface COBEOptions {
        devicePixelRatio?: number;
        width: number;
        height: number;
        phi?: number;
        theta?: number;
        dark?: number;
        diffuse?: number;
        scale?: number;
        mapSamples?: number;
        mapBrightness?: number;
        baseColor?: [number, number, number];
        markerColor?: [number, number, number];
        glowColor?: [number, number, number];
        offset?: [number, number];
        markers?: { location: [number, number]; size: number; color?: [number, number, number]; id?: string }[];
        arcs?: { from: [number, number]; to: [number, number]; color?: [number, number, number]; id?: string }[];
        arcColor?: [number, number, number];
        arcWidth?: number;
        arcHeight?: number;
        markerElevation?: number;
        onRender?: (state: {
            [x: string]: number; phi: number
        }) => void;
    }

    interface Globe {
        destroy: () => void;
    }

    function createGlobe(canvas: HTMLCanvasElement, options: COBEOptions): Globe;
    export default createGlobe;
}
