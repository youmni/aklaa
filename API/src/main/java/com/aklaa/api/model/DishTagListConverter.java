package com.aklaa.api.model;


import com.aklaa.api.model.enums.DishTag;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Converter
public class DishTagListConverter implements AttributeConverter<List<DishTag>, String> {

    @Override
    public String convertToDatabaseColumn(List<DishTag> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return "";
        }
        return attribute.stream()
                .map(Enum::name)
                .collect(Collectors.joining(","));
    }

    @Override
    public List<DishTag> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return new ArrayList<>();
        }
        return Arrays.stream(dbData.split(","))
                .map(String::trim)
                .map(DishTag::valueOf)
                .collect(Collectors.toList());
    }
}