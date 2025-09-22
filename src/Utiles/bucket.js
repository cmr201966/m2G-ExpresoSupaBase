import supabase from "./connection";

async function creaBucketCM(bucket) {
    const { data } = await supabase.storage.listBuckets();
    const bucketExists = data.some((bucket) => bucket.name === bucket);
    if (bucketExists === false) {
      await supabase.storage.createBucket(bucket);
    }
  }
  
  export {
    creaBucketCM,
  };
  
