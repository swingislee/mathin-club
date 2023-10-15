import Navbar from "@/app/[lng]/components/Navbar"
import Setmenu from "@/app/[lng]/components/Setmenu"
import Link from "next/link"
import Image from "next/image"

export default function toolsboxLayout({
    children,
    params: {
        lng
    }
    }) {
    return (
        <section>
            {children}
            <Navbar lng={lng} page="toolsbox"/>
        </section>
    )
}