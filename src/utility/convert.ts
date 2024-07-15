/* eslint-disable camelcase */

type TimeType = 'smhdmy' | 'mhdmy'
export function getTime (type: TimeType) {
  const currDate = new Date()
  switch (type) {
    case 'smhdmy':
      return currDate.toLocaleTimeString('en-US', {
        second: '2-digit',
        minute: '2-digit',
        hour: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      })

      break
    case 'mhdmy':
      return currDate.toLocaleTimeString('en-US', {
        minute: '2-digit',
        hour: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      })

      break
    default:
      break
  }
  return currDate.toLocaleTimeString('en-US', {
    second: '2-digit',
    minute: '2-digit',
    hour: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}
export const valueMaker = {
  make: function name (Name: string, label: string) {
    return `shop-${Name}|${label}`.replace(/\s/gi, '_')
  },
  decode: function name (value: string) {
    const string1 = value.slice(5).split('|')[0].replace(/_/gi, ' ')
    const string2 = value.slice(5).split('|')[1].replace(/_/gi, ' ')
    return { Name: string1, label: string2 }
  }
}

type cartType = {
  Order_Id?: number
  Cart_Id?: number
  status?: string
  Args?: string[]
  Args_required?: boolean
  Args_Map?: string
  select_RequiredArgs?: string[]
  select_product?: string
  select_package?: string
  select_price?: number
  addedAt?: string
}

export function cartLiner (cart: cartType[] | null) {
  return cart?.map(
    ({ Cart_Id, select_package, select_price, select_product }) =>
      `> ${Cart_Id}. ${select_package} ( ${select_product} ) | ${select_price} \u09F3`
  )
}

export function argsLiner (cart: cartType[] | null) {
  const array: string[] = []
  cart?.forEach(({ Cart_Id, Args_required, select_RequiredArgs, status }) => {
    if (Args_required === true) {
      if (status === 'pending') {
        select_RequiredArgs?.forEach(r => {
          array.push(`> ${r} ( for ${Cart_Id} )`)
        })
      } else if (status === 'active') {
        select_RequiredArgs?.forEach(r => {
          array.push(`> ~~${r} ( for ${Cart_Id} )~~`)
        })
      }
    } else return undefined
  })
  return array
}

export function timeStringToMs (timeString: string) {
  const regex = /^(\d+)([dhms])$/ // Regular expression to match the time string format
  const matches = timeString.match(regex)
  if (!matches) {
    throw new Error('Invalid time string format')
  }
  const value = parseInt(matches[1])
  const unit = matches[2]
  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60 * 1000
    case 'h':
      return value * 60 * 60 * 1000
    case 'm':
      return value * 60 * 1000
    case 's':
      return value * 1000
    default:
      throw new Error(`Unsupported time unit: ${unit}`)
  }
}

export function ParseColorCode (str: string): number {
  const colorCodeRegex = /^(#|0x)?([a-fA-F0-9]{6})$/
  const match = colorCodeRegex.exec(str)

  if (match) {
    const hex = match[2]
    const decimal = parseInt(hex, 16)
    return decimal
  }

  return 0xffffff
}

export function MapRules (rules: string | any[]) {
  if (rules.length === 0) {
    return ' '
  }
  const ruleMap = new Map<string, string[]>()
  for (const rule of rules) {
    let { type, rule: ruleText } = rule
    if (!type.endsWith('Terms')) {
      type += ' Terms'
    }
    if (!ruleMap.has(type)) {
      ruleMap.set(type, [])
    }
    ruleMap.get(type)?.push(ruleText)
  }
  return [...ruleMap.entries()]
    .map(([type, rules]) => {
      const ruleText = rules.map(rule => `\`\`\`js\n◉ ${rule}\`\`\``).join('\n')
      return `**${type}:**\n${ruleText}`
    })
    .join('\n')
}
