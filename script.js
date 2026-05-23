const jenisEl = document.getElementById("jenis");
const tanggalEl = document.getElementById("tanggal");

const outputEl = document.getElementById("output");

const nominalInputEl =
  document.getElementById("nominalInput");

const nominalOutputEl =
  document.getElementById("nominalOutput");

function setTodayDate() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  tanggalEl.value =
    `${year}-${month}-${day}`;
}

function formatTanggal(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

function updateOutput() {
  const jenis = jenisEl.value;

  const tanggal =
    formatTanggal(tanggalEl.value);

  if (!tanggal) {
    outputEl.value = "";
    return;
  }

  outputEl.value =
    `${jenis}, ${tanggal}`;
}

function sanitizeNominal(value) {
  if (!value) {
    return "";
  }

  return value.replace(/\D/g, "");
}

function updateNominalOutput() {
  nominalOutputEl.value =
    sanitizeNominal(
      nominalInputEl.value
    );
}

async function copyText(textarea, onSuccess) {
  const text = textarea.value;

  if (!text) {
    return;
  }

  try {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(
        text
      );
    } else {
      textarea.select();

      document.execCommand("copy");
    }

    textarea.blur();

    flashCopied(textarea);

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    alert("Gagal copy.");

    console.error(error);
  }
}

jenisEl.addEventListener(
  "change",
  updateOutput
);

tanggalEl.addEventListener(
  "change",
  updateOutput
);

nominalInputEl.addEventListener(
  "input",
  updateNominalOutput
);

outputEl.addEventListener(
  "click",
  () => {
    copyText(outputEl);
  }
);

nominalOutputEl.addEventListener(
  "click",
  () => {
    copyText(
      nominalOutputEl,
      () => {
        nominalInputEl.value = "";
        nominalOutputEl.value = "";
      }
    );
  }
);

setTodayDate();

updateOutput();

function flashCopied(textarea) {
  const originalBorder =
    textarea.style.borderColor;

  textarea.style.borderColor =
    "#16a34a";

  setTimeout(() => {
    textarea.style.borderColor =
      originalBorder;
  }, 500);
}