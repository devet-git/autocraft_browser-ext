// Kiểu dữ liệu lưu trong storage
interface ExtensionSettings {
  color: string;
  apiKey: string;
  featureToggle: boolean;
}

// Truy cập phần tử DOM an toàn (có kiểu)
const colorSelect = document.getElementById('color') as HTMLSelectElement;
const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
const featureToggleCheckbox = document.getElementById(
  'featureToggle'
) as HTMLInputElement;
const saveButton = document.getElementById('save') as HTMLButtonElement;
const statusDiv = document.getElementById('status') as HTMLDivElement;

// 🧩 Load config từ storage
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(
    ['color', 'apiKey', 'featureToggle'],
    (data: Partial<ExtensionSettings>) => {
      if (data.color) colorSelect.value = data.color;
      if (data.apiKey) apiKeyInput.value = data.apiKey;
      featureToggleCheckbox.checked = !!data.featureToggle;
    }
  );
});

// 💾 Lưu config
saveButton.addEventListener('click', () => {
  const settings: ExtensionSettings = {
    color: colorSelect.value,
    apiKey: apiKeyInput.value.trim(),
    featureToggle: featureToggleCheckbox.checked,
  };

  chrome.storage.sync.set(settings, () => {
    statusDiv.textContent = '✅ Đã lưu cài đặt!';
    setTimeout(() => (statusDiv.textContent = ''), 1500);
  });
});
