'use client'
import { Translate } from '@/app/i18n'
import { motion } from 'framer-motion'


export default  function Page({ params: { lng } }) {
  const { t } = Translate(lng, 'tools')


  return (
    <div className="absolute w-screen top-12 bottom-0 ">




    <motion.div
      drag // 开启拖动
      style={{
        width: 100,
        height: 100,
        backgroundColor: 'red'
      }}
    >
      拖我
    </motion.div>
    </div>
  )
}