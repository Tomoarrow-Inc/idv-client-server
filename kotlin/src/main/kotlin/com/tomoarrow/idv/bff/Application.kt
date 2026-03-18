package com.tomoarrow.idv.bff

import com.tomoarrow.idv.bff.config.AppProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(AppProperties::class)
class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
