import Navbar from "../components/Navbar"
import Setmenu from "../components/Setmenu"
import Link from "next/link"
import Image from "next/image"

export default function gamesLayout({
    children,
    params: {
        lng
    }
    }) {
    return (
        <section>     
            {children}     
            <Navbar lng={lng} page="games"/>
            <Link href={`/${lng}`} className="fixed top-1 left-4 p-2 hover:bg-amber-200 rounded-full shadow-md">
                <img src="/tohome.png" width={30} height={30} alt="back to home" className="w-6 h-6" />
            </Link>
            <Setmenu lng={lng}/>
        </section>
    )
}