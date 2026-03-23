# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**v1IdvCnMockKycGetPost**](DefaultApi.md#v1IdvCnMockKycGetPost) | **POST** /v1/idv/cn/mock/kyc/get |  |
| [**v1IdvCnMockStartPost**](DefaultApi.md#v1IdvCnMockStartPost) | **POST** /v1/idv/cn/mock/start |  |
| [**v1IdvCnMockTokenPost**](DefaultApi.md#v1IdvCnMockTokenPost) | **POST** /v1/idv/cn/mock/token |  |
| [**v1IdvSocialWechatMockCallbackGet**](DefaultApi.md#v1IdvSocialWechatMockCallbackGet) | **GET** /v1/idv/social/wechat-mock/callback |  |
| [**v1IdvSocialWechatMockLoginGet**](DefaultApi.md#v1IdvSocialWechatMockLoginGet) | **GET** /v1/idv/social/wechat-mock/login |  |
| [**v1IdvSocialWechatMockStartPost**](DefaultApi.md#v1IdvSocialWechatMockStartPost) | **POST** /v1/idv/social/wechat-mock/start |  |


<a id="v1IdvCnMockKycGetPost"></a>
# **v1IdvCnMockKycGetPost**
> kotlin.Any v1IdvCnMockKycGetPost(authorization, tomoIdvMockGetResultReq)



### Example
```kotlin
// Import classes:
//import com.tomoarrow.idv.mock.generated.infrastructure.*
//import com.tomoarrow.idv.mock.generated.models.*

val apiInstance = DefaultApi()
val authorization : kotlin.String = authorization_example // kotlin.String | 
val tomoIdvMockGetResultReq : TomoIdvMockGetResultReq =  // TomoIdvMockGetResultReq | 
try {
    val result : kotlin.Any = apiInstance.v1IdvCnMockKycGetPost(authorization, tomoIdvMockGetResultReq)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#v1IdvCnMockKycGetPost")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#v1IdvCnMockKycGetPost")
    e.printStackTrace()
}
```

### Parameters
| **authorization** | **kotlin.String**|  | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **tomoIdvMockGetResultReq** | [**TomoIdvMockGetResultReq**](TomoIdvMockGetResultReq.md)|  | [optional] |

### Return type

[**kotlin.Any**](kotlin.Any.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json;charset=utf-8
 - **Accept**: application/json;charset=utf-8

<a id="v1IdvCnMockStartPost"></a>
# **v1IdvCnMockStartPost**
> TomoIdvMockStartRes v1IdvCnMockStartPost(authorization, tomoIdvMockStartReq)



### Example
```kotlin
// Import classes:
//import com.tomoarrow.idv.mock.generated.infrastructure.*
//import com.tomoarrow.idv.mock.generated.models.*

val apiInstance = DefaultApi()
val authorization : kotlin.String = authorization_example // kotlin.String | 
val tomoIdvMockStartReq : TomoIdvMockStartReq =  // TomoIdvMockStartReq | 
try {
    val result : TomoIdvMockStartRes = apiInstance.v1IdvCnMockStartPost(authorization, tomoIdvMockStartReq)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#v1IdvCnMockStartPost")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#v1IdvCnMockStartPost")
    e.printStackTrace()
}
```

### Parameters
| **authorization** | **kotlin.String**|  | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **tomoIdvMockStartReq** | [**TomoIdvMockStartReq**](TomoIdvMockStartReq.md)|  | [optional] |

### Return type

[**TomoIdvMockStartRes**](TomoIdvMockStartRes.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json;charset=utf-8
 - **Accept**: application/json;charset=utf-8

<a id="v1IdvCnMockTokenPost"></a>
# **v1IdvCnMockTokenPost**
> TomoIdvMockIssueTokenRes v1IdvCnMockTokenPost(authorization, tomoIdvMockIssueTokenReq)



### Example
```kotlin
// Import classes:
//import com.tomoarrow.idv.mock.generated.infrastructure.*
//import com.tomoarrow.idv.mock.generated.models.*

val apiInstance = DefaultApi()
val authorization : kotlin.String = authorization_example // kotlin.String | 
val tomoIdvMockIssueTokenReq : TomoIdvMockIssueTokenReq =  // TomoIdvMockIssueTokenReq | 
try {
    val result : TomoIdvMockIssueTokenRes = apiInstance.v1IdvCnMockTokenPost(authorization, tomoIdvMockIssueTokenReq)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#v1IdvCnMockTokenPost")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#v1IdvCnMockTokenPost")
    e.printStackTrace()
}
```

### Parameters
| **authorization** | **kotlin.String**|  | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **tomoIdvMockIssueTokenReq** | [**TomoIdvMockIssueTokenReq**](TomoIdvMockIssueTokenReq.md)|  | [optional] |

### Return type

[**TomoIdvMockIssueTokenRes**](TomoIdvMockIssueTokenRes.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json;charset=utf-8
 - **Accept**: application/json;charset=utf-8

<a id="v1IdvSocialWechatMockCallbackGet"></a>
# **v1IdvSocialWechatMockCallbackGet**
> v1IdvSocialWechatMockCallbackGet(code, state, error)



### Example
```kotlin
// Import classes:
//import com.tomoarrow.idv.mock.generated.infrastructure.*
//import com.tomoarrow.idv.mock.generated.models.*

val apiInstance = DefaultApi()
val code : kotlin.String = code_example // kotlin.String | 
val state : kotlin.String = state_example // kotlin.String | 
val error : kotlin.String = error_example // kotlin.String | 
try {
    apiInstance.v1IdvSocialWechatMockCallbackGet(code, state, error)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#v1IdvSocialWechatMockCallbackGet")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#v1IdvSocialWechatMockCallbackGet")
    e.printStackTrace()
}
```

### Parameters
| **code** | **kotlin.String**|  | [optional] |
| **state** | **kotlin.String**|  | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **error** | **kotlin.String**|  | [optional] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json;charset=utf-8

<a id="v1IdvSocialWechatMockLoginGet"></a>
# **v1IdvSocialWechatMockLoginGet**
> kotlin.String v1IdvSocialWechatMockLoginGet(state)



### Example
```kotlin
// Import classes:
//import com.tomoarrow.idv.mock.generated.infrastructure.*
//import com.tomoarrow.idv.mock.generated.models.*

val apiInstance = DefaultApi()
val state : kotlin.String = state_example // kotlin.String | 
try {
    val result : kotlin.String = apiInstance.v1IdvSocialWechatMockLoginGet(state)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#v1IdvSocialWechatMockLoginGet")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#v1IdvSocialWechatMockLoginGet")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **state** | **kotlin.String**|  | [optional] |

### Return type

**kotlin.String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a id="v1IdvSocialWechatMockStartPost"></a>
# **v1IdvSocialWechatMockStartPost**
> WeChatStartResp v1IdvSocialWechatMockStartPost(authorization, weChatStartReq)



### Example
```kotlin
// Import classes:
//import com.tomoarrow.idv.mock.generated.infrastructure.*
//import com.tomoarrow.idv.mock.generated.models.*

val apiInstance = DefaultApi()
val authorization : kotlin.String = authorization_example // kotlin.String | 
val weChatStartReq : WeChatStartReq =  // WeChatStartReq | 
try {
    val result : WeChatStartResp = apiInstance.v1IdvSocialWechatMockStartPost(authorization, weChatStartReq)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#v1IdvSocialWechatMockStartPost")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#v1IdvSocialWechatMockStartPost")
    e.printStackTrace()
}
```

### Parameters
| **authorization** | **kotlin.String**|  | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **weChatStartReq** | [**WeChatStartReq**](WeChatStartReq.md)|  | [optional] |

### Return type

[**WeChatStartResp**](WeChatStartResp.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json;charset=utf-8
 - **Accept**: application/json;charset=utf-8

