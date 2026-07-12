package com.back.capstone.dto;
import jakarta.validation.constraints.*; import java.time.Instant;
public final class AuthDtos { private AuthDtos(){}
 public record RegisterRequest(@NotBlank @Size(max=50) String username,@NotBlank @Email String email,@NotBlank @Size(min=8,max=100) String password,@NotBlank String confirmPassword){}
 public record LoginRequest(@NotBlank String usernameOrEmail,@NotBlank String password){}
 public record UserResponse(Long id,String username,String email,String profileImageUrl,Instant createdAt){}
 public record AuthResponse(String token,UserResponse user){}
 public record UpdateProfileRequest(@NotBlank @Size(max=50) String username){}
 public record ChangePasswordRequest(@NotBlank String currentPassword,@NotBlank @Size(min=8,max=100) String newPassword,@NotBlank String confirmPassword){}
}
