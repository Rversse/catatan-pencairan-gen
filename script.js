const bahanGridEl = document.getElementById('bahanGrid')
const tanggalEl = document.getElementById('tanggal')
const tanggalSpasiEl = document.getElementById('tanggalSpasi')

const BAHAN_LIST = [
  'Beras',
  'Buah',
  'Bumbu',
  'Daging Ayam',
  'Daging Sapi',
  'Minyak',
  'Sayur',
  'Susu',
  'Tahu',
  'Telur Ayam',
  'Tempe'
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

const outputBelanjaEl = document.getElementById('outputBelanja')
const outputOperasionalEl = document.getElementById('outputOperasional')
const outputGasEl = document.getElementById('outputGas')
const outputInsentifFasilitasEl = document.getElementById('outputInsentifFasilitas')
const outputSewaKendaraanEl = document.getElementById('outputSewaKendaraan')
const outputGajiRelawanEl = document.getElementById('outputGajiRelawan')
const outputInsentifPicSekolahEl = document.getElementById('outputInsentifPicSekolah')
const outputInsentifPicPosyanduEl = document.getElementById('outputInsentifPicPosyandu')
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

const BULAN_SINGKAT = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'Mei',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Agu',
  '09': 'Sep',
  10: 'Okt',
  11: 'Nov',
  12: 'Des'
}

function formatTanggalNumeric(dateString) {
  if (!dateString) {
    return ''
  }

  const [year, month, day] = dateString.split('-')
  const separator = tanggalSpasiEl.checked ? ' ' : '-'
  const tanggalNumeric = `${day}${separator}${month}${separator}${year}`

  return tanggalNumeric.replace(
    new RegExp(`\\${separator}(\\d{2})\\${separator}`),
    (match, mm) => `${separator}${BULAN_SINGKAT[mm]}${separator}`
  )
}

function updateOutput() {
  if (!tanggalEl.value) {
    outputBelanjaEl.value = ''
    outputOperasionalEl.value = ''
    outputGasEl.value = ''
    outputInsentifFasilitasEl.value = ''
    outputSewaKendaraanEl.value = ''
    outputGajiRelawanEl.value = ''
    outputInsentifPicSekolahEl.value = ''
    outputInsentifPicPosyanduEl.value = ''
    outputTanggalEl.value = ''
    nominalOutputEl.value = ''
    return
  }

  const tanggalNumeric = formatTanggalNumeric(tanggalEl.value)
  const bahanText = getSelectedBahanText()

  const belanjaLabel = bahanText ? `Belanja ${bahanText}` : 'Belanja Bahan Baku'

  outputBelanjaEl.value = `${belanjaLabel}, ${tanggalNumeric}`
  outputOperasionalEl.value = `Biaya Ops Harian, ${tanggalNumeric}`
  outputGasEl.value = `Pembelian Gas, ${tanggalNumeric}`
  outputInsentifFasilitasEl.value = `Insentif Fasilitas SPPG, ${tanggalNumeric}`
  outputSewaKendaraanEl.value = `Sewa Kendaraan, ${tanggalNumeric}`
  outputGajiRelawanEl.value = `Gaji Relawan, ${tanggalNumeric}`
  outputInsentifPicSekolahEl.value = `Insentif PIC Sekolah, ${tanggalNumeric}`
  outputInsentifPicPosyanduEl.value = `Insentif PIC Posyandu, ${tanggalNumeric}`
  outputTanggalEl.value = tanggalNumeric
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

tanggalEl.addEventListener('change', updateOutput)

tanggalSpasiEl.addEventListener('change', updateOutput)

nominalInputEl.addEventListener('input', updateNominalOutput)

outputBelanjaEl.addEventListener('click', () => {
  copyText(outputBelanjaEl, () => {
    resetBahan()
    updateOutput()
  })
})

outputOperasionalEl.addEventListener('click', () => {
  copyText(outputOperasionalEl)
})

outputGasEl.addEventListener('click', () => {
  copyText(outputGasEl)
})

outputInsentifFasilitasEl.addEventListener('click', () => {
  copyText(outputInsentifFasilitasEl)
})

outputSewaKendaraanEl.addEventListener('click', () => {
  copyText(outputSewaKendaraanEl)
})

outputGajiRelawanEl.addEventListener('click', () => {
  copyText(outputGajiRelawanEl)
})

outputInsentifPicSekolahEl.addEventListener('click', () => {
  copyText(outputInsentifPicSekolahEl)
})

outputInsentifPicPosyanduEl.addEventListener('click', () => {
  copyText(outputInsentifPicPosyanduEl)
})

outputTanggalEl.addEventListener('click', () => {
  copyText(outputTanggalEl)
})

nominalOutputEl.addEventListener('click', () => {
  copyText(nominalOutputEl, () => {
    nominalInputEl.value = ''
    updateNominalOutput()
  })
})

setTodayDate()

updateOutput()

function flashCopied(textarea) {
  textarea.classList.add('copied')

  setTimeout(() => {
    textarea.classList.remove('copied')
  }, 1200)
}

// Lock output fields
;[
  outputBelanjaEl,
  outputOperasionalEl,
  outputGasEl,
  outputInsentifFasilitasEl,
  outputSewaKendaraanEl,
  outputGajiRelawanEl,
  outputInsentifPicSekolahEl,
  outputInsentifPicPosyanduEl,
  outputTanggalEl,
  nominalOutputEl
].forEach((el) => {
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
