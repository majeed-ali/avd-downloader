import { useTheme } from "next-themes"
import { MooonIcon } from "../../../svgs/icons/moon"
import { ChangeEvent } from "react"
import { SunIcon } from "../../../svgs/icons/sun"


export const Theming = () =>{
  const { theme, setTheme } = useTheme()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>{
    setTheme(event.target.value)
  }

  return (
    <div className="theming">
      <fieldset className="relative w-16 h-[26px] rounded-full shadow-[inset_0_2px_6px_1px_rgba(0,0,0,0.3)] bg-white dark:bg-purple_main">
        <legend className="sr-only">Dark mode</legend>
        <input 
          className="invisible opacity-0 absolute checked:[&+label]:left-10" 
          type="radio" 
          id="dark" 
          name="theme"
          value="dark"
          checked={theme==="dark"}
          onChange={handleChange} />
        <label className="transition-transform rounded-full w-[52px] h-[52px] cursor-pointer top-1/2 -translate-y-1/2 -left-3 place-content-center bg-header_bg dark:bg-[#1e1f22] absolute grid shadow z-10" htmlFor="dark">
          { theme==="dark"? <SunIcon /> : <MooonIcon /> }
          <span className="sr-only">Dark mode</span>
        </label>
        <input 
          className="invisible opacity-0 absolute" 
          type="radio" 
          id="light" 
          name="theme"
          value="light"
          checked={theme==="light"}
          onChange={handleChange} />
        <label className="transition-transform absolute w-full h-full" htmlFor="light">
          <span className="sr-only">Light mode</span>
        </label>
      </fieldset>   
    </div>
  )
}