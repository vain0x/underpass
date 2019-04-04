const arrayBufferFromString = str => {
  const buffer = new ArrayBuffer(str.length * 2)
  const data = new Uint16Array(buffer)
  for (let i = 0; i < str.length; i++) {
    data[i] = str.charCodeAt(i)
  }
  return buffer
}

const arrayBufferToBase64 = (buffer, btoa) => {
  let str = ""
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i])
  }
  return btoa(str)
}

const passwordIsOk = (password, options) => {
  const { maxLength, useSign, signList } = options
  return (
    password.length <= maxLength
    && password.match(/[a-z]/)
    && password.match(/[A-Z]/)
    && password.match(/[0-9]/)
    && (!useSign || signList.split("").some(a => password.includes(a)))
  )
}

const passwordDoGenerate = async (src, options) => {
  const { maxLength, signList } = options

  const sign1 = signList && signList.length >= 1 && signList[0] || "a"
  const sign2 = signList && signList.length >= 2 && signList[1] || "b"
  const sign3 = signList && signList.length >= 3 && signList[2] || "c"

  const data = arrayBufferFromString(src)
  const hashData = await options.digest(data)
  const hashBase64 = arrayBufferToBase64(hashData, options.btoa)
  const hashReplaced = hashBase64
    .split("+").join(sign1)
    .split("/").join(sign2)
    .split("=").join(sign3)
  const password = hashReplaced.slice(0, maxLength)

  return password
}

const passwordGenerate = async options => {
  let src = options.raw
  let depth = 0

  while (true) {
    const password = await passwordDoGenerate(src, options)
    if (passwordIsOk(password, options)) {
      return password
    }

    src = password

    depth++
    if (depth >= 100) {
      console.warn("Couldn't generate")
      return ""
    }
  }
}

const main = () => {
  const rawPasswordInput = document.getElementById("raw-password-input")
  const rawPasswordIdenticonSvg = document.getElementById("raw-password-identicon-svg")
  const genPasswordInput = document.getElementById("gen-password-input")
  const genPasswordCopyButton = document.getElementById("gen-password-button")
  const maxLengthInput = document.getElementById("max-length-input")
  const useSignCheckBox = document.getElementById("use-sign-checkbox")
  const signListInput = document.getElementById("sign-list-input")

  const digest = data => window.crypto.subtle.digest("SHA-512", data)
  const btoa = window.btoa

  const currentOptions = () => {
    const raw = rawPasswordInput.value
    const maxLength = maxLengthInput.valueAsNumber
    const useSign = useSignCheckBox.checked
    const signList = signListInput.value
    return { raw, maxLength, useSign, signList, digest, btoa }
  }

  const setIdenticonSource = source => {
    rawPasswordIdenticonSvg.setAttribute("data-jdenticon-value", source)
    jdenticon.update(rawPasswordIdenticonSvg)
  }

  const update = async () => {
    const options = currentOptions()
    window.requestAnimationFrame(() => {
      setIdenticonSource(options.raw)
    })

    signListInput.toggleAttribute("disabled", !options.useSign)

    const password = await passwordGenerate(options)
    window.requestAnimationFrame(() => {
      genPasswordInput.value = password
    })
  }

  for (const element of [rawPasswordInput, maxLengthInput, signListInput]) {
    element.addEventListener("input", update)
  }
  useSignCheckBox.addEventListener("change", update)

  genPasswordCopyButton.addEventListener("click", () => {
    genPasswordInput.select()
    document.execCommand("copy")
  })

  update()
}

main()
