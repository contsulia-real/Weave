import { IconSearch } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Card,
  Column,
  Input,
  List,
  ListItem,
} from '../index'
import { DocumentationSearchHighlight } from './DocumentationSearchHighlight'
import {
  documentationNavigationSectionForPath,
  documentationNavigationSections,
} from './documentation-navigation-data'

interface ResolvedNavigationItem {
  path: string
  label: string
}

interface ResolvedNavigationSection {
  value: string
  label: string
  items: readonly ResolvedNavigationItem[]
}

export interface DocumentationNavigationProps {
  pathname: string
  onNavigate: (path: string) => void
}

function includesQuery(value: string, query: string): boolean {
  return value.toLocaleLowerCase().includes(query)
}

export function DocumentationNavigation({ pathname, onNavigate }: DocumentationNavigationProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const normalizedSearch = search.trim().toLocaleLowerCase()
  const routeSection = documentationNavigationSectionForPath(pathname)

  const sections = useMemo<readonly ResolvedNavigationSection[]>(
    () =>
      documentationNavigationSections.map((section) => ({
        value: section.value,
        label: t(section.labelKey),
        items: section.items.map((item) => ({
          path: item.path,
          label: item.label ?? t(item.labelKey ?? ''),
        })),
      })),
    [t],
  )

  const visibleSections = useMemo<readonly ResolvedNavigationSection[]>(() => {
    if (normalizedSearch.length === 0) return sections

    return sections.flatMap((section) => {
      const sectionMatches = includesQuery(section.label, normalizedSearch)
      const items = section.items.filter((item) => includesQuery(item.label, normalizedSearch))

      if (!sectionMatches && items.length === 0) return []
      return [{ ...section, items }]
    })
  }, [normalizedSearch, sections])

  const visibleValues = useMemo(
    () => visibleSections.map((section) => section.value),
    [visibleSections],
  )
  const [navigationState, setNavigationState] = useState<{
    pathname: string
    openValue: string | null
  }>(() => ({
    pathname,
    openValue: routeSection,
  }))
  const routeOpenValue =
    navigationState.pathname === pathname ? navigationState.openValue : routeSection
  const openValues =
    normalizedSearch.length > 0 ? visibleValues : routeOpenValue === null ? [] : [routeOpenValue]

  const handleSearchChange = (next: string) => {
    setSearch(next)

    if (next.trim().length === 0) {
      setNavigationState({
        pathname,
        openValue: routeSection,
      })
    }
  }

  const handleAccordionChange = (next: readonly string[]) => {
    if (normalizedSearch.length > 0) return

    const newlyOpened = next.find((value) => value !== routeOpenValue)
    setNavigationState({
      pathname,
      openValue: newlyOpened ?? null,
    })
  }

  return (
    <Card viewProps={{ height: 'fill', background: 'surfaceHover' }}>
      <Column gap={1} width="fill" align="center">
        <Input
          type="search"
          clearable
          value={search}
          onChange={handleSearchChange}
          leadingIcon={IconSearch}
          placeholder={t('docs.drawer.search')}
          viewProps={{ label: t('docs.drawer.search'), width: 'fill', minWidth: 'auto' }}
        />

        <Accordion
          multiple
          noDividers
          value={openValues}
          onValueChange={handleAccordionChange}
          viewProps={{ width: 'fill' }}
        >
          {visibleSections.map((section) => (
            <AccordionItem key={section.value} value={section.value}>
              <AccordionTrigger viewProps={{ radius: 'full' }}>
                <DocumentationSearchHighlight text={section.label} query={search} />
              </AccordionTrigger>

              <AccordionPanel>
                {section.items.length === 0 ? null : (
                  <List noDividers singleLine selection="single" selected={pathname}>
                    {section.items.map((item) => (
                      <ListItem
                        key={item.path}
                        id={item.path}
                        viewProps={{
                          clickable: true,
                          onClick: () => onNavigate(item.path),
                          radius: 'full',
                        }}
                      >
                        <DocumentationSearchHighlight text={item.label} query={search} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Column>
    </Card>
  )
}
