# Password Generator Chrome Extension
A Chrome extension that adds a button next to password fields on web pages, allowing users to generate a secure password using an image. The generated password is based on the SHA-256 hash of the selected image.

Features
•Automatically detects password fields on a webpage.
•Adds a 🔒 button next to password fields for password generation.
•Prompts users to select an image file when the button is clicked.
•Uses the SHA-256 hash of the image to generate a secure password.
•Simulates keyboard input to fill the generated password in the password field.

How It Works
•The extension detects all password fields (<input type="password">) on the current webpage.
•A button (🔒) is added next to each detected password field.
•When the button is clicked, the user is prompted to upload an image file.
•The image is read as a data URL, and the SHA-256 hash is generated.
•The generated hash is used as the password, which is automatically entered into the password field.

Installation
•Clone or download this repository.
•Open Chrome and go to chrome://extensions/.
•Enable Developer mode in the top-right corner.
•Click on Load unpacked and select the directory containing the extension files.

Technical Details
•SHA-256 Hashing: Uses the Web Crypto API for secure and fast hashing of the image data.

Limitations
•The generated password is entirely based on the image selected, which could result in inconsistent passwords if the same image is not used.
•Password generation relies on the user selecting an image file; if the same file is not used later, the password will not match.
