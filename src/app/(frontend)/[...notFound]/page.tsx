import { notFound } from 'next/navigation'

// The app has two root layouts ((frontend) and (payload)), so Next cannot use a
// top-level not-found.tsx for unmatched URLs. This catch-all routes them to the
// branded (frontend)/not-found.tsx instead of Next's default page.
export default function CatchAllNotFound() {
  notFound()
}
