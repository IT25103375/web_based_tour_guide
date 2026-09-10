package com.webbasedtourguide.deserializers;

import tools.jackson.databind.util.StdConverter;

public class UpperCaseDeserialize extends StdConverter<String, String> {

    @Override
    public String convert(String value) { return (value == null) ? null : value.toUpperCase(); }
}
