import { FeatureVector } from "@/app/_client/components/svgs/vectors/feature"
import { useTranslations } from "next-intl"


type FeaturesProps = {
  vda: string
}

export const Features = ({ vda }: FeaturesProps) =>{
  const translate = useTranslations(`homepage.${ vda }.features`)

  const renderFeatures = () =>{
    const mappedFeatures = Array(6)
      .fill("")
      .map((feature, index) => (
        <li 
          key={`feature-${index}`}
          className="bg-white dark:bg-dark_heading shadow-lg rounded-3xl p-[30px] lg:p-[50px] cursor-pointer transition-colors hover:bg-purple_main group relative">
          <div className="relative z-10">
            <div className="w-[60px] h-[60px] rounded-full relative bg-purple_main text-white font-bold text-[32px] leading-none flex items-center justify-center transition-colors group-hover:bg-white group-hover:text-heading_main">
              { index+1 }
            </div>
            <h3 className="mt-8 mb-3 text-2xl font-semibold text-heading_main dark:text-dark_heading_main transition-colors group-hover:text-white">{ translate(`list.${ index }.title`) }</h3>
            <p className="font-light text-base_one dark:text-dark_base_one transition-colors group-hover:text-white">{ translate(`list.${ index }.description`) }</p>
          </div>
          <div className="absolute hidden right-0 bottom-0 group-hover:block">
            <FeatureVector />
          </div>
        </li> 
      ))

    return mappedFeatures
  }

  return (
    <div className="lg:px-20 mb-32">
      <div className="text-center mb-10 lg:mb-16">
        <p className="text-purple_main font-bold text-[10px] mb-6">{ translate("tag") }</p>
        <h2 className="text-[42px] lg:text-[51px] text-heading_main dark:text-dark_heading_main font-black leading-tight">{ translate("title") }</h2>
      </div>
      <ul className="gap-5 lg:gap-8 grid lg:grid-cols-3">
        { renderFeatures() }
      </ul>
    </div>
  )
}