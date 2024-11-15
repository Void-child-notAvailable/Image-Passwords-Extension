const togglePasswordButton = document.getElementById('toggle-password');
const passwordField = document.getElementById('password');
const toggleLockButton = document.getElementById('lock');

function simulateKeyboardInput(element, value) {
    element.focus();
    element.value = value;
    // nessesary for websites like riotgames login and maybe others?
    element.dispatchEvent(new Event('input', { bubbles: true }));
}

async function hash(imageData) {
    const encoder = new TextEncoder();
    const data = encoder.encode(imageData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

togglePasswordButton.addEventListener('click', () => {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        togglePasswordButton.textContent = 'Hide';
    } else {
        passwordField.type = 'password';
        togglePasswordButton.textContent = 'Show';
    }
});

toggleLockButton.addEventListener('click',()=>{
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', (event) => {
        event.stopPropagation();
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const imageData = e.target.result;
                const generatedPassword = await hash(imageData);
                simulateKeyboardInput(passwordField, generatedPassword);
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
});