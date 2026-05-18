import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://njkqefixykbvgzeuhjpk.supabase.co'
const supabaseKey = 'sb_publishable_lePWfKVKTs63ocb6y1YBRw_CfPuZ4QN'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)