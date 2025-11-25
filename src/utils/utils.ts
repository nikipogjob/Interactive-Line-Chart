import { EXPORT_BG_FALLBACK } from "../const";

export function getCssVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function exportSvgElementToPng(
    svg: SVGSVGElement,
    bgCssVarName: string,
    filename: string,
) {
    const rect = svg.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (!width || !height) return;

    const serializer = new XMLSerializer();
    let svgData = serializer.serializeToString(svg);

    if (!svgData.includes('http://www.w3.org/2000/svg')) {
        svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            URL.revokeObjectURL(url);
            return;
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const rootStyles = getComputedStyle(document.documentElement);
        const bgColor = rootStyles.getPropertyValue(bgCssVarName).trim() || EXPORT_BG_FALLBACK;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
            if (!blob) return;

            const pngUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(pngUrl);
        }, 'image/png');
    };

    img.onerror = () => {
        URL.revokeObjectURL(url);
    };

    img.src = url;
}
