package com.webbasedtourguide.service;

import com.webbasedtourguide.dto.BasicResponse;
import com.webbasedtourguide.dto.BookingDetailsDTO;
import com.webbasedtourguide.dto.EventDetailsDTO;
import com.webbasedtourguide.dto.PriceQuoteDTO;
import com.webbasedtourguide.entities.Discount;
import com.webbasedtourguide.entities.Event;
import com.webbasedtourguide.entities.TourPackage;
import com.webbasedtourguide.entities.TourBooking;
import com.webbasedtourguide.enums.BookingStatus;
import com.webbasedtourguide.exceptions.*;
import com.webbasedtourguide.mappers.BookingMapper;
import com.webbasedtourguide.repositories.BookingRepository;
import com.webbasedtourguide.repositories.TourPackageRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
public class BookingService {

    private final TourPackageRepository packageRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final TourGuideService tourGuideService;
    private final DiscountService discountService;
    private final EventService eventService;
    private final BookingMapper bookingMapper;

    BookingService(TourPackageRepository packageRepository, BookingRepository bookingRepository, UserService userService, TourGuideService tourGuideService,
                   DiscountService discountService, EventService eventService, BookingMapper bookingMapper) {
        this.packageRepository = packageRepository;
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.tourGuideService = tourGuideService;
        this.discountService = discountService;
        this.eventService = eventService;
        this.bookingMapper = bookingMapper;
    }

    @Transactional
    public BasicResponse bookNewTour(BookingDetailsDTO request) throws TourException, GuideException, UserException {

        // TODO : Handle exceptions properly / implement exception handler
        if (request.getBookedDate() == null || request.getBookedDate().isBefore(Instant.now()))
            throw new TourException("Invalid date");

        TourBooking booking = new TourBooking();
        booking.setBooker(userService.getCurrentTourist());
        TourPackage tourPackage = packageRepository.findById(request.getPackageId()).
                orElseThrow(() -> new TourException("Package not found"));
        booking.setTourPackage(tourPackage);
        booking.setGuide(tourGuideService.findSuitableGuide(request.getBookedDate()));
        booking.setDiscount(discountService.getDiscount(request.getCouponCode(), tourPackage.getId(), tourPackage.getPrice()));

        if (booking.getDiscount() != null)
            booking.setFinalPrice(discountService.applyDiscount(
                    booking.getTourPackage().getPrice(), booking.getDiscount()));
        else
            booking.setFinalPrice(booking.getTourPackage().getPrice());

        booking.setBookedDate(request.getBookedDate());
        booking.setStatus(BookingStatus.BOOKED);

        tourGuideService.setGuideBooked(booking.getGuide().getId());
        bookingRepository.save(booking);

        BookingDetailsDTO response = new BookingDetailsDTO();
        response.setBookingId(booking.getId());
        response.setStatus(booking.getStatus());
        response.setPackageName(booking.getTourPackage().getDisplayName());
        response.setGuideName(booking.getGuide().getName());
        response.setFinalPrice(booking.getFinalPrice());
        response.setBookedDate(booking.getBookedDate());

        return response;
    }

    @Transactional
    public BasicResponse cancelTour(BookingDetailsDTO request) throws TourException {
        if (request.getBookingId() == null) throw new TourException("No booking specified");

        // Only the booker's own booking can be canceled
        TourBooking booking = bookingRepository.verifyTourBooking(request.getBookingId(),
                        userService.getCurrentTourist().getId())
                .orElseThrow(() -> new TourException("No such booking"));
        if (booking.getStatus() != BookingStatus.BOOKED)
            throw new TourException("Only active bookings can be cancelled");
        if (!booking.getBookedDate().isAfter(Instant.now()))
            throw new TourException("This tour has already taken place");

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        // The guide only becomes available again once none of their other bookings are active
        if (bookingRepository.countByGuide_IdAndStatus(booking.getGuide().getId(), BookingStatus.BOOKED) == 0)
            tourGuideService.cancelGuideBooking(booking.getGuide().getId());

        return BasicResponse.ok();
    }

    @Transactional
    public EventDetailsDTO registerForEvent(EventDetailsDTO request) throws TourException, UserException {

        if (request.getBookingId() == null) throw new TourException("Select one of your bookings");

        TourBooking booking = bookingRepository.verifyTourBooking(request.getBookingId(),
                        userService.getCurrentTourist().getId())
                .orElseThrow(() -> new TourException("No such booking"));
        if (booking.getStatus() != BookingStatus.BOOKED)
            throw new TourException("Only active bookings can register for events");

        // The event must be offered with this booking's package and not be over yet
        Event event = eventService.getValidEvent(request.getEventId(), booking.getTourPackage().getId())
                .orElseThrow(() -> new TourException("This event is not available for your package"));

        if (booking.getEvent() != null && booking.getEvent().getId().equals(event.getId()))
            throw new TourException("You are already registered for this event");
        if (event.getCapacity() != null && bookingRepository.countByEvent_IdAndStatusNot(
                event.getId(), BookingStatus.CANCELLED) >= event.getCapacity())
            throw new TourException("This event is full");

        // The event price is part of the booking total; swap out the old event's price if replacing it
        BigDecimal total = booking.getFinalPrice();
        if (booking.getEvent() != null) total = total.subtract(booking.getEvent().getPrice());
        booking.setFinalPrice(total.add(event.getPrice()));

        booking.setEvent(event);
        bookingRepository.save(booking);

        request.setSuccess(true);
        request.setMessage("Success");
        return request;
    }

    // Price preview for the booking dialog, including any discount that would be applied
    public PriceQuoteDTO quote(Integer packageId, String couponCode) throws TourException {
        TourPackage tourPackage = packageRepository.findById(packageId)
                .orElseThrow(() -> new TourException("Package not found"));
        Discount discount = discountService.getDiscount(couponCode, tourPackage.getId(), tourPackage.getPrice());

        PriceQuoteDTO quote = new PriceQuoteDTO();
        quote.setOriginalPrice(tourPackage.getPrice());
        if (discount == null) {
            quote.setFinalPrice(tourPackage.getPrice());
        } else {
            quote.setFinalPrice(discountService.applyDiscount(tourPackage.getPrice(), discount));
            quote.setDiscountApplied(true);
            quote.setDiscountDescription(discountService.describe(discount));
        }
        return quote;
    }

    public List<BookingDetailsDTO> getAllBookingsForUser() {
        return bookingMapper.toDtoList(bookingRepository.getTourBookingsById(
                userService.getCurrentTourist().getId()));
    }
}
