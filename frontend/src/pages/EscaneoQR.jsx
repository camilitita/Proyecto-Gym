import { useState } from "react";
import axios from "axios";

export default function EscaneoQR() {
    const [codigo, setCodigo] = useState("");
    const [mensaje, setMensaje] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCodigo(e.target.value);
    };

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const qrCode = codigo.trim();
            if (!qrCode) return;

            setLoading(true);
            setMensaje(null);

            try {
                console.log("📤 Enviando QR completo al backend:", qrCode);

                const res = await axios.post("http://localhost:5001/api/access/validate", {
                qr_code: qrCode
                });

                setMensaje(res.data.message || "Acceso validado");
            } catch (error) {
                setMensaje(
                    error.response?.data?.message || "Error validando el acceso"
                );
            } finally {
                setCodigo("");
                setLoading(false);
            }
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Escaneo de QR</h2>
            <input
                type="text"
                value={codigo}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoFocus
                style={{
                    padding: "10px",
                    fontSize: "18px",
                    width: "100%",
                    boxSizing: "border-box"
                }}
                placeholder="Escanea un código QR..."
            />
            {loading && <p>Validando acceso...</p>}
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}
