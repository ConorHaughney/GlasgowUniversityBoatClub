"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, MoveHorizontal, MoveVertical, ZoomIn, ZoomOut } from "lucide-react";

type CommitteePhotoCropModalProps = {
    isOpen: boolean;
    imageSrc: string | null;
    fileName: string;
    onCancel: () => void;
    onConfirm: (file: File, previewUrl: string) => void;
};

const CROPPER_WIDTH = 320;
const CROPPER_HEIGHT = 400; // 4:5 aspect ratio
const OUTPUT_WIDTH = 800;
const OUTPUT_HEIGHT = 1000;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function CommitteePhotoCropModal({
    isOpen,
    imageSrc,
    fileName,
    onCancel,
    onConfirm,
}: CommitteePhotoCropModalProps) {
    const [zoom, setZoom] = useState(1);
    const [panXPercent, setPanXPercent] = useState(0);
    const [panYPercent, setPanYPercent] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [modalError, setModalError] = useState("");

    const imageRef = useRef<HTMLImageElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onCancel();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onCancel]);

    useEffect(() => {
        if (!isOpen) return;
        setZoom(1);
        setPanXPercent(0);
        setPanYPercent(0);
        setImageLoaded(false);
        setExporting(false);
        setModalError("");
    }, [imageSrc, isOpen]);

    const sourceRect = useMemo(() => {
        const img = imageRef.current;
        if (!img) return null;

        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;

        if (!naturalWidth || !naturalHeight) return null;

        const baseScale = Math.max(CROPPER_WIDTH / naturalWidth, CROPPER_HEIGHT / naturalHeight);
        const displayWidth = naturalWidth * baseScale * zoom;
        const displayHeight = naturalHeight * baseScale * zoom;

        const maxPanX = Math.max(0, (displayWidth - CROPPER_WIDTH) / 2);
        const maxPanY = Math.max(0, (displayHeight - CROPPER_HEIGHT) / 2);

        const panX = (panXPercent / 100) * maxPanX;
        const panY = (panYPercent / 100) * maxPanY;

        const imageLeft = (CROPPER_WIDTH - displayWidth) / 2 + panX;
        const imageTop = (CROPPER_HEIGHT - displayHeight) / 2 + panY;

        const sourceX = (-imageLeft * naturalWidth) / displayWidth;
        const sourceY = (-imageTop * naturalHeight) / displayHeight;
        const sourceWidth = (CROPPER_WIDTH * naturalWidth) / displayWidth;
        const sourceHeight = (CROPPER_HEIGHT * naturalHeight) / displayHeight;

        return {
            sourceX: Math.max(0, Math.min(naturalWidth - sourceWidth, sourceX)),
            sourceY: Math.max(0, Math.min(naturalHeight - sourceHeight, sourceY)),
            sourceWidth,
            sourceHeight,
        };
    }, [zoom, panXPercent, panYPercent, imageLoaded]);

    useEffect(() => {
        if (!isOpen || !imageLoaded || !sourceRect) return;

        const canvas = previewCanvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, CROPPER_WIDTH, CROPPER_HEIGHT);
        ctx.drawImage(
            img,
            sourceRect.sourceX,
            sourceRect.sourceY,
            sourceRect.sourceWidth,
            sourceRect.sourceHeight,
            0,
            0,
            CROPPER_WIDTH,
            CROPPER_HEIGHT
        );
    }, [isOpen, imageLoaded, sourceRect]);

    const onImageLoad = () => {
        setModalError("");
        setImageLoaded(true);
    };

    const onImageError = () => {
        setImageLoaded(false);
        setModalError("Could not load this image for editing. Please upload a new image file.");
    };

    const buildOutputFileName = () => {
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "") || "committee-photo";
        return `${nameWithoutExt}.jpg`;
    };

    const exportCroppedImage = async () => {
        if (!imageRef.current || !sourceRect) return;

        setExporting(true);
        setModalError("");
        try {
            const outputCanvas = document.createElement("canvas");
            outputCanvas.width = OUTPUT_WIDTH;
            outputCanvas.height = OUTPUT_HEIGHT;
            const ctx = outputCanvas.getContext("2d");
            if (!ctx) throw new Error("Unable to initialize image canvas");

            ctx.drawImage(
                imageRef.current,
                sourceRect.sourceX,
                sourceRect.sourceY,
                sourceRect.sourceWidth,
                sourceRect.sourceHeight,
                0,
                0,
                OUTPUT_WIDTH,
                OUTPUT_HEIGHT
            );

            const blob = await new Promise<Blob>((resolve, reject) => {
                outputCanvas.toBlob(
                    (nextBlob) => {
                        if (!nextBlob) {
                            reject(new Error("Failed to generate cropped image"));
                            return;
                        }
                        resolve(nextBlob);
                    },
                    "image/jpeg",
                    0.9
                );
            });

            const file = new File([blob], buildOutputFileName(), {
                type: "image/jpeg",
                lastModified: Date.now(),
            });

            const previewUrl = URL.createObjectURL(blob);
            onConfirm(file, previewUrl);
        } catch {
            setModalError("Could not export crop from this image. Please upload a new image file and try again.");
        } finally {
            setExporting(false);
        }
    };

    if (!isOpen || !imageSrc) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-[#0f0f0f] border border-gray-800 rounded-xl shadow-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-1">Crop Committee Photo</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Use zoom and position controls for a 4:5 portrait crop.
                </p>

                {modalError && (
                    <div className="p-3 mb-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-sm">
                        {modalError}
                    </div>
                )}

                <div className="flex justify-center mb-4">
                    <canvas
                        ref={previewCanvasRef}
                        width={CROPPER_WIDTH}
                        height={CROPPER_HEIGHT}
                        className="border border-[#ffdc36] rounded-lg bg-black"
                    />
                </div>

                {/* Hidden source image for canvas drawing */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageSrc}
                    alt="Crop source"
                    crossOrigin="anonymous"
                    ref={imageRef}
                    onLoad={onImageLoad}
                    onError={onImageError}
                    className="hidden"
                />

                <div className="space-y-4 mb-6">
                    <div>
                        <label
                            htmlFor="crop-zoom"
                            className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                        >
                            Zoom
                        </label>
                        <div className="flex items-center gap-3">
                            <ZoomOut size={16} className="text-gray-400" />
                            <input
                                id="crop-zoom"
                                type="range"
                                min={MIN_ZOOM}
                                max={MAX_ZOOM}
                                step={0.01}
                                value={zoom}
                                onChange={(event) => setZoom(Number(event.target.value))}
                                className="w-full accent-[#ffdc36]"
                            />
                            <ZoomIn size={16} className="text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="crop-pan-x"
                            className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                        >
                            Horizontal Position
                        </label>
                        <div className="flex items-center gap-3">
                            <MoveHorizontal size={16} className="text-gray-400" />
                            <input
                                id="crop-pan-x"
                                type="range"
                                min={-100}
                                max={100}
                                step={1}
                                value={panXPercent}
                                onChange={(event) => setPanXPercent(Number(event.target.value))}
                                className="w-full accent-[#ffdc36]"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="crop-pan-y"
                            className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                        >
                            Vertical Position
                        </label>
                        <div className="flex items-center gap-3">
                            <MoveVertical size={16} className="text-gray-400" />
                            <input
                                id="crop-pan-y"
                                type="range"
                                min={-100}
                                max={100}
                                step={1}
                                value={panYPercent}
                                onChange={(event) => setPanYPercent(Number(event.target.value))}
                                className="w-full accent-[#ffdc36]"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={exporting}
                        className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={exportCroppedImage}
                        disabled={exporting || !imageLoaded}
                        className="px-4 py-2 rounded-lg bg-[#ffdc36] text-black font-bold hover:bg-[#e6c229] disabled:opacity-60 inline-flex items-center gap-2"
                    >
                        {exporting && <Loader2 className="animate-spin" size={16} />}
                        {exporting ? "Cropping..." : "Use Crop"}
                    </button>
                </div>
            </div>
        </div>
    );
}
