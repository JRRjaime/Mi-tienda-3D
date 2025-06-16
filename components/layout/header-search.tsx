"use client"

import { memo, useState, useCallback, useMemo } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"

const HeaderSearch = memo(() => {
  const [searchValue, setSearchValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  // Debounce search to prevent excessive API calls
  const debouncedSearch = useDebounce(searchValue, 300)

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
    // Here you would typically trigger search API call with debouncedSearch
  }, [])

  const clearSearch = useCallback(() => {
    setSearchValue("")
    setIsFocused(false)
  }, [])

  const searchResults = useMemo(() => {
    // Mock search results - replace with actual search logic
    if (!debouncedSearch) return []
    return [
      { id: 1, name: "Figura de Goku", category: "Anime" },
      { id: 2, name: "Vaso Geométrico", category: "Decoración" },
    ].filter((item) => item.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
  }, [debouncedSearch])

  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar productos..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 pr-10"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isFocused && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {searchResults.map((result) => (
            <div key={result.id} className="px-4 py-2 hover:bg-muted cursor-pointer border-b last:border-b-0">
              <div className="font-medium">{result.name}</div>
              <div className="text-sm text-muted-foreground">{result.category}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

HeaderSearch.displayName = "HeaderSearch"

export { HeaderSearch }
