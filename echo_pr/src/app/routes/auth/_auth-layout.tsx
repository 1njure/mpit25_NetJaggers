import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/_auth-layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
     
      <Outlet/>
  
  </>
}
