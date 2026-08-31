import { Link } from "@/i18n/routing"
import { languages } from "./data"


export const Languages = () =>{

  const renderLanguages = () =>{
    const mappedLanguages = languages.map(language => (
      <li key={language.locale}>
        <Link
          className="text-purple_main font-semibold text-[15px] relative pr-3 
            after:content-['.'] after:absolute after:pb-5 after:-top-[3px] after:right-1 after:scale-150" 
          href="/" 
          locale={language.locale}>{ language.label }
        </Link>
      </li>
    ))

    return mappedLanguages
  }

  return (
    <ul className="flex flex-wrap gap-x-4 justify-center lg:justify-start dark:text-gray-400">
      { renderLanguages() }
    </ul>
  )
}