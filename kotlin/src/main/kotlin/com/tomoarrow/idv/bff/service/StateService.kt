package com.tomoarrow.idv.bff.service

import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap

/**
 * In-memory state storage for access tokens and other session data.
 * Equivalent to the TypeScript StateService singleton.
 */
@Service
class StateService {
    private val state = ConcurrentHashMap<String, Any>()

    fun set(key: String, value: Any) {
        state[key] = value
    }

    fun get(key: String): Any? = state[key]

    fun has(key: String): Boolean = state.containsKey(key)

    fun delete(key: String): Boolean = state.remove(key) != null

    fun getAll(): Map<String, Any> = state.toMap()

    fun clear() = state.clear()
}
