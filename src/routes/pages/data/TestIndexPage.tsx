import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TestIndexPage({ name = "TestIndexPage", ...rest }: PropsWithChildren<ComponentProps>) {
  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="flex flex-row gap-2 mt-2 items-center ">
          <Link to="/" className="w-64 btn btn-lg btn-primary">
            Home
          </Link>
        </div>
        <div className="flex flex-row gap-2 mt-2 items-center ">
          <Link to="/test/hooks" className="w-64 btn btn-lg btn-primary">
            Hooks
          </Link>
          <Link to="/test/controllers" className="w-64 btn btn-lg btn-primary">
            Controllers
          </Link>
          <Link to="/test/layout" className="w-64 btn btn-lg btn-primary">
            Layouts
          </Link>
        </div>
      </div>
    </div>
  )
}
