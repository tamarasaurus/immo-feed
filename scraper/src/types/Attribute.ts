export interface DataAttribute {
  name: string
  key?: string
}

export default interface Attribute {
  type: any
  selector?: string
  attribute?: string
  data?: DataAttribute
}
