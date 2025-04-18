import { Header } from './components/header'

export default function DashboardLayout({ children }) 
{
    return (
    <>
        <Header />
        {children}
    </>
    )
  }