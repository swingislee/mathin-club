'use client'
export default function speedometerpage({
    children,
    params: {
        lng
    }
    }) {
    return (
        <section>
            {children}
        </section>
    )
}