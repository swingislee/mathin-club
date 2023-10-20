import Navbar from "@/app/[lng]/components/Navbar"

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