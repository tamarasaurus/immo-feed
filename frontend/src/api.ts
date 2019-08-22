const API_URL = process.env.REACT_APP_API_URL || '/'

export async function get(url: string) {
  const res = await fetch(API_URL + url, {})
  return await res.json()
}
