import type { HTMLAttributes, PropsWithChildren } from "react"
import { ErrorResponse, useRouteError } from "react-router"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ErrorPage({ name = "ErrorPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const error = useRouteError() as ErrorResponse & Error

  console.error(error)

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full flex flex-col justify-center items-center">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error?.statusText || error?.message}</i>
        </p>
      </div>
    </div>
  )
}
