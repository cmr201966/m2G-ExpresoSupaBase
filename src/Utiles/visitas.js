import supabase from "./connection";

async function setVisitas(){
    const { data } = await supabase
       .from("ws")
       .select("*")
       .not('visitas', 'eq', 0)
       .limit(1);
       if (data.length!==0){
          await supabase
            .from("ws")
  /*          .update({ visitas: 0 })*/
            .update({ visitas: data[0].visitas+1 })
            .eq("id", data[0].id);
          return data[0].visitas+1
        }
        else{
          await supabase
          .from("ws")
          .insert({ visitas: 1});
          return 1
        }
  }
  
  export {
    setVisitas,
  };
  
