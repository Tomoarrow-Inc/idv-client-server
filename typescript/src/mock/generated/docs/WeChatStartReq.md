
# WeChatStartReq


## Properties

Name | Type
------------ | -------------
`callback_url` | string
`country` | string
`login_hint` | string

## Example

```typescript
import type { WeChatStartReq } from ''

// TODO: Update the object below with actual values
const example = {
  "callback_url": null,
  "country": null,
  "login_hint": null,
} satisfies WeChatStartReq

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WeChatStartReq
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


