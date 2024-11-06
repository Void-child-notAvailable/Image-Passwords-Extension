function isPasswordField(input) {
  return input.type === 'password' || input.name === 'password' || input.name === 'Password';
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
      passwordField.style.position = 'absolute';
      hei=passwordField.offsetHeight;
      wid=passwordField.offsetWidth;
      console.log(wid);

      const button = document.createElement('button');
      button.innerText = '🔒';
      button.style.position = 'relative';
      button.style.top = '-'+hei/2+'px';
      button.style.right = '-'+wid+'px';
      button.style.transform = 'translateX(-50%)';
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
  // console.log("hi");
  addButtonsToPasswordFields();
}, 1000)); 

observer.observe(document.body, {
  childList: true,
  subtree: true
});

buttonmade=0;
addButtonsToPasswordFields();