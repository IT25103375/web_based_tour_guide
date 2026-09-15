package com.webbasedtourguide.dto;

import java.math.BigDecimal;

/** Small package view used inside discount responses and the package picker in the UI. */
public class PackageSummaryDTO {

    private Integer id;
    private String displayName;
    private BigDecimal price;

    public PackageSummaryDTO() {}

    public PackageSummaryDTO(Integer id, String displayName, BigDecimal price) {
        this.id = id;
        this.displayName = displayName;
        this.price = price;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}