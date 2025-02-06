const {VITE_MAPBOX_API, VITE_API_TOKEN, 
       VITE_SUPABASE_ANON, VITE_SUPABASE_KEY, 
       VITE_URLMYSQL, VITE_URLSUPABASE, VITE_SERVICIOID, 
       VITE_TEMPLATE_USUARIOID, VITE_TEMPLATE_PRODUCTOID,
       VITE_EMAILJS_PUBLIC_KEY,} = import.meta.env;

const config = {mapBoxAPI: VITE_MAPBOX_API, destodoToken: VITE_API_TOKEN, 
                sbAPIanon: VITE_SUPABASE_ANON, sbAPIkey: VITE_SUPABASE_KEY,
                urlmysql: VITE_URLMYSQL, urlsupabase: VITE_URLSUPABASE,
                vite_servicioID: VITE_SERVICIOID, 
                vite_template_usuarioID: VITE_TEMPLATE_USUARIOID, 
                vite_template_productoID: VITE_TEMPLATE_PRODUCTOID,
                vite_emailjs_public_key: VITE_EMAILJS_PUBLIC_KEY,};

export default config;

