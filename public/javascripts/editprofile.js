const changeButton = document.getElementById("changeButton");
const fileInput = document.getElementById("fileInput");

changeButton.addEventListener("click", function() {
    fileInput.click();
});

fileInput.addEventListener("change", function() {
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    const file = this.files[0];
    const fileName = file.name.toLowerCase();
    const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
    
    if (!allowedExtensions.includes(extension)) {
        document.getElementById("errorMessage").style.display = "block";
        this.value = "";
    } else {
        document.getElementById("uploadform").submit();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const saveButton = document.querySelector("#saveButton");

    saveButton.addEventListener("click", async function(event) {
        event.preventDefault();
        const newUsername = document.getElementById("username").value;

        try {
            const response = await fetch("/profile/edit-username", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newUsername: newUsername })
            });

            if (response.ok) {
                alert("Username updated successfully! You will be redirected to the login page.");
                window.location.href = "/login";
            } else {
                alert("Failed to update username. Please try again later.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const resetButton = document.querySelector("#resetButton");

    resetButton.addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("username").value = "";
        document.getElementById("last-name").value = "";
    });
});
