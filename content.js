// content.js - Chrome Extension Content Script

(async function() {
  const url = window.location.href;
  const configBase = "https://configurador.audi.pt/cc-pt/pt_PT_AUDI23/A/auv/";

  // Updated regex: matches model codes like A10, B30, 51B, etc.
  const modelMatch = url.match(/\/([A-B]?\d{2}[A-B]?)\/|\/([A-B]?\d{2}[A-B]?)\?/);

  if (!modelMatch) return console.warn("No model code found."); // Exit if no model code is found

  // Only the model code should be captured here (either group 1 or group 2)
  const modelCode = modelMatch[1] || modelMatch[2];
  console.log(`Detected Model Code: ${modelCode}`); // Should log only the model code like A10, B30, etc.

  // Fetch the corresponding model path from the Cloudflare Worker API
  const response = await fetch(`https://my-worker.davidsousanunes41.workers.dev/?model=${modelCode}`);
  if (!response.ok) return console.warn("Failed to fetch model from database.");

  const data = await response.json();
  if (!data.modelPath) return console.warn("Model path not found in database.");
  
  // Construct the 3D model viewer URL
  const modelViewerUrl = `https://3dmodels-7c1.pages.dev/viewer.html?model=${encodeURIComponent(data.modelPath)}`;
  
  // Generate the QR code dynamically
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(modelViewerUrl)}`;
  
  // Inject the QR code into the webpage
  injectQRCode(qrCodeUrl);
})();

function injectQRCode(qrCodeUrl) {
  const qrImg = document.createElement("img");
  qrImg.src = qrCodeUrl;
  qrImg.style.position = "fixed";
  qrImg.style.bottom = "20px";
  qrImg.style.right = "20px";
  qrImg.style.zIndex = "300000";
  qrImg.style.width = "150px";
  qrImg.style.height = "150px";
  document.body.appendChild(qrImg);
}
