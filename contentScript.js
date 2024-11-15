function isPasswordField(input) {
  return (input.type === 'password' || input.name === 'password' || input.name === 'Password') && input.type != 'hidden';
}

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

async function addButtonsToPasswordFields() {
  if(buttonmade==1){return;}
  const passwordFields = Array.from(document.querySelectorAll('input'))
    .filter(isPasswordField);

    passwordFields.forEach((passwordField) => {
      buttonmade=1
      const button = document.createElement('button');
      button.innerText = '🔒';
      button.style.position = 'absolute';
      button.style.top = (passwordField.offsetTop + passwordField.offsetHeight/2) + 'px';
      button.style.left = (passwordField.offsetLeft - 10) + 'px';
      button.style.backgroundColor = 'transparent';
      button.style.border = 'none';
      button.type = 'button';
      button.style.cursor = 'pointer';
      button.style.fontSize = '16px';
      button.style.zIndex = '2';

      button.addEventListener('click', () => {
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
      passwordField.parentNode.insertBefore(button, passwordField.nextSibling);
      console.log(passwordField.getBoundingClientRect().top + " \n");
      console.log(passwordField.getBoundingClientRect().right + " \n\n");
      console.log(button.getBoundingClientRect().top + " \n");
      console.log(button.getBoundingClientRect().right + " \n");
    }
  );
}

function throttle(fn, wait) {
  let timeout = null;
  return function (...args) {
      if (timeout) return;
      timeout = setTimeout(() => {
          fn.apply(this, args);
          timeout = null;
      }, wait);
  };
}

const observer = new MutationObserver(throttle(() => {
  addButtonsToPasswordFields();
}, 1000)); 

observer.observe(document.body, {
  childList: true,
  subtree: true
});

buttonmade=0;
addButtonsToPasswordFields();