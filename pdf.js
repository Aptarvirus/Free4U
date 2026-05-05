document.getElementById("pdf").addEventListener("click", async function() {
    const url = document.getElementById("pdfurl").value.trim();
    const msg = document.getElementById("msg");

    if (!url) {
        msg.textContent = "Please enter a valid URL";
        return;
    }

    // Helper function to get the CSRF token from cookies
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    try {
        msg.textContent = "Starting download...";

        const response = await fetch(url, {
            method: "POST", // CSRF protection is usually required for POST/PUT/DELETE
            headers: {
                "Content-Type": "application/json",
                // THE FIX: Include the CSRF token in the header
                "X-CSRF-TOKEN": getCookie("csrftoken") 
            },
            // Include credentials if the request is to your own domain
            credentials: "same-origin" 
        });

        if (!response.ok) throw new Error("Download failed");

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "file.pdf";
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        msg.textContent = "PDF downloaded successfully!";

    } catch (error) {
        console.error(error);
        msg.textContent = "Error: Check CORS policy or CSRF token validity.";
    }
});
