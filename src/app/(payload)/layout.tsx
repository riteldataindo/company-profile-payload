import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap.js'
import config from '@payload-config'
import '@payloadcms/next/css'
import '@/admin/custom.css'

export const metadata = { title: 'SmartCounter Admin' }

const serverFunction = async function (args: any) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: { children: React.ReactNode }) =>
  RootLayout({ children, config, importMap, serverFunction })

export default Layout
