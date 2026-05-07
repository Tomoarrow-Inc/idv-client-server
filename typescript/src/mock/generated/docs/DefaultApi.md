# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1IdvCnMockKycGetPost**](DefaultApi.md#v1idvcnmockkycgetpost) | **POST** /v1/idv/cn/mock/kyc/get |  |
| [**v1IdvCnMockStartPost**](DefaultApi.md#v1idvcnmockstartpost) | **POST** /v1/idv/cn/mock/start |  |
| [**v1IdvCnMockStartVerifyPost**](DefaultApi.md#v1idvcnmockstartverifypost) | **POST** /v1/idv/cn/mock/start/verify |  |
| [**v1IdvCnMockTokenPost**](DefaultApi.md#v1idvcnmocktokenpost) | **POST** /v1/idv/cn/mock/token |  |



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


## v1IdvCnMockStartVerifyPost

> VerifyRes v1IdvCnMockStartVerifyPost(Authorization, VerifyReq)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { V1IdvCnMockStartVerifyPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string (optional)
    Authorization: Authorization_example,
    // VerifyReq (optional)
    VerifyReq: ...,
  } satisfies V1IdvCnMockStartVerifyPostRequest;

  try {
    const data = await api.v1IdvCnMockStartVerifyPost(body);
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
| **VerifyReq** | [VerifyReq](VerifyReq.md) |  | [Optional] |

### Return type

[**VerifyRes**](VerifyRes.md)

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

