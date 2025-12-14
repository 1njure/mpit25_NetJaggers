import { createFileRoute } from '@tanstack/react-router'
import DocumentationPage from '@/pages/documentationPage/DocumentationPage'
export const Route = createFileRoute('/docs')({
  component: DocumentationPage,
})


