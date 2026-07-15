document.getElementById('for-resume').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const base64String = e.target.result; 

    chrome.storage.local.set({ 
      resume: {
        name: file.name,
        type: file.type,
        data: base64String
      } 
    }, function() {
      document.getElementById('status').innerText = `Saved: ${file.name}`;
      console.log('File successfully saved to chrome.storage.local');
    });
  };

  reader.readAsDataURL(file);
});

