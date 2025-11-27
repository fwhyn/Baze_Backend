package com.fwhyn.backend.helper;

public class Util {

    static public String getEnvOrException(String key) {
        String value = System.getenv(key);
        if (value == null || value.isEmpty()) {
            throw new RuntimeException("Environment variable " + key + " is not set");
        } else {
            return value;
        }
    }
}
