# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**v1IdvCnMockKycGetPost**](DefaultApi.md#v1IdvCnMockKycGetPost) | **POST** /v1/idv/cn/mock/kyc/get |  |
| [**v1IdvCnMockStartPost**](DefaultApi.md#v1IdvCnMockStartPost) | **POST** /v1/idv/cn/mock/start |  |
| [**v1IdvCnMockStartVerifyPost**](DefaultApi.md#v1IdvCnMockStartVerifyPost) | **POST** /v1/idv/cn/mock/start/verify |  |
| [**v1IdvCnMockTokenPost**](DefaultApi.md#v1IdvCnMockTokenPost) | **POST** /v1/idv/cn/mock/token |  |


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

<a id="v1IdvCnMockStartVerifyPost"></a>
# **v1IdvCnMockStartVerifyPost**
> VerifyRes v1IdvCnMockStartVerifyPost(authorization, verifyReq)



### Example
```kotlin
// Import classes:
//import com.tomoarrow.idv.mock.generated.infrastructure.*
//import com.tomoarrow.idv.mock.generated.models.*

val apiInstance = DefaultApi()
val authorization : kotlin.String = authorization_example // kotlin.String | 
val verifyReq : VerifyReq =  // VerifyReq | 
try {
    val result : VerifyRes = apiInstance.v1IdvCnMockStartVerifyPost(authorization, verifyReq)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#v1IdvCnMockStartVerifyPost")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#v1IdvCnMockStartVerifyPost")
    e.printStackTrace()
}
```

### Parameters
| **authorization** | **kotlin.String**|  | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **verifyReq** | [**VerifyReq**](VerifyReq.md)|  | [optional] |

### Return type

[**VerifyRes**](VerifyRes.md)

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

