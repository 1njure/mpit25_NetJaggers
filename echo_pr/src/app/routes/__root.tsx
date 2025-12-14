import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import LayoutMain from '../layouts/LayoutMain/ui/LayoutMain'
import { NotFoundPage } from '@/pages/404'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage, 
})

function RootComponent() {
  return (
    <LayoutMain>
      <Outlet /> 
      {process.env.NODE_ENV === 'development' && (
        <TanStackRouterDevtools />
      )}
    </LayoutMain>
  )
}