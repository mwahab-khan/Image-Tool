document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('prompt-input');
    const aspectRatioRadios = document.querySelectorAll('input[name="aspect-ratio"]');
    const referenceImageUpload = document.getElementById('reference-image-upload');
    const imagePreview = document.getElementById('image-preview');
    const imagePreviewImg = imagePreview.querySelector('img');
    const imagePreviewText = imagePreview.querySelector('p');
    const generateBtn = document.getElementById('generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const generatedImage = document.getElementById('generated-image');
    const placeholderText = document.getElementById('placeholder-text');
    const downloadBtn = document.getElementById('download-btn');
    const imageDisplay = document.getElementById('image-display');

    let uploadedReferenceImage = null; // To store base64 or file object of the reference image

    // --- Event Listeners ---

    // Reference Image Upload Preview
    referenceImageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file type
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                alert('Please upload a JPG or PNG image.');
                referenceImageUpload.value = ''; // Clear the input
                imagePreviewImg.style.display = 'none';
                imagePreviewText.style.display = 'block';
                imagePreviewImg.src = '#';
                uploadedReferenceImage = null;
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviewImg.src = e.target.result;
                imagePreviewImg.style.display = 'block';
                imagePreviewText.style.display = 'none';
                uploadedReferenceImage = e.target.result; // Store as base64 for potential use
            };
            reader.readAsDataURL(file);
        } else {
            imagePreviewImg.style.display = 'none';
            imagePreviewText.style.display = 'block';
            imagePreviewImg.src = '#';
            uploadedReferenceImage = null;
        }
    });

    // Generate Image Button Click
    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        const selectedAspectRatio = document.querySelector('input[name="aspect-ratio"]:checked').value;

        // Reset previous states
        hideAllMessages();
        generatedImage.style.display = 'none';
        generatedImage.src = '#';
        downloadBtn.style.display = 'none';
        placeholderText.style.display = 'block';

        if (!prompt) {
            showErrorMessage('Please enter a valid image prompt.');
            return;
        }

        // Show loading spinner
        loadingSpinner.style.display = 'block';
        generateBtn.disabled = true;

        try {
            // --- IMPORTANT: API INTEGRATION POINT ---
            // This is where you would typically call your backend (e.g., a Vercel Serverless Function,
            // or a Node.js/Python server hosted on Replit) to interact with the image generation API.
            // Direct client-side calls to most AI image generation APIs are not secure or feasible
            // due to API key exposure and CORS restrictions.

            // Example of a hypothetical backend endpoint call:
            // const API_ENDPOINT = '/api/generate-image'; // For Vercel Functions or Replit backend
            const API_ENDPOINT_SIMULATED = 'https://picsum.photos/seed/'; // Using a free image service for simulation

            const requestBody = {
                prompt: prompt,
                aspect_ratio: selectedAspectRatio,
                reference_image: uploadedReferenceImage // Send base64 if available
            };

            console.log("Simulating API request with:", requestBody);

            // SIMULATION: Replace this with your actual fetch call to your backend
            // For demonstration, we'll simulate a delay and use a random image.
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

            let imageUrl = '';
            let width, height;

            switch (selectedAspectRatio) {
                case '1:1': // Square
                    width = 1080;
                    height = 1080;
                    break;
                case '9:16': // Portrait
                    width = Math.round(1080 * (9 / 16)); // ~608
                    height = 1080;
                    break;
                case '16:9': // Landscape
                    width = 1080;
                    height = Math.round(1080 * (9 / 16)); // ~608
                    break;
            }
            // Use a random seed based on prompt for somewhat "different" images
            const seed = prompt.length * 100 + Math.floor(Math.random() * 1000);
            imageUrl = `${API_ENDPOINT_SIMULATED}${seed}/${width}/${height}`;

            // --- END OF SIMULATION ---

            // Assuming a successful response from your backend containing the image URL
            // const response = await fetch(API_ENDPOINT, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(requestBody),
            // });

            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.message || 'Failed to generate image from API.');
            // }

            // const result = await response.json();
            // imageUrl = result.imageUrl; // Your backend would return the image URL


            generatedImage.src = imageUrl;
            generatedImage.onload = () => {
                placeholderText.style.display = 'none';
                generatedImage.style.display = 'block';
                downloadBtn.style.display = 'block';
                loadingSpinner.style.display = 'none';
                generateBtn.disabled = false;
            };
            generatedImage.onerror = () => {
                showErrorMessage('Failed to load generated image. Please try again.');
                generatedImage.style.display = 'none';
                placeholderText.style.display = 'block';
                loadingSpinner.style.display = 'none';
                generateBtn.disabled = false;
            };

        } catch (error) {
            console.error('Generation error:', error);
            showErrorMessage('Failed to generate image. Please try again. ' + (error.message || ''));
            loadingSpinner.style.display = 'none';
            generateBtn.disabled = false;
        }
    });

    // Download Image Button Click
    downloadBtn.addEventListener('click', async () => {
        const imageUrl = generatedImage.src;
        if (imageUrl && imageUrl !== '#') {
            try {
                // Fetch the image as a blob to ensure correct download
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `azan_world_image_${Date.now()}.png`; // Suggested filename
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } catch (error) {
                console.error('Download failed:', error);
                alert('Failed to download image. Please try again.');
            }
        }
    });

    // --- Helper Functions ---

    function showErrorMessage(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideAllMessages() {
        errorMessage.style.display = 'none';
    }
});
