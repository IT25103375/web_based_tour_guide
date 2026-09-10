package com.webbasedtourguide.deserializers;

import tools.jackson.databind.util.StdConverter;

public class LowerCaseDeserialize extends StdConverter<String, String> {

    @Override
    public String convert(String value) { return (value == null) ? null : value.toLowerCase(); }
}
