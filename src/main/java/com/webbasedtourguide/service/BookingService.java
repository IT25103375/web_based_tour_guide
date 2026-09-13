package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.BookingDetailsDTO;
import com.webbasedtourguide.dto.EventDetailsDTO;
import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.entities.TourBooking;
import com.webbasedtourguide.enums.BookingStatus;
import com.webbasedtourguide.exceptions.*;
import com.webbasedtourguide.repositories.BookingRepository;
import com.webbasedtourguide.repositories.TourPackageRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class BookingService {

    private final TourPackageRepository packageRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final TourGuideService tourGuideService;
    private final DiscountService discountService;
    private final EventService eventService;

    BookingService(TourPackageRepository packageRepository, BookingRepository bookingRepository, UserService userService, TourGuideService tourGuideService,
                   DiscountService discountService, EventService eventService) {
        this.packageRepository = packageRepository;
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.tourGuideService = tourGuideService;
        this.discountService = discountService;
        this.eventService = eventService;
    }

    @Transactional
    public BasicResponse BookNewTour(BookingDetailsDTO request) throws TourException, GuideException, UserException {

        // TODO : Handle exceptions properly / implement exception handler
        if (request.getBookedTime().isBefore(Instant.now())) throw new TourException("Invalid date");

        TourBooking booking = new TourBooking();
        booking.setBooker(userService.getCurrentTourist());
        booking.setTourPackage(packageRepository.findById(request.getPackageId()).
                orElseThrow(() -> new TourException("Package not found")));
        booking.setGuide(tourGuideService.findSuitableGuide(request.getBookedTime()));
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

    @Transactional
    public EventDetailsDTO registerForEvent(EventDetailsDTO request) throws TourException, UserException {

        Event event = eventService.getValidEvent(request.getEventId(), request.getPkgId())
                .orElseThrow(() -> new TourException("No such event"));
        TourBooking booking = bookingRepository.
                getTourBookingByIdAndUserId(request.getPkgId(), userService.getCurrentTourist().getId())
                .orElseThrow(() -> new TourException("No such booking"));

        booking.setEvent(event);
        bookingRepository.save(booking);

        request.setSuccess(true);
        request.setMessage("Success");
        return request;
    }
}
