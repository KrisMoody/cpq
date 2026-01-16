/**
 * Composable for generating breadcrumb navigation from the current route.
 *
 * Derives breadcrumbs from the navigation structure to show full context
 * (e.g., "Admin > Catalog > Products > View").
 */

export type BreadcrumbItem = {
  label: string
  to?: string
}

export type NavItem = {
  id: string
  type?: 'section' | 'link' | 'group'
  label: string
  icon?: string
  to?: string
  children?: NavItem[]
}

/**
 * Set a custom breadcrumb label for the current page.
 * This overrides the default "View" label for dynamic ID segments.
 *
 * @param label - The custom label to display in breadcrumbs
 *
 * @example
 * ```typescript
 * // In a dynamic page like [moduleId].vue
 * const module = await fetchModule(id)
 * useBreadcrumbLabel(module.title)  // Shows "Price Books" instead of "View"
 * ```
 */
export function useBreadcrumbLabel(label: string | Ref<string | undefined>) {
  const breadcrumbLabel = useState<string | undefined>('breadcrumb-label', () => undefined)

  // Support both reactive and static values
  if (isRef(label)) {
    watch(label, (newLabel) => {
      breadcrumbLabel.value = newLabel
    }, { immediate: true })
  }
  else {
    breadcrumbLabel.value = label
  }

  // Clear the label when the component is unmounted
  onUnmounted(() => {
    breadcrumbLabel.value = undefined
  })

  return breadcrumbLabel
}

/**
 * Generate breadcrumb items from the current route and navigation structure.
 *
 * @param navigation - The navigation configuration array
 * @returns Computed array of breadcrumb items
 *
 * @example
 * ```typescript
 * const navigation = [...]
 * const breadcrumbs = useBreadcrumbs(navigation)
 * // On /products/abc123 -> [{ label: 'Admin' }, { label: 'Catalog' }, { label: 'Products', to: '/products' }, { label: 'View' }]
 * ```
 */
export function useBreadcrumbs(navigation: NavItem[]): ComputedRef<BreadcrumbItem[]> {
  const route = useRoute()
  const customLabel = useState<string | undefined>('breadcrumb-label', () => undefined)

  return computed(() => {
    const path = route.path
    const items: BreadcrumbItem[] = []

    // Find matching nav item and build breadcrumb trail
    const result = findNavItemForPath(navigation, path)

    if (result) {
      // Add section header if present (with link if it has a route)
      if (result.section) {
        items.push({
          label: result.section.label,
          to: result.section.to,
        })
      }

      // Add group if present (with link if it has a route)
      if (result.group) {
        items.push({
          label: result.group.label,
          to: result.group.to,
        })
      }

      // Add the matched nav item (with link if not current page)
      if (result.item.to) {
        const isExactMatch = path === result.item.to
        items.push({
          label: result.item.label,
          to: isExactMatch ? undefined : result.item.to,
        })
      }

      // Handle dynamic segments after the base path
      const remainingPath = result.item.to ? path.slice(result.item.to.length) : path
      const segments = remainingPath.split('/').filter(Boolean)

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]!
        const isLast = i === segments.length - 1

        if (segment === 'new') {
          items.push({ label: 'New' })
        } else if (isLikelyId(segment)) {
          // Dynamic ID segment - use custom label if set, otherwise "View"
          const label = isLast && customLabel.value ? customLabel.value : 'View'
          const viewItem: BreadcrumbItem = { label }
          if (!isLast && result.item.to) {
            // Build link to the ID page for nested routes
            const basePath = result.item.to
            const idPath = `${basePath}/${segment}`
            viewItem.to = idPath
          }
          items.push(viewItem)
        } else {
          // Named nested segment (e.g., "preview", "edit")
          items.push({ label: capitalize(segment) })
        }
      }
    } else {
      // Fallback: route-based breadcrumbs for pages not in navigation
      const segments = path.split('/').filter(Boolean)

      if (segments.length === 0) {
        // Dashboard
        items.push({ label: 'Dashboard' })
      } else {
        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i]!
          const isLast = i === segments.length - 1

          if (segment === 'new') {
            items.push({ label: 'New' })
          } else if (isLikelyId(segment)) {
            // Dynamic ID segment - use custom label if set, otherwise "View"
            const label = isLast && customLabel.value ? customLabel.value : 'View'
            items.push({ label })
          } else {
            const segmentPath = '/' + segments.slice(0, i + 1).join('/')
            items.push({
              label: capitalize(segment.replace(/-/g, ' ')),
              to: isLast ? undefined : segmentPath,
            })
          }
        }
      }
    }

    return items
  })
}

/**
 * Find a navigation item that matches the given path.
 * Returns the item along with its parent section and group for context.
 */
function findNavItemForPath(
  navigation: NavItem[],
  path: string
): { item: NavItem; section?: NavItem; group?: NavItem } | null {
  let currentSection: NavItem | undefined

  for (const item of navigation) {
    // Track current section
    if (item.type === 'section') {
      currentSection = item
      continue
    }

    // Check standalone items
    if (item.to && pathMatches(path, item.to)) {
      return { item, section: currentSection }
    }

    // Check groups with children
    if (item.type === 'group' && item.children) {
      for (const child of item.children) {
        if (child.to && pathMatches(path, child.to)) {
          return { item: child, section: currentSection, group: item }
        }
      }
    }
  }

  return null
}

/**
 * Check if a path matches a navigation item's path.
 * Matches exactly or as a prefix with a following slash or dynamic segment.
 */
function pathMatches(currentPath: string, navPath: string): boolean {
  if (currentPath === navPath) {
    return true
  }
  // Match if the current path starts with the nav path and continues with /
  if (currentPath.startsWith(navPath + '/')) {
    return true
  }
  return false
}

/**
 * Check if a path segment looks like a dynamic ID.
 * IDs are typically UUIDs, CUIDs, or other non-word patterns.
 */
function isLikelyId(segment: string): boolean {
  // Common ID patterns: UUIDs, CUIDs, numeric IDs, or any string that
  // doesn't look like a route keyword
  const routeKeywords = ['new', 'edit', 'preview', 'settings', 'details']
  if (routeKeywords.includes(segment.toLowerCase())) {
    return false
  }
  // If it contains numbers or looks like a CUID/UUID, it's likely an ID
  return /[0-9]/.test(segment) || segment.length > 10
}

/**
 * Capitalize the first letter of a string.
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
