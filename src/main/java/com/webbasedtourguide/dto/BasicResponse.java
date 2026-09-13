package com.webbasedtourguide.dto;

public class BasicResponse {

    private boolean success = false;
    private String message;

    public BasicResponse() {
    }

    public BasicResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public static BasicResponse ok() {
        return new BasicResponse(true, "Successful");
    }

    public static BasicResponse badRequest(String message) {
        return new BasicResponse(false, message);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
