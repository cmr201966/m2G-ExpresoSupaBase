const {VITE_MAPBOX_API, VITE_API_TOKEN, 
       VITE_SUPABASE_ANON, VITE_SUPABASE_KEY, 
       VITE_URLMYSQL, VITE_URLSUPABASE} = import.meta.env;

const config = {mapBoxAPI: VITE_MAPBOX_API, destodoToken: VITE_API_TOKEN, 
                sbAPIanon: VITE_SUPABASE_ANON, sbAPIkey: VITE_SUPABASE_KEY,
                urlmysql: VITE_URLMYSQL, urlsupabase: VITE_URLSUPABASE};
export default config;
