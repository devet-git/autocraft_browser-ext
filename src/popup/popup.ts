document.getElementById('click')?.addEventListener('click', () => {
  const x = (document.getElementById('x') as HTMLInputElement)?.value;
  const y = (document.getElementById('y') as HTMLInputElement)?.value;
  const statusEl = document.getElementById('status') as HTMLElement;
  statusEl.innerText = 'Đang gửi lệnh...';

  fetch('http://localhost:5000/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x: Number(x), y: Number(y) }),
  })
    .then((res) => res.json())
    .then((data) => {
      (document.getElementById('status') as HTMLElement).innerText =
        '✅ Clicked at (' + data.x + ', ' + data.y + ')';
      console.log('✅ Clicked at (' + data.x + ', ' + data.y + ')');
    })
    .catch((err) => {
      (document.getElementById('status') as HTMLElement).innerText =
        '❌ Lỗi kết nối tới API';
      console.error(err);
    });
});
