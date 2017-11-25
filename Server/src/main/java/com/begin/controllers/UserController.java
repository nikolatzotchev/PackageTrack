package com.begin.controllers;

import com.begin.dto.UserDTO;
import com.begin.entities.User;
import com.begin.exeptions.EmailUsedException;
import com.begin.repositories.UserRepository;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

  private final UserRepository userRepository;

  @Autowired
  public UserController (UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @PostMapping(path = "/register")
  public String registerUser(@RequestBody @Valid UserDTO userDTO) throws EmailUsedException {
      if (this.userRepository.findByEmail(userDTO.getEmail()) != null) {
        throw new EmailUsedException("Account with this email already exist.");
      }
      User user = new User();
      user.setFirstName(userDTO.getFirstName());
      user.setLastName(userDTO.getLastName());
      user.setEmail(userDTO.getEmail());
      user.setPassword(userDTO.getPassword());

      this.userRepository.save(user);
      return "registered";
  }
}
