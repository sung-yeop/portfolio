import { ReactNode } from "react"
import { ReactQueryProvider } from "./ReactQueryProvider"
import { MSWProvider } from "./MswProvider"

type Props = {
    children : ReactNode
}

export default function Context({children} : Props) {
return <ReactQueryProvider><MSWProvider>{children}</MSWProvider></ReactQueryProvider>
}