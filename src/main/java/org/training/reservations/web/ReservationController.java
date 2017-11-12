package org.training.reservations.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/reservations")
public class ReservationController {
  
  @GetMapping
  public String getReservationList() {
    return "content/reservation/reservation-list";
  }
  
  @GetMapping("/new")
  public String getNewReservationPage() {
    return "content/reservation/reservation";
  }
}
