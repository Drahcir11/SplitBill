import { BillContext } from '../context/BillContext'
import { useContext } from 'react'

export const useBillContext = () =>{
    const context = useContext(BillContext)

    return context
}