document.getElementById("pdf").addEventListener("click", async function() {
    const url = document.getElementById("pdfurl").value.trim();
    const msg = document.getElementById("msg");

    if (!url) {
        msg.textContent = "Please enter a valid URL";
        return;
    }


    try {
        msg.textContent = "Starting download...";

        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

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
        msg.textContent = "Error: The server might be blocking us due to CORS policy, hence we can not download it.";
    }
});