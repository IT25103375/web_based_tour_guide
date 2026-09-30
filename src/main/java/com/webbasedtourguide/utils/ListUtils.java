package com.webbasedtourguide.utils;

import java.util.*;
import java.util.function.Predicate;

public class ListUtils {
    public static <T> List<T> getAndRemoveAll(List<T> list, Predicate<? super T> predicate) {
        List<T> removedElements = new ArrayList<>();
        Iterator<T> iterator = list.iterator();

        while (iterator.hasNext()) {
            T element = iterator.next();
            if (predicate.test(element)) {
                removedElements.add(element);
                iterator.remove(); // Safely removes from the underlying list
            }
        }
        return removedElements;
    }
}
