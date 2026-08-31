"use client"
import {Link} from '@/i18n/routing';
import { MenuIcon } from "../../svgs/icons/menu"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { HeaderNav } from "./nav"
import { motion } from "framer-motion"
import { Theming } from './theme';
import { useBetterMediaQuery } from '@/app/_client/libs/hooks/useBetterMediaQuery';
import Image from 'next/image';


export const Header = () =>{
  const [ isExpanded, setIsExpanded ] = useState(false)
  const matches = useBetterMediaQuery('(min-width: 1024px)')

  useEffect(() =>{
    if ( isExpanded ) {
      window.document.body.classList.add("no-scroll")
    } else {
      window.document.body.classList.remove("no-scroll")
    }
  }, [isExpanded])
  
  return (
    <header className="sticky top-0 z-20 px-3 pt-3 lg:px-6 lg:pt-6 bg-transparent backdrop-blur-sm">
      <div className="bg-white/95 dark:bg-[#060a14]/95 border border-slate-200 dark:border-slate-800/80 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.15)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)] flex justify-between items-center rounded-2xl lg:px-8">
        <Link
          className="inline-flex items-center" 
          href="/">
          <>
            <Image
              src="/AVD-BLACK-VERSION.webp"
              alt="AVD logo"
              width={180}
              height={52}
              priority
              className="h-9 w-auto dark:hidden"
            />
            <Image
              src="/AVD-WHITE-VERSION.webp"
              alt="AVD logo"
              width={180}
              height={52}
              priority
              className="hidden h-9 w-auto dark:block"
            />
          </>
        </Link>
        <button 
          className="lg:hidden text-slate-700 dark:text-slate-300"
          onClick={ () => setIsExpanded(true) }
          aria-expanded={ isExpanded }>
          <div>
            <MenuIcon />
          </div>
        </button>
        <AnimatePresence>
          { isExpanded && (
            <motion.div
              className="bg-slate-100 dark:bg-[#04060d] lg:hidden fixed top-0 left-0 min-h-screen w-screen"
              initial={{ 
                opacity: 0,
                x: 100
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{opacity: 0}}>
              <HeaderNav onClose={() => setIsExpanded(false)} />
              <div className="max-w-max mx-auto">
                <Theming />
              </div>
            </motion.div>
          ) }
        </AnimatePresence>
        { matches && (
          <div className='flex items-center gap-4'>
            <HeaderNav />
            <Theming />
          </div>
        ) }
      </div>
    </header>
  )
}