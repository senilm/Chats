import { Children, createContext, useContext, useState } from "react"

export const useGetContextData = () => useContext(DataContext)

export const DataContext = createContext(null)

const DataProvider = ({children}) => {
    const [userDetail, setUserDetail] = useState({
        name:'',
        email:'',
        id:''
    })
  return (
    <DataContext.Provider value={{userDetail, setUserDetail}}>
        {children}
    </DataContext.Provider>
  )
}

export default DataProvider