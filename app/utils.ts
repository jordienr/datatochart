export function parseData(data: string, type: "csv" | "json"): any[] {
  if (type === "csv") {
    return parseCSV(data)
  } else {
    return parseJSON(data)
  }
}

function parseCSV(csv: string): any[] {
  const lines = csv.trim().split("\n")
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header row and one data row")
  }

  const headers = lines[0].split(",").map((header) => header.trim())

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim())

    // Handle quoted values with commas inside
    const processedValues: string[] = []
    let tempValue = ""
    let insideQuotes = false

    for (const value of values) {
      if (value.startsWith('"') && !value.endsWith('"')) {
        insideQuotes = true
        tempValue = value.substring(1)
      } else if (insideQuotes && value.endsWith('"')) {
        tempValue += "," + value.substring(0, value.length - 1)
        processedValues.push(tempValue)
        tempValue = ""
        insideQuotes = false
      } else if (insideQuotes) {
        tempValue += "," + value
      } else {
        processedValues.push(value)
      }
    }

    const result: Record<string, any> = {}
    headers.forEach((header, index) => {
      const value = processedValues[index] || ""
      // Try to convert to number if possible
      result[header] = isNaN(Number(value)) ? value : Number(value)
    })

    return result
  })
}

function parseJSON(json: string): any[] {
  try {
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed)) {
      throw new Error("JSON data must be an array of objects")
    }
    return parsed
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function getDataKeys(data: any[]): string[] {
  if (!data || data.length === 0) return []
  return Object.keys(data[0])
}

export function isNumericColumn(data: any[], key: string): boolean {
  return data.every((item) => typeof item[key] === "number")
}

export function getCategoricalColumns(data: any[]): string[] {
  if (!data || data.length === 0) return []
  return Object.keys(data[0]).filter((key) => !isNumericColumn(data, key))
}

export function getNumericColumns(data: any[]): string[] {
  if (!data || data.length === 0) return []
  return Object.keys(data[0]).filter((key) => isNumericColumn(data, key))
}

