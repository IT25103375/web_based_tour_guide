package com.webbasedtourguide.dto;

import java.util.Map;

/** { success:false, message:"Validation failed", errors:{ field: message } } */
public class ValidationErrorResponse extends BasicResponse {

    private Map<String, String> errors;

    public ValidationErrorResponse(String message, Map<String, String> errors) {
        super(false, message);
        this.errors = errors;
    }

    public Map<String, String> getErrors() { return errors; }
    public void setErrors(Map<String, String> errors) { this.errors = errors; }
}