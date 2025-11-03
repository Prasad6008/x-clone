// Custom hook

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { baseURL } from "../constant/url";
import toast from "react-hot-toast";

const useFollow = ()=>
{
    const queryClient = useQueryClient();
    const {mutate : follow , isPending} = useMutation(
        {
            mutationFn : async(userID) =>
            {
                try {
                    const res = await fetch(`${baseURL}/api/user/follow/${userID}`,
                        {
                            method : "POST",
                            credentials : "include",
                            headers : {
                                "Content-Type" : "application/json"
                            }
                        }
                    )
                    const data = await res.json()

                    if(!res.ok){
                        throw new Error(data.errro || "Something went wrong")
                    }
                    return data
                } catch (error) {
                    throw error
                }
            },
            onSuccess : ()=>
            {

                // queryClient.invalidateQueries({queryKey : ["suggestedUsers"]})
                // queryClient.invalidateQueries({queryKey : ["authUser"]})  //runs seperately and performance poor

                Promise.all(   //runs parallelly 
                    [
                        queryClient.invalidateQueries({queryKey : ["suggestedUsers"]}),
                        queryClient.invalidateQueries({queryKey : ["authUser"]})
                    ]
                )
            },
            onError : (error)=>
            {
                toast.error(error.message)
            }
        }
    )
    return {follow , isPending}
}


export default useFollow