package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.BookingDetailsDTO;
import com.webbasedtourguide.entities.TourBooking;
import com.webbasedtourguide.entities.TourGuide;
import com.webbasedtourguide.enums.BookingStatus;
import com.webbasedtourguide.exceptions.BookingTimeException;
import com.webbasedtourguide.exceptions.GuideException;
import com.webbasedtourguide.exceptions.TourException;
import com.webbasedtourguide.repositories.BookingRepository;
import com.webbasedtourguide.repositories.TourPackageRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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

    @Transactional
    public BasicResponse BookNewTour(BookingDetailsDTO request) throws TourException {

        // TODO: Change runtimeExceptions to Exceptions and send back error responses/ implement error handler
        if (request.getBookedTime().isBefore(Instant.now())) throw new TourException("Invalid date");

        TourBooking booking = new TourBooking();
        booking.setTourPackage(packageRepository.findById(request.getPackageId()).
                orElseThrow(() -> new TourException("Package not found")));

        // Finding guide, return fail response if no guides found
        try {
            TourGuide guide = tourGuideService.findSuitableGuide(request.getBookedTime());
            booking.setGuide(guide);
        }
        catch (GuideException e) {
            throw new TourException(e.getMessage());
//            BasicResponse response = new BasicResponse();
//            response.setMessage("No guides available!");
//            response.setSuccess(false);
//
//            return response;
        }

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

    @Transactional
    public BasicResponse cancelTour(BookingDetailsDTO request) throws TourException {
        if (bookingRepository.updateBooking(request.getBookingId(), BookingStatus.CANCELLED) == 1
            && tourGuideService.cancelGuideBooking(request.getGuideId())) {
            request.setSuccess(true);
            request.setMessage("Success");
        }
        throw new TourException("Error cancelling tour");
    }
}
