# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1IdvCnMockKycGetPost**](DefaultApi.md#v1idvcnmockkycgetpost) | **POST** /v1/idv/cn/mock/kyc/get |  |
| [**v1IdvCnMockStartPost**](DefaultApi.md#v1idvcnmockstartpost) | **POST** /v1/idv/cn/mock/start |  |
| [**v1IdvCnMockTokenPost**](DefaultApi.md#v1idvcnmocktokenpost) | **POST** /v1/idv/cn/mock/token |  |
| [**v1IdvSocialWechatMockCallbackGet**](DefaultApi.md#v1idvsocialwechatmockcallbackget) | **GET** /v1/idv/social/wechat-mock/callback |  |
| [**v1IdvSocialWechatMockLoginGet**](DefaultApi.md#v1idvsocialwechatmockloginget) | **GET** /v1/idv/social/wechat-mock/login |  |
| [**v1IdvSocialWechatMockStartPost**](DefaultApi.md#v1idvsocialwechatmockstartpost) | **POST** /v1/idv/social/wechat-mock/start |  |



## v1IdvCnMockKycGetPost

> any v1IdvCnMockKycGetPost(Authorization, TomoIdvMockGetResultReq)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { V1IdvCnMockKycGetPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string (optional)
    Authorization: Authorization_example,
    // TomoIdvMockGetResultReq (optional)
    TomoIdvMockGetResultReq: ...,
  } satisfies V1IdvCnMockKycGetPostRequest;

  try {
    const data = await api.v1IdvCnMockKycGetPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **Authorization** | `string` |  | [Optional] [Defaults to `undefined`] |
| **TomoIdvMockGetResultReq** | [TomoIdvMockGetResultReq](TomoIdvMockGetResultReq.md) |  | [Optional] |

### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json;charset=utf-8`
- **Accept**: `application/json;charset=utf-8`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **400** | Invalid &#x60;body&#x60; or &#x60;Authorization&#x60; |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1IdvCnMockStartPost

> TomoIdvMockStartRes v1IdvCnMockStartPost(Authorization, TomoIdvMockStartReq)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { V1IdvCnMockStartPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string (optional)
    Authorization: Authorization_example,
    // TomoIdvMockStartReq (optional)
    TomoIdvMockStartReq: ...,
  } satisfies V1IdvCnMockStartPostRequest;

  try {
    const data = await api.v1IdvCnMockStartPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **Authorization** | `string` |  | [Optional] [Defaults to `undefined`] |
| **TomoIdvMockStartReq** | [TomoIdvMockStartReq](TomoIdvMockStartReq.md) |  | [Optional] |

### Return type

[**TomoIdvMockStartRes**](TomoIdvMockStartRes.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json;charset=utf-8`
- **Accept**: `application/json;charset=utf-8`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **400** | Invalid &#x60;body&#x60; or &#x60;Authorization&#x60; |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1IdvCnMockTokenPost

> TomoIdvMockIssueTokenRes v1IdvCnMockTokenPost(Authorization, TomoIdvMockIssueTokenReq)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { V1IdvCnMockTokenPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string (optional)
    Authorization: Authorization_example,
    // TomoIdvMockIssueTokenReq (optional)
    TomoIdvMockIssueTokenReq: ...,
  } satisfies V1IdvCnMockTokenPostRequest;

  try {
    const data = await api.v1IdvCnMockTokenPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **Authorization** | `string` |  | [Optional] [Defaults to `undefined`] |
| **TomoIdvMockIssueTokenReq** | [TomoIdvMockIssueTokenReq](TomoIdvMockIssueTokenReq.md) |  | [Optional] |

### Return type

[**TomoIdvMockIssueTokenRes**](TomoIdvMockIssueTokenRes.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json;charset=utf-8`
- **Accept**: `application/json;charset=utf-8`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **400** | Invalid &#x60;body&#x60; or &#x60;Authorization&#x60; |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1IdvSocialWechatMockCallbackGet

> v1IdvSocialWechatMockCallbackGet(code, state, error)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { V1IdvSocialWechatMockCallbackGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string (optional)
    code: code_example,
    // string (optional)
    state: state_example,
    // string (optional)
    error: error_example,
  } satisfies V1IdvSocialWechatMockCallbackGetRequest;

  try {
    const data = await api.v1IdvSocialWechatMockCallbackGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **code** | `string` |  | [Optional] [Defaults to `undefined`] |
| **state** | `string` |  | [Optional] [Defaults to `undefined`] |
| **error** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json;charset=utf-8`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **302** |  |  * Location -  <br>  |
| **400** | Invalid &#x60;error&#x60; or &#x60;state&#x60; or &#x60;code&#x60; |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1IdvSocialWechatMockLoginGet

> string v1IdvSocialWechatMockLoginGet(state)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { V1IdvSocialWechatMockLoginGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string (optional)
    state: state_example,
  } satisfies V1IdvSocialWechatMockLoginGetRequest;

  try {
    const data = await api.v1IdvSocialWechatMockLoginGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **state** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/html;charset=utf-8`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **400** | Invalid &#x60;state&#x60; |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1IdvSocialWechatMockStartPost

> WeChatStartResp v1IdvSocialWechatMockStartPost(Authorization, WeChatStartReq)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { V1IdvSocialWechatMockStartPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string (optional)
    Authorization: Authorization_example,
    // WeChatStartReq (optional)
    WeChatStartReq: ...,
  } satisfies V1IdvSocialWechatMockStartPostRequest;

  try {
    const data = await api.v1IdvSocialWechatMockStartPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **Authorization** | `string` |  | [Optional] [Defaults to `undefined`] |
| **WeChatStartReq** | [WeChatStartReq](WeChatStartReq.md) |  | [Optional] |

### Return type

[**WeChatStartResp**](WeChatStartResp.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json;charset=utf-8`
- **Accept**: `application/json;charset=utf-8`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **400** | Invalid &#x60;body&#x60; or &#x60;Authorization&#x60; |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

