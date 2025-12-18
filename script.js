let html5QrCode;
let scanning = false;

const scanBtn = document.getElementById("scan-btn");

scanBtn.addEventListener("click", () => {
  if (scanning) return;

  html5QrCode = new Html5Qrcode("reader");
  scanning = true;

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScanSuccess,
    () => {}
  );
});

function onScanSuccess(decodedText) {
  html5QrCode.stop().then(() => {
    scanning = false;

    const trackId = extractTrackId(decodedText);
    if (!trackId) {
      alert("Geen geldige Spotify-link");
      restartScanner();
      return;
    }

    window.location.href = `spotify:track:${trackId}`;

    setTimeout(() => {
      restartScanner();
    }, 2000); // genoeg tijd om Spotify te openen
  });
}

function restartScanner() {
  if (!html5QrCode) return;

  scanning = true;
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScanSuccess,
    () => {}
  );
}

function extractTrackId(text) {
  if (text.includes("spotify.com/track/")) {
    return text.split("track/")[1].split("?")[0];
  }
  if (text.startsWith("spotify:track:")) {
    return text.split("spotify:track:")[1];
  }
  return null;
}
