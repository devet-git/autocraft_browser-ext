let maskVisible = false;

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'TOGGLE_MASK') {
    maskVisible ? removeMask() : createMask();
    maskVisible = !maskVisible;
  }
});

function createMask(): void {
  const mask = document.createElement('div');
  mask.id = 'extension-fullscreen-mask';
  Object.assign(mask.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: '2147483647', // cao nhất có thể
    cursor: 'pointer',
  });
  mask.addEventListener('click', removeMask);
  document.body.appendChild(mask);
}

function removeMask(): void {
  document.getElementById('extension-fullscreen-mask')?.remove();
}
