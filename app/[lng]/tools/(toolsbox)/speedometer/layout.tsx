'use client'
import {SpeedDataProvider} from './components/SpeedDataContext';

export default function speedometerpage({
    children,
    params: {
        lng
    }
    }) {
    return (
        <section>
            <SpeedDataProvider>
            {children}
            </SpeedDataProvider>
        </section>
    )
}