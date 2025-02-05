import { createClient } from '@supabase/supabase-js'
import config from "../config";
const supabase = createClient(config.sbAPIanon, config.sbAPIkey);

export default supabase;