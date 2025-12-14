import { createFileRoute } from '@tanstack/react-router';
import { NotFoundPage } from '@/pages/404';

export const Route = createFileRoute('/404')({
  component: NotFoundPage,
});