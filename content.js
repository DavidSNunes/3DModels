// content.js - Chrome Extension Content Script

(async function() {
  const url = window.location.href;
  const configBase = "https://configurador.audi.pt/cc-pt/pt_PT_AUDI23/A/auv/";
  const modelMatch = url.match(/A\d{2}/); // Extracts the model code (e.g., A61, A70)

  if (!modelMatch) return; // Exit if no model code is found
  
  const modelCode = modelMatch[0];
  console.log(`Detected Model Code: ${modelCode}`);

  // Fetch the corresponding model path from the Cloudflare Worker API
  const response = await fetch(`https://my-worker.davidsousanunes41.workers.dev/?model=${modelCode}`);
  if (!response.ok) return console.warn("Failed to fetch model from database.");

  const data = await response.json();
  if (!data.modelPath) return console.warn("Model path not found in database.");
  
  // Construct the 3D model viewer URL
  const modelViewerUrl = `https://3dmodels-7c1.pages.dev/viewer.html?model=${data.modelPath}`;
  
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
