import { useEffect, useState } from "react";

export function useLocalStorageState(initialVal,key){
    const [value,setValue] = useState(()=>{
        const storedValue = localStorage.getItem(key)
        return storedValue ? JSON.parse(storedValue) : initialVal;
    });
    useEffect(function (){
        localStorage.setItem(key,JSON.stringify(value));
    },[value])
    return [value,setValue]
}