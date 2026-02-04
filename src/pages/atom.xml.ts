import { generateAtom } from '@/utils/chiri/feed'
import type { APIContext } from 'astro'

export const GET = (context: APIContext) => generateAtom(context)
