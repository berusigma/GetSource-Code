/**
 * app.js — Capacitor 7 Starter Logic
 */

// Helper alert / toast message
function showToast(message) {
  alert(message);
}

// 1. Test Haptic Feedback
const btnHaptic = document.getElementById("btnHapticTest");
if (btnHaptic) {
  btnHaptic.addEventListener("click", async () => {
    try {
      if (window.Capacitor && window.Capacitor.isPluginAvailable("Haptics")) {
        const { Haptics, ImpactStyle } = window.Capacitor.Plugins;
        await Haptics.impact({ style: ImpactStyle.Heavy });
      }
      showToast("⚡ Haptic feedback berhasil dipicu!");
    } catch (err) {
      showToast("Haptic hanya berjalan di HP Android/iOS.");
    }
  });
}

// 2. Test Clipboard
const btnCopy = document.getElementById("btnCopyTest");
if (btnCopy) {
  btnCopy.addEventListener("click", async () => {
    const textToCopy = "Hello from Capacitor 7 Starter!";
    try {
      if (window.Capacitor && window.Capacitor.isPluginAvailable("Clipboard")) {
        const { Clipboard } = window.Capacitor.Plugins;
        await Clipboard.write({ string: textToCopy });
      } else {
        await navigator.clipboard.writeText(textToCopy);
      }
      showToast(`📋 Teks berhasil disalin: "${textToCopy}"`);
    } catch (err) {
      showToast("Gagal menyalin teks.");
    }
  });
}
