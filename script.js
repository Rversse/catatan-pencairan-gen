const jenisEl = document.getElementById('jenis')
const bahanFieldEl = document.getElementById('bahanField')
const bahanGridEl = document.getElementById('bahanGrid')
const tanggalEl = document.getElementById('tanggal')

const BAHAN_LIST = [
  'Minyak',
  'Susu',
  'Bumbu',
  'Beras',
  'Ayam Potong',
  'Ayam Parting',
  'Ayam Fillet',
  'Daging Sapi',
  'Ikan',
  'Sayur',
  'Buah',
  'Tahu',
  'Tempe',
  'Telur Ayam',
  'Telur Puyuh',
  'Telur Asin'
]

const selectedBahan = new Set()

BAHAN_LIST.forEach((nama) => {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'bahan-btn'
  btn.textContent = nama
  btn.dataset.value = nama

  btn.addEventListener('click', () => {
    if (selectedBahan.has(nama)) {
      selectedBahan.delete(nama)
      btn.classList.remove('active')
    } else {
      selectedBahan.add(nama)
      btn.classList.add('active')
    }

    updateOutput()
  })

  bahanGridEl.appendChild(btn)
})

function getSelectedBahanText() {
  return [...selectedBahan].join(', ')
}

const outputEl = document.getElementById('output')
const outputTanggalEl = document.getElementById('outputTanggal')

const nominalInputEl = document.getElementById('nominalInput')

nominalInputEl.addEventListener('focus', () => {
  nominalInputEl.select()
})

nominalInputEl.addEventListener('mouseup', (e) => {
  e.preventDefault()
})

const nominalOutputEl = document.getElementById('nominalOutput')

function setTodayDate() {
  const today = new Date()

  const year = today.getFullYear()

  const month = String(today.getMonth() + 1).padStart(2, '0')

  const day = String(today.getDate()).padStart(2, '0')

  tanggalEl.value = `${year}-${month}-${day}`
}

function formatTanggal(dateString) {
  if (!dateString) {
    return ''
  }

  const date = new Date(dateString)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

function formatTanggalNumeric(dateString) {
  if (!dateString) {
    return ''
  }

  const [year, month, day] = dateString.split('-')

  return `${day}-${month}-${year}`
}

function updateBahanVisibility() {
  const isBelanja = jenisEl.value === 'Belanja Bahan Baku'

  bahanFieldEl.style.display = isBelanja ? '' : 'none'
}

function updateOutput() {
  const jenis = jenisEl.value

  const tanggal = formatTanggal(tanggalEl.value)

  if (!tanggal) {
    outputEl.value = ''
    outputTanggalEl.value = ''
    return
  }

  let label = jenis

  const bahanText = getSelectedBahanText()

  if (jenis === 'Belanja Bahan Baku' && bahanText) {
    label = `Belanja Bahan Baku ${bahanText}`
  }

  outputEl.value = `${label},`
  outputTanggalEl.value = formatTanggalNumeric(tanggalEl.value)
}

function resetBahan() {
  selectedBahan.clear()

  bahanGridEl.querySelectorAll('.bahan-btn').forEach((btn) => {
    btn.classList.remove('active')
  })
}

function sanitizeNominal(value) {
  if (!value) {
    return ''
  }

  return value.replace(/\D/g, '')
}

function updateNominalOutput() {
  nominalOutputEl.value = sanitizeNominal(nominalInputEl.value)
}

async function copyText(textarea, onSuccess) {
  const text = textarea.value

  if (!text) {
    return
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      textarea.select()

      document.execCommand('copy')
    }

    textarea.blur()

    flashCopied(textarea)

    const badge = textarea.parentElement?.querySelector('.copy-badge')

    if (badge) {
      badge.classList.remove('show')

      requestAnimationFrame(() => {
        badge.classList.add('show')
      })

      setTimeout(() => {
        badge.classList.remove('show')
      }, 1400)
    }

    if (onSuccess) {
      onSuccess()
    }
  } catch (error) {
    alert('Gagal copy.')

    console.error(error)
  }
}

jenisEl.addEventListener('change', () => {
  if (jenisEl.value !== 'Belanja Bahan Baku') {
    resetBahan()
  }

  updateBahanVisibility()
  updateOutput()
})

tanggalEl.addEventListener('change', updateOutput)

nominalInputEl.addEventListener('input', updateNominalOutput)

outputEl.addEventListener('click', () => {
  copyText(outputEl)
})

outputTanggalEl.addEventListener('click', () => {
  copyText(outputTanggalEl)
})

nominalOutputEl.addEventListener('click', () => {
  copyText(nominalOutputEl)
})

setTodayDate()

updateBahanVisibility()

updateOutput()

function flashCopied(textarea) {
  textarea.classList.add('copied')

  setTimeout(() => {
    textarea.classList.remove('copied')
  }, 1200)
}

// Lock output fields
;[outputEl, outputTanggalEl, nominalOutputEl].forEach((el) => {
  if (!el) return

  el.setAttribute('tabindex', '-1')

  el.addEventListener('mousedown', (e) => {
    e.preventDefault()
  })

  el.addEventListener('selectstart', (e) => {
    e.preventDefault()
  })

  el.addEventListener('dblclick', (e) => {
    e.preventDefault()
  })
})

tanggalEl.addEventListener('click', () => {
  if (typeof tanggalEl.showPicker === 'function') {
    tanggalEl.showPicker()
  }
})
