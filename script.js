const jenisEl = document.getElementById('jenis')
const tanggalEl = document.getElementById('tanggal')

const outputEl = document.getElementById('output')

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

function updateOutput() {
  const jenis = jenisEl.value

  const tanggal = formatTanggal(tanggalEl.value)

  if (!tanggal) {
    outputEl.value = ''
    return
  }

  outputEl.value = `${jenis}, ${tanggal}`
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

jenisEl.addEventListener('change', updateOutput)

tanggalEl.addEventListener('change', updateOutput)

nominalInputEl.addEventListener('input', updateNominalOutput)

outputEl.addEventListener('click', () => {
  copyText(outputEl)
})

nominalOutputEl.addEventListener('click', () => {
  copyText(nominalOutputEl)
})

setTodayDate()

updateOutput()

function flashCopied(textarea) {
  textarea.classList.add('copied')

  setTimeout(() => {
    textarea.classList.remove('copied')
  }, 1200)
}

// ─── PENCAIRAN HARIAN ───────────────────────────────────────

const DAPUR = [
  'Campakamulya',
  'Cipetir',
  'Cihaur',
  'Cisalak 2',
  'Kertajadi 2',
  'Cikondang'
]

const REKENING = [
  {
    label: 'Fairuz Hibatullah – SEA BANK (901222967962)',
    nama: 'Fairuz Hibatullah',
    bank: 'SEA BANK',
    norek: '901222967962'
  },
  {
    label: 'Dede Jaelani – BNI (2076655207)',
    nama: 'Dede Jaelani',
    bank: 'BNI',
    norek: '2076655207'
  },
  {
    label: 'CV Kramat – BNI (1908102325)',
    nama: 'CV Kramat',
    bank: 'BNI',
    norek: '1908102325'
  },
  {
    label: 'Arutala – BNI (1985322260)',
    nama: 'Arutala',
    bank: 'BNI',
    norek: '1985322260'
  },
  {
    label: 'Melan Fitriani – BNI (2035516850)',
    nama: 'Melan Fitriani',
    bank: 'BNI',
    norek: '2035516850'
  },
  {
    label: 'Lia Ariska – BNI (1688603689)',
    nama: 'Lia Ariska',
    bank: 'BNI',
    norek: '1688603689'
  },
  {
    label: 'Rachmat Surya – BRI (407701032673505)',
    nama: 'Rachmat Surya',
    bank: 'BRI',
    norek: '407701032673505'
  },
  {
    label: 'Anisa Wulandari – BNI (2044709294)',
    nama: 'Anisa Wulandari',
    bank: 'BNI',
    norek: '2044709294'
  },
  {
    label: 'Rizki Ginanjar – BRI (010501136046504)',
    nama: 'Rizki Ginanjar',
    bank: 'BRI',
    norek: '010501136046504'
  }
]

const DAPUR_REKENING = {
  Campakamulya: ['Dede Jaelani', 'Arutala', 'CV Kramat', 'Melan Fitriani'],

  Cipetir: ['Dede Jaelani', 'Arutala', 'CV Kramat', 'Fairuz Hibatullah'],

  Cihaur: ['Dede Jaelani', 'Arutala', 'CV Kramat', 'Rizki Ginanjar'],

  'Cisalak 2': ['Arutala', 'CV Kramat', 'Lia Ariska'],

  'Kertajadi 2': ['Arutala', 'CV Kramat', 'Rachmat Surya'],

  Cikondang: ['Dede Jaelani', 'Arutala', 'CV Kramat', 'Anisa Wulandari']
}

const pencDapurEl = document.getElementById('pencDapur')
const pencTanggalEl = document.getElementById('pencTanggal')
const pencRowsEl = document.getElementById('pencRows')
const pencOutputEl = document.getElementById('pencOutput')
const pencAddRowBtn = document.getElementById('pencAddRow')

// Lock output fields
;[outputEl, nominalOutputEl, pencOutputEl].forEach((el) => {
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

// Populate dapur dropdown — placeholder dulu
const dapurPlaceholder = document.createElement('option')
dapurPlaceholder.value = ''
dapurPlaceholder.textContent = 'Pilih Dapur'
dapurPlaceholder.disabled = true
dapurPlaceholder.selected = true
pencDapurEl.appendChild(dapurPlaceholder)

DAPUR.forEach((d) => {
  const opt = document.createElement('option')
  opt.value = d
  opt.textContent = d
  pencDapurEl.appendChild(opt)
})

// Set today
function setPencTanggal() {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  pencTanggalEl.value = `${y}-${m}-${d}`
}

function formatTanggalPenc(dateString) {
  if (!dateString) return ''
  const [y, m, d] = dateString.split('-')
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(y, m - 1, d))
}

function stripNominal(val) {
  return val.replace(/\D/g, '')
}

function formatNominalDisplay(val) {
  const digits = stripNominal(val)
  if (!digits) return ''
  return Number(digits).toLocaleString('id-ID')
}

function headerReady() {
  return pencDapurEl.value !== '' && pencTanggalEl.value !== ''
}

let rowCount = 0

function refreshDeleteButtons() {
  const rows = [...pencRowsEl.querySelectorAll('.penc-row')]

  rows.forEach((row) => {
    const btn = row.querySelector('.btn-del')

    btn.disabled = rows.length <= 1

    btn.classList.toggle('btn-del-disabled', rows.length <= 1)
  })
}

function updateRowStates() {
  const rows = [...pencRowsEl.querySelectorAll('.penc-row')]
  rows.forEach((row) => {
    const ket = row.querySelector('.penc-ket')
    const rek = row.querySelector('.penc-rek')
    const nom = row.querySelector('.penc-nom')
    const ketVal = ket.value.trim()
    const rekVal = rek.value

    ket.disabled = !headerReady()
    rek.disabled = !headerReady() || !ketVal
    nom.disabled = !headerReady() || !ketVal || rekVal === ''

    // visual dimming
    ;[ket, rek, nom].forEach((el) => {
      el.classList.toggle('field-disabled', el.disabled)
    })
  })
}

function createRow() {
  // Validasi: baris terakhir harus sudah lengkap
  const existingRows = [...pencRowsEl.querySelectorAll('.penc-row')]
  if (existingRows.length > 0) {
    const lastRow = existingRows[existingRows.length - 1]
    const lastNom = stripNominal(lastRow.querySelector('.penc-nom').value)
    const lastRek = lastRow.querySelector('.penc-rek').value
    const lastKet = lastRow.querySelector('.penc-ket').value.trim()

    if (!lastKet) {
      lastRow.querySelector('.penc-ket').classList.add('field-error')
      lastRow.querySelector('.penc-ket').placeholder =
        '⚠ Keterangan wajib diisi'
      setTimeout(() => {
        lastRow.querySelector('.penc-ket').classList.remove('field-error')
        lastRow.querySelector('.penc-ket').placeholder =
          'Keterangan (mis. RAB Sekolah)'
      }, 2000)
      return
    }
    if (lastRek === '') {
      lastRow.querySelector('.penc-rek').classList.add('field-error')
      setTimeout(
        () =>
          lastRow.querySelector('.penc-rek').classList.remove('field-error'),
        2000
      )
      return
    }
    if (!lastNom) {
      lastRow.querySelector('.penc-nom').classList.add('field-error')
      lastRow.querySelector('.penc-nom').placeholder = '⚠ Nominal wajib diisi'
      setTimeout(() => {
        lastRow.querySelector('.penc-nom').classList.remove('field-error')
        lastRow.querySelector('.penc-nom').placeholder =
          'Nominal (mis. 1.000.000)'
      }, 2000)
      return
    }
  }

  rowCount++
  const wrap = document.createElement('div')
  wrap.className = 'penc-row'
  wrap.dataset.id = rowCount

  // Keterangan
  const ketInput = document.createElement('input')
  ketInput.type = 'text'
  ketInput.placeholder = 'Keterangan'
  ketInput.title =
    'Contoh:\nRAB - Beras\nRAB - Sekolah xx Hari dan B3 xx Hari\nBOP\nBOP - Gas'
  ketInput.className = 'penc-ket'
  ketInput.disabled = !headerReady()

  // Rekening select
  const rekSelect = document.createElement('select')
  rekSelect.className = 'penc-rek'
  rekSelect.disabled = true

  const rekPlaceholder = document.createElement('option')
  rekPlaceholder.value = ''
  rekPlaceholder.textContent = 'Tujuan'
  rekPlaceholder.disabled = true
  rekPlaceholder.selected = true
  rekSelect.appendChild(rekPlaceholder)

  const allowedNames = DAPUR_REKENING[pencDapurEl.value] || []

  REKENING.forEach((r, i) => {
    if (!allowedNames.includes(r.nama)) return

    const opt = document.createElement('option')
    opt.value = i
    opt.textContent = r.label

    rekSelect.appendChild(opt)
  })

  // Nominal
  const nomInput = document.createElement('input')
  nomInput.type = 'text'
  nomInput.setAttribute('inputmode', 'numeric')
  nomInput.maxLength = 8
  nomInput.placeholder = 'Nominal'
  nomInput.title = 'Hanya Angka'
  nomInput.className = 'penc-nom'
  nomInput.disabled = true

  // Hapus button
  const delBtn = document.createElement('button')
  delBtn.textContent = '×'
  delBtn.className = 'btn-del'
  delBtn.addEventListener('click', () => {
    const rows = pencRowsEl.querySelectorAll('.penc-row')

    if (rows.length <= 1) {
      return
    }

    wrap.remove()
    refreshDeleteButtons()
    updatePencOutput()
    updateRowStates()
  })

  wrap.appendChild(ketInput)
  wrap.appendChild(rekSelect)
  wrap.appendChild(nomInput)
  wrap.appendChild(delBtn)

  // Progressive unlock listeners
  ketInput.addEventListener('input', () => {
    updateRowStates()
    updatePencOutput()
  })

  rekSelect.addEventListener('change', () => {
    updateRowStates()
    updatePencOutput()
  })

  nomInput.addEventListener('input', () => {
    nomInput.value = nomInput.value.replace(/\D/g, '').slice(0, 8)

    updatePencOutput()
  })

  pencRowsEl.appendChild(wrap)
  refreshDeleteButtons()
  updateRowStates()
  updatePencOutput()
}

tanggalEl.addEventListener('click', () => {
  if (typeof tanggalEl.showPicker === 'function') {
    tanggalEl.showPicker()
  }
})

pencTanggalEl.addEventListener('click', () => {
  if (typeof pencTanggalEl.showPicker === 'function') {
    pencTanggalEl.showPicker()
  }
})

function updatePencOutput() {
  const dapur = pencDapurEl.value
  const tanggal = formatTanggalPenc(pencTanggalEl.value)

  if (!dapur || !tanggal) {
    pencOutputEl.value = ''
    return
  }

  const rows = [...pencRowsEl.querySelectorAll('.penc-row')]
  if (rows.length === 0) {
    pencOutputEl.value = ''
    return
  }

  const lines = rows
    .map((row) => {
      const ket = row.querySelector('.penc-ket').value.trim()
      const rekIdx = row.querySelector('.penc-rek').value
      const nom = stripNominal(row.querySelector('.penc-nom').value)

      if (!ket || rekIdx === '' || !nom) return null

      const rek = REKENING[rekIdx]
      const nomFormatted = Number(nom).toLocaleString('id-ID')

      // Format: Keterangan - Nama (Bank) (norek) : Rp. nominal
      return `${ket} - ${rek.nama} (${rek.bank}) (${rek.norek}) : Rp. ${nomFormatted}`
    })
    .filter(Boolean)

  if (lines.length === 0) {
    pencOutputEl.value = ''
    return
  }

  pencOutputEl.value = `${dapur},  ${tanggal}\n${lines.join('\n')}`
}

pencAddRowBtn.addEventListener('click', createRow)

pencDapurEl.addEventListener('change', () => {
  const hasData = [...pencRowsEl.querySelectorAll('.penc-ket')].some((el) =>
    el.value.trim()
  )

  if (hasData) {
    const ok = confirm(
      'Mengganti dapur akan menghapus seluruh request. Lanjutkan?'
    )

    if (!ok) return
  }

  pencRowsEl.innerHTML = ''

  rowCount = 0

  createRow()

  updateRowStates()
  updatePencOutput()
})

pencTanggalEl.addEventListener('change', () => {
  updateRowStates()
  updatePencOutput()
})

pencOutputEl.addEventListener('click', () => copyText(pencOutputEl))

setPencTanggal()
createRow() // mulai dengan 1 baris kosong
