import { createFileRoute } from '@tanstack/react-router'
import DashBoard from '@/widgets/dashboard/DashBoard'
export const Route = createFileRoute('/dashboard')({
  component: DashBoard,
})

