import { supabase } from "../client/supabaseClient"

//NOTE - must always be partnered with Types, better for smaller database schemas
export const fetchAccountData = async () => {
    const {data, error} = await supabase
    .from("account_setup")
    .select("*")

    if(error) console.error("Error in getting data from account_setup table: ", error);

    return data
}

export const fetchLogs = async () => {
    const {data, error} = await supabase
    .from("logs")
    .select("*")

    if(error) console.error("Error in getting data from logs table: ", error);

    return data
}