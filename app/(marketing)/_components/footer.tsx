import { Button } from "@/components/ui/button"

import { Logo } from "./logo"
import { GithubIcon } from "lucide-react"

export const Footer = () => {
  return (
    <div className="flex items-center w-full p-6 bg-background z-50 dark:bg-[#1F1F1F]">
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
        {/* <Button variant="ghost" size="sm">
          Privacy Policy
        </Button> */}
        <a href="https://github.com/JamieThomasAnderson/polytree">
          <Button variant="ghost" size="sm" className="pl-2">
            <GithubIcon /> 
            Github
          </Button>
        </a>
      </div>
    </div>
  )
}