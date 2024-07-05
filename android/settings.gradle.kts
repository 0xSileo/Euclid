import groovy.lang.Closure

includeBuild("../node_modules/@react-native/gradle-plugin")

// See: https://stackoverflow.com/a/64368918
apply(from = File("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"))
val applyNativeModules: Closure<Project> = extra.get("applyNativeModulesSettingsGradle") as Closure<Project>
applyNativeModules(settings)

pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    // See: https://stackoverflow.com/a/69197871
    // repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        // See: https://stackoverflow.com/a/48243501
        maven(url = "https://jitpack.io")
    }
}

rootProject.name = "mopro-app"
include(":app")
