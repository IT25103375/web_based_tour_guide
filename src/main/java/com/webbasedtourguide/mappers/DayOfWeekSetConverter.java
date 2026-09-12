package com.webbasedtourguide.mappers;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.DayOfWeek;
import java.util.EnumSet;

@Converter
public class DayOfWeekSetConverter implements AttributeConverter<EnumSet<DayOfWeek>, Integer> {

    @Override
    public Integer convertToDatabaseColumn(EnumSet<DayOfWeek> attribute) {
        if (attribute == null) return 0;
        int bitmask = 0;
        for (DayOfWeek day : attribute) {
            bitmask |= (1 << day.ordinal());
        }
        return bitmask;
    }

    @Override
    public EnumSet<DayOfWeek> convertToEntityAttribute(Integer dbData) {
        EnumSet<DayOfWeek> set = EnumSet.noneOf(DayOfWeek.class);
        if (dbData == null) return set;
        for (DayOfWeek day : DayOfWeek.values()) {
            if ((dbData & (1 << day.ordinal())) != 0) {
                set.add(day);
            }
        }
        return set;
    }
}
