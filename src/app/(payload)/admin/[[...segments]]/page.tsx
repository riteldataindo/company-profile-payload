import type { AdminViewProps } from 'payload'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'
import config from '@payload-config'

export const generateMetadata = ({ params, searchParams }: AdminViewProps) =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: AdminViewProps) =>
  RootPage({ config, importMap, params, searchParams })

export default Page
