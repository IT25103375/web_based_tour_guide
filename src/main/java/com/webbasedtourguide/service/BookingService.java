package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BookingDetailsDTO;
import com.webbasedtourguide.entities.TourBooking;
import com.webbasedtourguide.enums.BookingStatus;
import com.webbasedtourguide.exceptions.BookingTimeException;
import com.webbasedtourguide.repositories.BookingRepository;
import com.webbasedtourguide.repositories.TourPackageRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
class BookingService {

    private final TourPackageRepository packageRepository;
    private final BookingRepository bookingRepository;
    private final TourGuideService tourGuideService;
    private final DiscountService discountService;

    BookingService(TourPackageRepository packageRepository, BookingRepository bookingRepository, TourGuideService tourGuideService,
                   DiscountService discountService) {
        this.packageRepository = packageRepository;
        this.bookingRepository = bookingRepository;
        this.tourGuideService = tourGuideService;
        this.discountService = discountService;
    }

    public BookingDetailsDTO BookNewTour(BookingDetailsDTO request) {

        if (request.getBookedTime().isBefore(Instant.now())) throw new BookingTimeException("Invalid date");

        TourBooking booking = new TourBooking();
        booking.setTourPackage(packageRepository.findById(request.getPackageId()).
                orElseThrow(() -> new EntityNotFoundException("Package not found")));
        // TODO: Guide needs to be assigned by system; not sent by request
        booking.setGuide(tourGuideService.getGuide(request.getGuideId()));
        booking.setDiscount(discountService.getDiscount(request.getCouponCode(), request.getPackageId()));
        booking.setFinalPrice(discountService.applyDiscount(
                booking.getTourPackage().getPrice(), booking.getDiscount()));
        booking.setBookedDate(request.getBookedTime());
        booking.setStatus(BookingStatus.BOOKED);

        bookingRepository.save(booking);

        BookingDetailsDTO response = new BookingDetailsDTO();
        response.setPackageName(booking.getTourPackage().getDisplayName());
        response.setGuideName(booking.getGuide().getName());
        response.setFinalPrice(booking.getFinalPrice());
        response.setBookedTime(booking.getBookedDate());

        return response;
    }
}
