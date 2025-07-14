import { useState,useEffect } from 'react'
import { createContext } from 'react'


const NewsContext = createContext()

function NewsProvider({ children }){
    const [news, setNews] = useState(() => {
        const saved = localStorage.getItem('news')
        if (!saved || saved === "undefined") return null
        try {
            return JSON.parse(saved)
        } catch {
            return null
        }
    })
    useEffect(() => {
         if (news !== null) {
            localStorage.setItem('news', JSON.stringify(news))
        }
    }, [news])

    return(
        <NewsContext.Provider value={{news,setNews}}>
            { children }
        </NewsContext.Provider>
    )
}

export  { NewsContext, NewsProvider}