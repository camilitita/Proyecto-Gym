import React, { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import axios from "axios";
import "./escaneoQR.css";

export default function EscaneoQR() {
    const videoRef = useRef(null);
    const [escaneando, setEscaneando] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const codeReaderRef = useRef(new BrowserMultiFormatReader());

    const detenerCamara = useCallback(() => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        codeReaderRef.current.reset();
    }, []);

    const tick = useCallback(() => {
        codeReaderRef.current
            .decodeOnceFromVideoDevice(selectedDeviceId, videoRef.current)
            .then(async (result) => {
                if (result) {
                    setEscaneando(false);
                    detenerCamara();
                    try {
                        const res = await axios.post("http://localhost:5001/api/access/validate", {
                            qr_code: result.getText(),
                        });
                        setResultado({ status: "success", data: res.data });
                    } catch (error) {
                        setResultado({
                            status: "error",
                            message: error.response?.data?.message || "Error al validar acceso",
                        });
                    }
                }
            })
            .catch((err) => console.error("Error escaneo:", err));
    }, [detenerCamara, selectedDeviceId]);

    const iniciarCamara = useCallback(async () => {
        try {
            setResultado(null);
            await navigator.mediaDevices.getUserMedia({ video: true });
            requestAnimationFrame(tick);
        } catch (error) {
            console.error("Error al iniciar cámara:", error);
            setResultado({ status: "error", message: "No se pudo acceder a la cámara" });
        }
    }, [tick]);

    useEffect(() => {
        codeReaderRef.current.listVideoInputDevices().then((videoInputDevices) => {
            setDevices(videoInputDevices);
            if (videoInputDevices.length > 0) {
                setSelectedDeviceId(videoInputDevices[0].deviceId);
            }
        });
        return detenerCamara;
    }, [detenerCamara]);

    useEffect(() => {
        if (escaneando) {
            iniciarCamara();
        }
    }, [escaneando, iniciarCamara]);

    return (
        <div className="escaneo-qr">
            <h2>Escaneo de QR</h2>

            {!escaneando && (
                <>
                    <select
                        className="select-camera"
                        value={selectedDeviceId}
                        onChange={(e) => setSelectedDeviceId(e.target.value)}
                    >
                        {devices.map((device, index) => (
                            <option key={index} value={device.deviceId}>
                                {device.label || `Cámara ${index + 1}`}
                            </option>
                        ))}
                    </select>
                    <button className="btn-scan" onClick={() => setEscaneando(true)}>
                        Iniciar escaneo
                    </button>
                </>
            )}

            {escaneando && <video ref={videoRef} autoPlay muted playsInline />}

            {resultado && (
                <div className={`resultado ${resultado.status}`}>
                    {resultado.status === "success" ? (
                        <>
                            <p>✅ {resultado.data.message}</p>
                            <p>👤 {resultado.data.name}</p>
                            <p>📧 {resultado.data.email}</p>
                            <p>📅 Membresía hasta: {resultado.data.end_date}</p>
                        </>
                    ) : (
                        <p>❌ {resultado.message}</p>
                    )}
                </div>
            )}
        </div>
    );
}
