const MIN_STRETCH_COUNT = 4
const MAX_STRETCH_COUNT = 100
const MIN_RAW_LENGTH = 4
const SIGN_LIST = "abc"

const arrayBufferFromString = str =>
  new TextEncoder().encode(str)

const arrayBufferToBase64 = buffer =>
  base64js.fromByteArray(new Uint8Array(buffer))

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

  const sign1 = signList && signList.length >= 1 && signList[0] || SIGN_LIST[0]
  const sign2 = signList && signList.length >= 2 && signList[1] || SIGN_LIST[1]
  const sign3 = signList && signList.length >= 3 && signList[2] || SIGN_LIST[2]

  const data = arrayBufferFromString(src)
  const hashData = await options.digest(data)
  const hashBase64 = arrayBufferToBase64(hashData)
  const hashReplaced = hashBase64
    .split("+").join(sign1)
    .split("/").join(sign2)
    .split("=").join(sign3)
  const password = hashReplaced.slice(0, maxLength)

  return password
}

const passwordGenerate = async options => {
  if (!options.raw || !options.maxLength || options.maxLength < MIN_RAW_LENGTH) {
    return ""
  }

  let src = `${options.raw}${options.maxLength}`
  let depth = 0

  while (true) {
    const password = await passwordDoGenerate(src, options)
    if (depth >= MIN_STRETCH_COUNT && passwordIsOk(password, options)) {
      return password
    }

    src = password

    depth++
    if (depth >= MAX_STRETCH_COUNT) {
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

  const currentOptions = () => {
    const raw = rawPasswordInput.value
    const maxLength = maxLengthInput.valueAsNumber
    const useSign = useSignCheckBox.checked
    const signList = useSign ? signListInput.value : ""
    return { raw, maxLength, useSign, signList, digest }
  }

  const setIdenticonSource = source => {
    rawPasswordIdenticonSvg.setAttribute("data-jdenticon-value", source)
    jdenticon.update(rawPasswordIdenticonSvg)
  }

  const resetRawPassword = () => {
    rawPasswordInput.value = ""
  }

  const copyGenPassword = () => {
    genPasswordInput.select()
    document.execCommand("copy")
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
    copyGenPassword()
    resetRawPassword()
  })

  update()
}

main()
