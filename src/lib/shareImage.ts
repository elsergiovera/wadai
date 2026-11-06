import { toBlob } from 'html-to-image'

// Turns the off-screen share card into a PNG file. Fonts and the flag image are inlined by html-to-image
// (flagcdn sends CORS headers, so the canvas isn't tainted).
export const renderCard = async (node: HTMLElement, name: string): Promise<File | null> => {
   await document.fonts.ready
   const blob = await toBlob(node, { pixelRatio: 2, cacheBust: true })
   return blob ? new File([blob], name, { type: 'image/png' }) : null
}

// Saves a file through a temporary link (desktop fallback when the share sheet can't take images).
export const downloadFile = (file: File) => {
   const url = URL.createObjectURL(file)
   const link = document.createElement('a')
   link.href = url
   link.download = file.name
   document.body.appendChild(link)
   link.click()
   link.remove()
   setTimeout(() => URL.revokeObjectURL(url), 1000)
}
