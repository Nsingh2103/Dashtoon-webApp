let panelCount = 0;

// Get the modal and buttons
const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const submitBtn = document.getElementById("submitBtn");
const panelTextInput = document.getElementById("panelTextInput");
const comicPanels = document.getElementById("comicPanels");
const errorContainer = document.getElementById("errorContainer");

// Function to open the modal
openModalBtn.addEventListener("click", () => {
  // Reset the value of the text box
  panelTextInput.value = "";
  modal.style.display = "block";
});

// Function to close the modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Function to handle text input and throw error if empty
submitBtn.addEventListener("click", () => {
  // Check if 10 panels are reached
  if (panelCount >= 10) {
    openModalBtn.disabled = true; // Disable the modal trigger button
  }

  const panelText = panelTextInput.value.trim();
  if (panelText === "") {
    errorContainer.innerHTML = "Text for the comic panel is required.";
  } else {
    // Do something with the panelText, for example, log it to the console
    console.log("Text for the comic panel:", panelText);

    // Increment the panel count
    panelCount++;

    // Make API request
    query({ inputs: panelText })
      .then((imageUrl) => {
        // Display the generated comic panel
        const img = document.createElement("img");
        img.src = URL.createObjectURL(imageUrl);
        img.alt = `Comic Panel ${panelCount}`;
        comicPanels.appendChild(img);
      })
      .catch((error) => {
        panelCount--;
        errorContainer.innerHTML = `Failed to generate comic panel: ${error.message}`;
      });
  }
  // Close the modal
  modal.style.display = "none";
});

// Close the modal if the user clicks outside of it
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

async function query(data) {
  try {
    const response = await fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        method: "POST",
        headers: {
          Accept: "image/png",
          Authorization:
            "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Failed to generate comic.");
    }

    const resultBlob = await response.blob();
    return resultBlob;
  } catch (error) {
    throw new Error("Failed to communicate with the server.");
  }
}
