package org.training.reservations.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {
  
  @GetMapping("/")
  public ModelAndView main() {
    ModelAndView mav = new ModelAndView("index");
    mav.addObject("login", "gabord");
    return mav;
  }

}
