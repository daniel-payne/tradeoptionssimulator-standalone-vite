import { useDataState } from "@keldan-systems/state-mutex"
import { Children, type HTMLAttributes, type PropsWithChildren } from "react"

type ComponentProps = {
  addBorder?: boolean | undefined | null

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function FlowLayout({ addBorder = false, name = "FlowLayout", children, ...rest }: PropsWithChildren<ComponentProps>) {
  const array = Children.toArray(children)

  const width = useDataState<string>("width")
  const height = useDataState<string>("height")

  const layoutClassName = "w-" + (width ?? "auto") + " h-" + (height ?? "auto")

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full flex-auto flex flex-row flex-wrap justify-start items-start ">
        {array.map((child) => {
          if (addBorder) {
            return (
              <div className={layoutClassName}>
                <div className={"h-full w-full p-2"}>
                  <div className={"h-full w-full p-2 border border-primary rounded"}>{child}</div>
                </div>
              </div>
            )
          }
          return <div className={layoutClassName}>{child}</div>
        })}
      </div>
    </div>
  )
}
