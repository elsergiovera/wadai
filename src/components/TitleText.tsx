// The Title font family covers letters (Title.ttf) plus digits and # % . : ? (Micro 5, see
// main.css). Anything else is drawn in the Text font.
const SAFE = /^[A-Za-z0-9 ()*[\]#%.:?]$/

const TitleText = ({ text }: { text: string }) => {
   const parts: { safe: boolean, text: string }[] = []
   for (const char of text) {
      const safe = SAFE.test(char)
      const last = parts[parts.length - 1]
      if (last && last.safe === safe) last.text += char
      else parts.push({ safe, text: char })
   }
   return <>{parts.map((part, i) => part.safe ? part.text : <span key={i} style={{ fontFamily: 'Text, monospace' }}>{part.text}</span>)}</>
}

export default TitleText
