const jenisEl = document.getElementById("jenis");
const tanggalEl = document.getElementById("tanggal");
const outputEl = document.getElementById("output");
const copyBtn = document.getElementById("copyBtn");

function setTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  tanggalEl.value = `${year}-${month}-${day}`;
}

function formatTanggal(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function updateOutput() {
  const jenis = jenisEl.value;
  const tanggal = formatTanggal(tanggalEl.value);

  if (!tanggal) {
    outputEl.value = "";
    return;
  }

  outputEl.value = `${jenis}, ${tanggal}`;
}

async function copyToClipboard() {
  const text = outputEl.value;

  if (!text) {
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      outputEl.select();
      document.execCommand("copy");
    }

    const originalText = copyBtn.textContent;

    copyBtn.textContent = "Tersalin";

    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
  } catch (error) {
    alert("Gagal menyalin teks.");
    console.error(error);
  }
}

jenisEl.addEventListener("change", updateOutput);
tanggalEl.addEventListener("change", updateOutput);

copyBtn.addEventListener("click", copyToClipboard);

outputEl.addEventListener("click", () => {
  outputEl.select();
});

setTodayDate();
updateOutput();