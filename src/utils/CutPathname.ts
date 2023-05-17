export const CutPathname = (path: string): string => {
  let route = path.split('/')
  let cutRoute = route[route.length-1]

  return cutRoute
}