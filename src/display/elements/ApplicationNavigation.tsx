// import { useQueryState } from "@keldan-systems/state-mutex"
import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router"

type ComponentProps = {
  title?: string
  parentTitle?: string
  parentLink?: string

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ApplicationNavigation({ title, parentTitle, parentLink, name = "ApplicationNavigation", ...rest }: PropsWithChildren<ComponentProps>) {
  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-row gap-2 justify-start items-center">
        <Link to="/">
          <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
        </Link>
        {parentLink != null && (
          <Link to={parentLink}>
            <h1 className="fg--heading">{parentTitle}</h1>
          </Link>
        )}
        <h1 className="fg--heading--active text-xl">{title}</h1>
      </div>
    </div>
  )
}
