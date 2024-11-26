import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const GoogleLogin = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const code = searchParams.get("code");
        if (code) {
            console.log("Code received:", code);
            handleGoogleCallback(code);
        } else {
            console.error("No code found in URL");
            alert("Invalid Google callback");
            setLoading(false);
        }
    }, [searchParams]);

    const handleGoogleCallback = async (code) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/auth/google/callback/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                throw new Error("Failed to exchange code for tokens");
            }

            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);

            window.location.href = "/dashboard";
        } catch (error) {
            console.error("Error during Google login:", error);
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return <div>{loading ? "Processing Google Login..." : "Failed to process login. Please try again."}</div>;
};

export default GoogleLogin;
