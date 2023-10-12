'use client'

import MainContainer from './components/MainContainer';
import {SpeedDataProvider} from './components/SpeedDataContext';

export default function Page({ params: { lng } }) {
  return (
    <SpeedDataProvider>
    <div className="absolute w-screen top-12 bottom-0 ">
      <MainContainer />
    </div>
    </SpeedDataProvider>
  )
}