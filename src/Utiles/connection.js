import config from "../config";
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(config.sbAPIanon, config.sbAPIkey);

export default supabase;