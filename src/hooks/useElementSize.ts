import { RefObject, useEffect, useState } from 'react'

const useElementSize = (ref: RefObject<HTMLElement>) => {
   const [size, setSize] = useState({ width: 0, height: 0 })

   useEffect(() => {
      const element = ref.current
      if (!element) return
      const update = () => setSize({ width: element.clientWidth, height: element.clientHeight })
      update()
      if (typeof ResizeObserver === 'undefined') {
         window.addEventListener('resize', update)
         return () => window.removeEventListener('resize', update)
      }
      const observer = new ResizeObserver(update)
      observer.observe(element)
      return () => observer.disconnect()
   }, [ref])

   return size
}

export default useElementSize
